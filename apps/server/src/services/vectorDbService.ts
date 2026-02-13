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
  homeSections,
  homeSectionButtons,
} from "@lafineequipe/db/schema";
import { eq, isNull, count } from "drizzle-orm";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { getEmbeddings } from "./embeddingsService";
import { enrichContentWithPdfText } from "./pdfExtractorService";

let textSplitter: RecursiveCharacterTextSplitter | null = null;

function getTextSplitter() {
  if (!textSplitter) {
    textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
  }
  return textSplitter;
}

const descriptionFineEquipe = `La Qui Sommes-Nous ?
La Fine Équipe est une association de l'Université Jean Moulin Lyon III, prônant l'entraide et l'engagement, et comptant huit élus au sein de ses membres.
Apolitiques et apartisans, nous sommes indépendants et ne recevons aucun financement extérieur à l'Université.
Inclusif, nous avons également la particularité d'être la seule association de l'Université dotée d'un pôle handicap.
Présentation La Fine Équipe
Les membres et les élus de La Fine Équipe se donnent pour mission d'incarner et de porter les revendications des étudiants de Lyon III auprès des instances décisionnelles.
Pour cela, nous avons mis en place un cahier de doléances anonyme sur notre Linktree, et réalisons régulièrement sur nos réseaux sociaux et sur les campus, des sondages pour connaître les attentes, les opinions et les problèmes auxquels les étudiants sont confrontés dans leur vie quotidienne。
`;

const historyFineEquipe = `Notre Histoire
Créée en novembre 2023, au en vue des élections au Conseil de la faculté de Droit, la liste de La Fine Équipe a rapidement évolué, pour devenir dès la rentrée 2024 une des principales associations étudiantes de l'Université Lyon III. De portée généraliste, nous organisons des conférences, des ateliers de conversation, et agissons au travers de notre pôle handicap.

Nous travaillons aussi à faire participer directement les étudiants à la vie de l'Université , en proposant des listes d'étudiants ordinaires, sur une ligne apolitique et apartisane , aux élections des différents organes représentatifs des usagers .`;

const clarificationFineEquipe = `
Le président de la fine equipe est le président du pôle Bureau
`;

let vectorStoreInstance: PGVectorStore | null = null;

async function getVectorStore() {
  if (!vectorStoreInstance) {
    const pool = getPool();
    const embeddings = getEmbeddings();
    const config = {
      pool,
      tableName: '"LaFineEquipe-document_chunks"',
      vectorColumnName: "embedding",
      contentColumnName: "text",
      metadataColumnName: "metadata",
      dimensions: 3072,
      columns: {
        idColumnName: "id",
        vectorColumnName: "embedding",
        contentColumnName: "text",
        metadataColumnName: "metadata",
      },
    };
    vectorStoreInstance = await PGVectorStore.initialize(embeddings, config);
  }
  return vectorStoreInstance;
}

export async function resetVectorStore() {
  const pool = getPool();
  await pool.query(`TRUNCATE TABLE "LaFineEquipe-document_chunks"`);
  vectorStoreInstance = null;
  await initializeVectorStore();
  console.log("Vector store reset successfully");
}

export async function initializeVectorStore() {
  console.log("Starting vector store initialization...");

  const allEvents = await db
    .select()
    .from(events)
    .where(isNull(events.deletedAt));

  const allRegulations = await db
    .select()
    .from(regulations)
    .leftJoin(
      regulationsCategories,
      eq(regulations.categoryId, regulationsCategories.id),
    )
    .where(isNull(regulations.deletedAt));

  const allHomeSections = await db
    .select()
    .from(homeSections)
    .where(isNull(homeSections.deletedAt));

  const SectionsTexts = [];
  for (const section of allHomeSections) {
    SectionsTexts.push({
      pageContent: `Section page d'accueil :- ${section.title}: ${section.content}`,
      sourceId: section.id,
      sourceType: "home_sections",
      toSplit: true,
    });
    const buttons = await db
      .select()
      .from(homeSectionButtons)
      .where(eq(homeSectionButtons.homeSectionId, section.id));

    const buttonsText =
      buttons.length > 0
        ? `\nBoutons: ${buttons
            .map((b) => `${b.label} (${b.link})`)
            .join(", ")}`
        : "";
    SectionsTexts[SectionsTexts.length - 1].pageContent += buttonsText;
  }

  // Process events with PDF extraction
  const eventsWithPdfText = await Promise.all(
    allEvents.map(async (event) => {
      const enrichedContent = await enrichContentWithPdfText(event.content);
      return {
        pageContent: `Événement : ${event.title} écrit par : ${event.author}\nDescription : ${enrichedContent}\nLieu : ${event.location}\nDates : du ${event.startDate} au ${event.endDate}`,
        sourceId: event.id,
        sourceType: "events",
        toSplit: true,
      };
    }),
  );

  // Process regulations with PDF extraction
  const regulationsWithPdfText = await Promise.all(
    allRegulations.map(async (reg) => {
      const enrichedContent = await enrichContentWithPdfText(
        reg["LaFineEquipe-regulations"].content,
      );
      return {
        pageContent: `Règlement : ${
          reg["LaFineEquipe-regulations"].title
        } apartenant à la catégorie ${
          reg["LaFineEquipe-regulations_categories"]!.name
        } 
        Date : ${reg["LaFineEquipe-regulations"].date}\nDescription : ${
          reg["LaFineEquipe-regulations"].description
        }\nContenu complet : ${enrichedContent}\n
        `,
        sourceId: reg["LaFineEquipe-regulations"].id,
        sourceType: "regulations",
        toSplit: true,
      };
    }),
  );

  await addDocuments([
    {
      pageContent: descriptionFineEquipe,
      sourceId: 0,
      sourceType: "description_fine_equipe",
      toSplit: false,
    },
    {
      pageContent: historyFineEquipe,
      sourceId: 0,
      sourceType: "history_fine_equipe",
      toSplit: false,
    },
    ...eventsWithPdfText,
    ...regulationsWithPdfText,
    ...SectionsTexts,
  ]);

  console.log("Syncing member settings...");
  await syncMembersSettingsToVectorStore();

  console.log("Updating lists...");
  await updateList("regulations");
  await updateList("team_members");
  await updateList("figures");
  await updateList("events");
  await updateList("home_sections");

  const finalCount = await db
    .select({ count: count(documentChunks.id) })
    .from(documentChunks);
  console.log(
    `Vector store initialized successfully with ${
      finalCount[0]?.count || 0
    } chunks.`,
  );
}

export async function addDocuments(
  documents: {
    pageContent: string;
    sourceId: number;
    sourceType: string;
    toSplit: boolean;
  }[],
) {
  console.log(
    `[VectorDB] addDocuments called with ${documents.length} documents`,
  );

  const documentToSplit = documents.filter((d) => d.toSplit);
  const splitter = getTextSplitter();
  const chunks = await splitter.createDocuments(
    documentToSplit.map((d) => d.pageContent),
    documentToSplit.map((d) => ({
      sourceId: d.sourceId,
      sourceType: d.sourceType,
    })),
  );
  console.log(
    `[VectorDB] Split ${documentToSplit.length} documents into ${chunks.length} chunks`,
  );

  const documentsWithoutSplit = documents.filter((d) => !d.toSplit);
  const allDocuments = [
    ...chunks,
    ...documentsWithoutSplit.map((d) => ({
      pageContent: d.pageContent,
      metadata: {
        sourceId: d.sourceId,
        sourceType: d.sourceType,
      },
    })),
  ];

  console.log(`[VectorDB] Total documents to embed: ${allDocuments.length}`);

  // Filter out empty documents
  const validDocuments = allDocuments.filter(
    (doc) => doc.pageContent && doc.pageContent.trim().length > 0,
  );
  if (validDocuments.length !== allDocuments.length) {
    console.warn(
      `[VectorDB] Filtered out ${allDocuments.length - validDocuments.length} empty documents`,
    );
  }

  if (validDocuments.length === 0) {
    console.warn("[VectorDB] No valid documents to add");
    return;
  }

  const pool = getPool();

  for (let i = 0; i < validDocuments.length; i++) {
    await pool.query(
      `DELETE FROM "LaFineEquipe-document_chunks" WHERE source_type = $1 AND source_id = $2`,
      [
        validDocuments[i].metadata.sourceType,
        validDocuments[i].metadata.sourceId,
      ],
    );
  }

  const vectorStore = await getVectorStore();

  // Test embedding generation before bulk insert
  console.log("[VectorDB] Testing embedding generation...");
  const embeddings = getEmbeddings();
  try {
    const testVector = await embeddings.embedQuery(
      validDocuments[0].pageContent.substring(0, 500),
    );
    console.log(`[VectorDB] Test embedding dimensions: ${testVector.length}`);
    if (testVector.length === 0) {
      throw new Error(
        "Embedding returned 0 dimensions - check API key and model",
      );
    }
  } catch (embError) {
    console.error("[VectorDB] Embedding test failed:", embError);
    throw embError;
  }

  console.log(
    `[VectorDB] Adding ${validDocuments.length} documents to vector store...`,
  );
  try {
    // Process documents in smaller batches with delays to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < validDocuments.length; i += batchSize) {
      const batch = validDocuments.slice(i, i + batchSize);
      console.log(
        `[VectorDB] Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(validDocuments.length / batchSize)} (${batch.length} docs)`,
      );

      try {
        await vectorStore.addDocuments(
          batch.map((doc) => ({
            pageContent: doc.pageContent,
            metadata: doc.metadata,
          })),
        );
        console.log(
          `[VectorDB] Batch ${Math.floor(i / batchSize) + 1} added successfully`,
        );
      } catch (batchError) {
        console.error(
          `[VectorDB] Batch ${Math.floor(i / batchSize) + 1} failed, trying documents individually:`,
          batchError,
        );
        // Try adding documents one by one - likely rate limiting issue
        let failedDocs = 0;
        for (let j = 0; j < batch.length; j++) {
          const doc = batch[j];
          console.log(
            `[VectorDB] Trying document ${i + j + 1}/${validDocuments.length} (${doc.pageContent.substring(0, 50)}...)`,
          );
          try {
            await vectorStore.addDocuments([
              {
                pageContent: doc.pageContent,
                metadata: doc.metadata,
              },
            ]);
            console.log(`[VectorDB] Document ${i + j + 1} succeeded`);
            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (docError) {
            console.error(`[VectorDB] Document ${i + j + 1} failed:`, docError);
            console.error(
              `[VectorDB] Problematic content length: ${doc.pageContent.length}`,
            );
            failedDocs++;
          }
        }
        if (failedDocs > 0) {
          console.error(`[VectorDB] ${failedDocs} documents failed in batch ${Math.floor(i / batchSize) + 1}`);
        } else {
          console.log(`[VectorDB] All documents in batch ${Math.floor(i / batchSize) + 1} recovered successfully`);
        }
      }
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < validDocuments.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  } catch (addError) {
    console.error("[VectorDB] Failed to add documents:", addError);
    throw addError;
  }
  console.log("[VectorDB] Documents added successfully");

  for (let i = 0; i < allDocuments.length; i++) {
    await pool.query(
      `UPDATE "LaFineEquipe-document_chunks" 
         SET source_type = $1, source_id = $2 
         WHERE text = $3 AND source_type IS NULL`,
      [
        allDocuments[i].metadata.sourceType,
        allDocuments[i].metadata.sourceId,
        allDocuments[i].pageContent,
      ],
    );
  }
}

export async function updateList(sourceType: string) {
  switch (sourceType) {
    case "events": {
      const allEvents = await db
        .select()
        .from(events)
        .where(isNull(events.deletedAt));
      const StringlistOfAllEvents = allEvents
        .map(
          (event) =>
            `- ${event.title} qui se déroule à ${
              event.location
            } du ${event.startDate.toLocaleDateString(
              "fr-FR",
            )} au ${event.endDate.toLocaleDateString("fr-FR")}`,
        )
        .join("\n");
      await addDocuments([
        {
          pageContent: `Liste des événements:\n${StringlistOfAllEvents}`,
          sourceId: 0,
          sourceType: "events",
          toSplit: false,
        },
      ]);
      break;
    }
    case "regulations": {
      const allRegulations = await db
        .select()
        .from(regulations)
        .leftJoin(
          regulationsCategories,
          eq(regulations.categoryId, regulationsCategories.id),
        )
        .where(isNull(regulations.deletedAt));

      const StringlistOfAllRegulations = allRegulations
        .map(
          (reg) =>
            `-${reg["LaFineEquipe-regulations_categories"]?.name || "N/A"} : ${
              reg["LaFineEquipe-regulations"].title
            } : ${reg["LaFineEquipe-regulations"].description} du ${
              reg["LaFineEquipe-regulations"].date
            }`,
        )
        .join("\n");
      await addDocuments([
        {
          pageContent: `Liste des règlements:\n${StringlistOfAllRegulations}`,
          sourceId: 0,
          sourceType: "regulations",
          toSplit: false,
        },
      ]);
      break;
    }
    case "team_members": {
      const allMembers = await db
        .select()
        .from(teamMembers)
        .leftJoin(divisions, eq(teamMembers.divisionId, divisions.id))
        .where(isNull(teamMembers.deletedAt));

      const membersList = allMembers
        .map(
          (m) =>
            `- ${m["LaFineEquipe-team_members"].firstName} ${
              m["LaFineEquipe-team_members"].lastName
            } est ${m["LaFineEquipe-team_members"].role} au sein du pôle ${
              m["LaFineEquipe-divisions"]?.name || "N/A"
            }`,
        )
        .join("\n");
      await addDocuments([
        {
          pageContent: `Membres de la Fine Equipe (${clarificationFineEquipe}):\n${membersList}`,
          sourceId: 0,
          sourceType: "team_members",
          toSplit: false,
        },
      ]);
      break;
    }
    case "figures": {
      const allFigures = await db
        .select()
        .from(figures)
        .where(isNull(figures.deletedAt));
      const figuresList = allFigures
        .map((f) => `- ${f.figure}: ${f.description}`)
        .join("\n");
      await addDocuments([
        {
          pageContent: `Chiffres clés de la Fine Equipe:\n${figuresList}`,
          sourceId: 0,
          sourceType: "figures",
          toSplit: false,
        },
      ]);
      break;
    }
    case "home_sections": {
      const allSections = await db
        .select()
        .from(homeSections)
        .where(isNull(homeSections.deletedAt));

      const sectionsWithButtons = await Promise.all(
        allSections.map(async (section) => {
          const buttons = await db
            .select()
            .from(homeSectionButtons)
            .where(eq(homeSectionButtons.homeSectionId, section.id));
          const buttonsText =
            buttons.length > 0
              ? ` [Boutons: ${buttons
                  .map((b) => `${b.label} (${b.link})`)
                  .join(", ")}]`
              : "";
          return `- ${section.title}: ${section.content}${buttonsText}`;
        }),
      );

      const sectionsList = sectionsWithButtons.join("\n");
      await addDocuments([
        {
          pageContent: `Sections de l'accueil:\n${sectionsList}`,
          sourceId: 0,
          sourceType: "home_sections",
          toSplit: false,
        },
      ]);
      break;
    }
    default:
      break;
  }
}

export async function deleteFromVectorStore(
  sourceType: string,
  sourceId: number,
) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query(
      `DELETE FROM "LaFineEquipe-document_chunks" WHERE source_type = $1 AND source_id = $2`,
      [sourceType, sourceId],
    );
    await updateList(sourceType);
  } finally {
    client.release();
  }
}

export async function syncTeamMemberToVectorStore(teamMember: {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  divisionId: number;
}) {
  const [division] = await db
    .select()
    .from(divisions)
    .where(eq(divisions.id, teamMember.divisionId));

  await addDocuments([
    {
      pageContent: `Membre de la Fine Equipe: ${teamMember.firstName} ${
        teamMember.lastName
      } est ${teamMember.role} au sein du pôle ${division?.name || "N/A"}`,
      sourceId: teamMember.id,
      sourceType: "team_members",
      toSplit: false,
    },
  ]);

  await updateList("team_members");
}

export async function syncRegulationToVectorStore(regulation: {
  id: number;
  title: string;
  description: string;
  content: string;
  date: Date;
  categoryId: number;
}) {
  const [category] = await db
    .select()
    .from(regulationsCategories)
    .where(eq(regulationsCategories.id, regulation.categoryId));

  const enrichedContent = await enrichContentWithPdfText(regulation.content);

  await addDocuments([
    {
      pageContent: `Règlement : ${regulation.title} apartenant à la catégorie ${
        category?.name || "N/A"
      } 
      Date : ${regulation.date}
      \nDescription : ${
        regulation.description
      }\nContenu complet : ${enrichedContent}\n`,
      sourceId: regulation.id,
      sourceType: "regulations",
      toSplit: true,
    },
  ]);

  await updateList("regulations");
}

export async function syncEventToVectorStore(event: {
  id: number;
  title: string;
  content: string;
  author: string;
  location: string;
  startDate: Date;
  endDate: Date;
}) {
  const enrichedContent = await enrichContentWithPdfText(event.content);

  await addDocuments([
    {
      pageContent: `Événement : ${event.title} écrit par : ${event.author}\nDescription : ${enrichedContent}\nLieu : ${event.location}\nDates : du ${event.startDate} au ${event.endDate}`,
      sourceId: event.id,
      sourceType: "events",
      toSplit: true,
    },
  ]);

  await updateList("events");
}

export async function syncFigureToVectorStore(figure: {
  id: number;
  figure: string;
  description: string;
}) {
  await addDocuments([
    {
      pageContent: `Chiffre clé de la Fine Equipe: ${figure.figure}: ${figure.description}`,
      sourceId: figure.id,
      sourceType: "figures",
      toSplit: false,
    },
  ]);

  await updateList("figures");
}

export async function syncHomeSectionToVectorStore(homeSectionId: number) {
  const [section] = await db
    .select()
    .from(homeSections)
    .where(eq(homeSections.id, homeSectionId));

  if (!section) {
    console.warn(`Home section with id ${homeSectionId} not found`);
    return;
  }

  const buttons = await db
    .select()
    .from(homeSectionButtons)
    .where(eq(homeSectionButtons.homeSectionId, homeSectionId));

  const buttonsText =
    buttons.length > 0
      ? `\nBoutons: ${buttons.map((b) => `${b.label} (${b.link})`).join(", ")}`
      : "";

  await addDocuments([
    {
      pageContent: `Section page accueil: ${section.title}\nContenu: ${section.content}${buttonsText}`,
      sourceId: section.id,
      sourceType: "home_sections",
      toSplit: true,
    },
  ]);

  await updateList("home_sections");
}

export async function syncMembersSettingsToVectorStore() {
  const [actifSettings] = await db.select().from(actifMembersSettings);
  const [simpleSettings] = await db.select().from(simpleMembersSettings);

  if (!actifSettings || !simpleSettings) {
    console.warn("Member settings not found in database");
    return;
  }

  const becomingMemberFineEquipe = `Devenir Membre de La Fine Equipe
Nous sommes toujours à la recherche de nouveaux membres ! Si tu souhaites t'investir à La Fine Équipe, nous soutenir ou simplement te tenir informé de nos prochains événements, devenir membre est exactement ce qui nous aide le plus. Pour cela, deux choix s'offrent à toi : l'adhésion simple, ou l'adhésion en tant que membre actif.

L'adhésion simple est valable à vie. Celle-ci permet :

D'être informé de l'actualité de La Fine Équipe
D'être prioritaire pour les places à nos événements
D'intégrer, voire de créer un pôle pour faire vivre l'Association et réaliser tes projets
D'être candidat sur l'une de nos listes.
L'adhésion en tant que membre actif confère tous les avantages de l'adhésion simple, et permet, pour l'année scolaire en cours, moyennant une contribution de ${actifSettings.price} euros :

De voter aux réunions de l'Assemblée générale
D'intégrer le Conseil d'administration ou le bureau le cas échéant
D'être candidat en bonne place
Et de nous soutenir financièrement !

Voici les liens pour adhérer :
- Adhésion simple ${simpleSettings.url}

- Adhésion active (${actifSettings.price} euros) : ${actifSettings.url}

Si tu as des questions, n'hésite pas à nous contacter, par mail ou sur nos réseaux. Merci d'avance !`;

  await addDocuments([
    {
      pageContent: becomingMemberFineEquipe,
      sourceId: 0,
      sourceType: "becoming_member_fine_equipe",
      toSplit: false,
    },
  ]);
}
