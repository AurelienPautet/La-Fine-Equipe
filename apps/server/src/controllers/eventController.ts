import { Request, Response } from "express";
import { db } from "@lafineequipe/db";
import { events, tags, eventsTags } from "@lafineequipe/db/src/schema";
import { EventsWithTags, createEventsRequestSchema } from "@lafineequipe/types";
import { eq, desc, SQL, and, not } from "drizzle-orm";

const getEventsWithTags = async (
  whereCondition?: SQL,
  orderBy?: SQL
): Promise<EventsWithTags[]> => {
  let query = db
    .select({
      id: events.id,
      title: events.title,
      slug: events.slug,
      content: events.content,
      author: events.author,
      date: events.date,
      createdAt: events.createdAt,
      updatedAt: events.updatedAt,
      tags: { id: tags.id, name: tags.name },
    })
    .from(events)
    .leftJoin(eventsTags, eq(events.id, eventsTags.eventsId))
    .leftJoin(tags, eq(eventsTags.tagId, tags.id));

  if (whereCondition) {
    // @ts-expect-error Drizzle ORM typing issue with dynamic where
    query = query.where(whereCondition);
  }

  if (orderBy) {
    // @ts-expect-error Drizzle ORM typing issue with dynamic orderBy
    query = query.orderBy(orderBy);
  }

  const results = await query.execute();

  const eventsMap = new Map<number, EventsWithTags>();

  for (const row of results) {
    if (!eventsMap.has(row.id)) {
      eventsMap.set(row.id, {
        id: row.id,
        title: row.title,
        slug: row.slug,
        content: row.content,
        author: row.author,
        date: row.date,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        tags: row.tags ? [row.tags] : [],
      });
    } else {
      const existingEvents = eventsMap.get(row.id);
      if (row.tags && existingEvents) {
        existingEvents.tags.push(row.tags);
      }
    }
  }
  return Array.from(eventsMap.values());
};

export const getAllEvents = async (_req: Request, res: Response) => {
  try {
    const allEventsWithTags = await getEventsWithTags(
      undefined,
      desc(events.date)
    );
    res.status(200).json({ success: true, data: allEventsWithTags });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, error: error });
  }
};

export const getEventsBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const eventsWithTags = await getEventsWithTags(eq(events.slug, slug));

    if (eventsWithTags.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Events not found" });
    }

    res.json({ success: true, data: eventsWithTags[0] });
  } catch {
    res.status(500).json({ success: false, error: "Failed to fetch events" });
  }
};

export const getLatestsEvents = async (req: Request, res: Response) => {
  try {
    const allEvents = await getEventsWithTags(undefined, desc(events.date));

    if (allEvents.length === 0) {
      return res.status(404).json({ success: false, error: "No events found" });
    }

    res.json({ success: true, data: [allEvents[0], allEvents[1]] });
  } catch {
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch latests events" });
  }
};

export const createEvents = async (req: Request, res: Response) => {
  try {
    const validatedData = createEventsRequestSchema.parse(req.body);
    const { title, content, author, date, tags } = validatedData;
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    if (slug.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Titre invalide. Un titre doit contenir des caractères valides.",
      });
    }

    const existingEvents = await db
      .select()
      .from(events)
      .where(eq(events.slug, slug))
      .execute();
    if (existingEvents.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Slug already exists. Please choose a different title.",
      });
    }

    const [newEvent] = await db
      .insert(events)
      .values({ title, content, author, slug, date })
      .returning()
      .execute();

    for (const tag of tags) {
      await db
        .insert(eventsTags)
        .values({ eventsId: newEvent.id, tagId: tag.id })
        .execute();
    }

    res.status(201).json({ success: true, data: newEvent });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create events",
      stack: error.stack,
    });
  }
};

export const editEvents = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = createEventsRequestSchema.parse(req.body);
    const { title, content, author, date, tags } = validatedData;
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    const existingEvents = await db
      .select()
      .from(events)
      .where(and(eq(events.slug, slug), not(eq(events.id, Number(id)))))
      .execute();
    if (existingEvents.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Slug already exists. Please choose a different title.",
      });
    }

    const [updatedEvent] = await db
      .update(events)
      .set({ title, content, author, slug, date })
      .where(eq(events.id, Number(id)))
      .returning()
      .execute();

    await db
      .delete(eventsTags)
      .where(eq(eventsTags.eventsId, updatedEvent.id))
      .execute();

    for (const tag of tags) {
      await db
        .insert(eventsTags)
        .values({ eventsId: updatedEvent.id, tagId: tag.id })
        .execute();
    }

    res.json({ success: true, data: updatedEvent });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, errors: error.errors });
    }
    res.status(500).json({ success: false, error: "Failed to edit events" });
  }
};
