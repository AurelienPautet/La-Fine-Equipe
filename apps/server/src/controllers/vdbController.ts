import { Request, Response } from "express";
import { db, getPool } from "@lafineequipe/db";
import {
  events,
  regulations,
  teamMembers,
  divisions,
  figures,
  documentChunks,
  regulationsCategories,
  simpleMembersSettings,
  actifMembersSettings,
} from "@lafineequipe/db/schema";
import { eq, isNull, count } from "drizzle-orm";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: GEMINI_API_KEY,
});

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const descriptionFineEquipe = `La Qui Sommes-Nous ?
La Fine Équipe est une association de l’Université Jean Moulin Lyon III, prônant l’entraide et l’engagement, et comptant huit élus au sein de ses membres.
Apolitiques et apartisans, nous sommes indépendants et ne recevons aucun financement extérieur à l’Université.
Inclusif, nous avons également la particularité d’être la seule association de l’Université dotée d’un pôle handicap.
Présentation La Fine Équipe
Les membres et les élus de La Fine Équipe se donnent pour mission d’incarner et de porter les revendications des étudiants de Lyon III auprès des instances décisionnelles.
Pour cela, nous avons mis en place un cahier de doléances anonyme sur notre Linktree, et réalisons régulièrement sur nos réseaux sociaux et sur les campus, des sondages pour connaître les attentes, les opinions et les problèmes auxquels les étudiants sont confrontés dans leur vie quotidienne。
`;

const historyFineEquipe = `Notre Histoire
Créée en novembre 2023, au en vue des élections au Conseil de la faculté de Droit, la liste de La Fine Équipe a rapidement évolué, pour devenir dès la rentrée 2024 une des principales associations étudiantes de l'Université Lyon III. De portée généraliste, nous organisons des conférences, des ateliers de conversation, et agissons au travers de notre pôle handicap.

Nous travaillons aussi à faire participer directement les étudiants à la vie de l'Université , en proposant des listes d'étudiants ordinaires, sur une ligne apolitique et apartisane , aux élections des différents organes représentatifs des usagers .`;

const clarificationFineEquipe = `
Le président de la fine equipe est le président du pôle Bureau
`;

export async function initializeVectorStore() {
  const nbChunks = await db
    .select({ count: count(documentChunks.id) })
    .from(documentChunks);
  const nbChunckCount = nbChunks[0]?.count || 0;
  if (nbChunckCount > 0) {
    console.log(
      `Vector store already initialized with ${nbChunckCount} chunks. Skipping initialization.`
    );
    return;
  }

  const pool = getPool();

  const config = {
    pool,
    tableName: '"LaFineEquipe-document_chunks"',
    vectorColumnName: "embedding",
    contentColumnName: "text",
    metadataColumnName: "metadata",
    dimensions: 768,
  };

  const vectorStore = await PGVectorStore.initialize(embeddings, config);

  const allEvents = await db
    .select()
    .from(events)
    .where(isNull(events.deletedAt));

  const allRegulations = await db
    .select()
    .from(regulations)
    .leftJoin(
      regulationsCategories,
      eq(regulations.categoryId, regulationsCategories.id)
    )
    .where(isNull(regulations.deletedAt));

  const StringlistOfAllEvents = allEvents
    .map(
      (event) =>
        `- ${event.title} qui se déroule à ${event.location} du ${event.startDate} au ${event.endDate}`
    )
    .join("\n");

  const StringlistOfAllRegulations = allRegulations
    .map(
      (reg) =>
        `-${reg["LaFineEquipe-regulations_categories"]?.name || "N/A"} : ${
          reg["LaFineEquipe-regulations"].title
        } : ${reg["LaFineEquipe-regulations"].description} du ${
          reg["LaFineEquipe-regulations"].date
        }`
    )
    .join("\n");

  const simpleMembersSettingsResult = await db
    .select()
    .from(simpleMembersSettings);
  const actifMembersSettingsResult = await db
    .select()
    .from(actifMembersSettings);

  const becomingMemberFineEquipe = `Devenir Membre de La Fine Equipe
Nous sommes toujours à la recherche de nouveaux membres ! Si tu souhaites t’investir à La Fine Équipe, nous soutenir ou simplement te tenir informé de nos prochains évènements, devenir membre est exactement ce qui nous aide le plus. Pour cela, deux choix s’offrent à toi : l’adhésion simple, ou l’adhésion en tant que membre actif.

L’adhésion simple est valable à vie. Celle-ci permet :

D’être informé de l’actualité de La Fine Équipe
D’être prioritaire pour les places à nos évènements
D’intégrer, voire de créer un pôle pour faire vivre l’Association et réaliser tes projets
D’être candidat sur l’une de nos listes.
L'adhésion en tant que membre actif confère tous les avantages de l'adhésion simple, et permet, pour l'année scolaire en cours, moyennant une contribution de ${
    actifMembersSettingsResult[0]?.price || "XX"
  } euros :

De voter aux réunions de l’Assemblée générale
D’intégrer le Conseil d’administration ou le bureau le cas échéant
D’être candidat en bonne place
Et de nous soutenir financièrement !

Voici les liens pour adhérer :
- Adhésion simple ${simpleMembersSettingsResult[0]?.url || "URL_N_A"}

- Adhésion active (${actifMembersSettingsResult[0]?.price || "XX"} euros) : ${
    actifMembersSettingsResult[0]?.url || "URL_N_A"
  }

Si tu as des questions, n’hésite pas à nous contacter, par mail ou sur nos réseaux. Merci d’avance !`;

  const documentsToSplit = [
    { pageContent: descriptionFineEquipe, metadata: { sourceType: "info" } },
    { pageContent: historyFineEquipe, metadata: { sourceType: "info" } },
    { pageContent: becomingMemberFineEquipe, metadata: { sourceType: "info" } },
    ...allEvents.map((event) => ({
      pageContent: `Événement: ${event.title}. Lieu: ${event.location}. Du ${event.startDate} au ${event.endDate}. Content: ${event.content}. Nb max participants: ${event.maxAttendees}.`,
      metadata: {
        sourceType: "event",
        sourceId: event.id.toString(),
        author: event.author,
      },
    })),
  ];

  const chunks = await textSplitter.createDocuments(
    documentsToSplit.map((d) => d.pageContent),
    documentsToSplit.map((d) => d.metadata)
  );

  const allMembers = await db
    .select()
    .from(teamMembers)
    .leftJoin(divisions, eq(teamMembers.divisionId, divisions.id))
    .where(isNull(teamMembers.deletedAt));

  const allFigures = await db
    .select()
    .from(figures)
    .where(isNull(figures.deletedAt));

  const membersList = allMembers
    .map(
      (m) =>
        `- ${m["LaFineEquipe-team_members"].firstName} ${
          m["LaFineEquipe-team_members"].lastName
        } est ${m["LaFineEquipe-team_members"].role} au sein du pôle ${
          m["LaFineEquipe-divisions"]?.name || "N/A"
        }`
    )
    .join("\n");

  const figuresList = allFigures
    .map((f) => `- ${f.figure}: ${f.description}`)
    .join("\n");

  const factChunks = [
    {
      pageContent: `Membres de la Fine Equipe (${clarificationFineEquipe}):\n${membersList}`,
      metadata: { sourceType: "members" },
    },
    {
      pageContent: `Chiffres clés de la Fine Equipe:\n${figuresList}`,
      metadata: { sourceType: "figures" },
    },
    {
      pageContent: `Liste des événements:\n${StringlistOfAllEvents}`,
      metadata: { sourceType: "events_list" },
    },
    {
      pageContent: `Liste des règlements:\n${StringlistOfAllRegulations}`,
      metadata: { sourceType: "regulations_list" },
    },
  ];

  console.log(
    `Adding ${chunks.length} event chunks and ${factChunks.length} fact chunks to vector store...`
  );

  const allDocuments = [...chunks, ...factChunks];

  await vectorStore.addDocuments(allDocuments);
}
