import { Request, Response } from "express";
import { db, getPool } from "@lafineequipe/db";
import {
  events,
  regulations,
  teamMembers,
  divisions,
  figures,
} from "@lafineequipe/db/schema";
import { eq, isNull } from "drizzle-orm";
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
Le président de la fine equipe est le président de la division Bureau
`;

const pool = getPool();

export const config = {
  pool,
  tableName: '"LaFineEquipe-document_chunks"',
  vectorColumnName: "embedding",
  contentColumnName: "text",
  metadataColumnName: "metadata",
  dimensions: 768,
};

export async function initializeVectorStore() {
  const nbChunks = await pool.query(
    `SELECT COUNT(*) FROM "LaFineEquipe-document_chunks"`
  );
  const count = parseInt(nbChunks.rows[0].count, 10);
  if (count > 0) {
    console.log(
      `Vector store already initialized with ${count} chunks. Skipping initialization.`
    );
    return;
  }

  const vectorStore = await PGVectorStore.initialize(embeddings, config);

  const allEvents = await db
    .select()
    .from(events)
    .where(isNull(events.deletedAt));

  const documentsToSplit = [
    { pageContent: descriptionFineEquipe, metadata: { sourceType: "info" } },
    { pageContent: historyFineEquipe, metadata: { sourceType: "info" } },
    { pageContent: clarificationFineEquipe, metadata: { sourceType: "info" } },
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

  const factChunks = [
    ...allMembers.map((m) => ({
      pageContent: `${m["LaFineEquipe-team_members"].firstName} ${
        m["LaFineEquipe-team_members"].lastName
      } est ${m["LaFineEquipe-team_members"].role} au sein de la division ${
        m["LaFineEquipe-divisions"]?.name || "N/A"
      }.`,
      metadata: {
        sourceType: "member",
        sourceId: m["LaFineEquipe-team_members"].id.toString(),
      },
    })),
    ...allFigures.map((f) => ({
      pageContent: `Chiffre clé: ${f.figure} - ${f.description}.`,
      metadata: { sourceType: "figure", sourceId: f.id.toString() },
    })),
  ];

  console.log(
    `Adding ${chunks.length} event chunks and ${factChunks.length} fact chunks to vector store...`
  );

  const allDocuments = [...chunks, ...factChunks];

  await vectorStore.addDocuments(allDocuments);
}
