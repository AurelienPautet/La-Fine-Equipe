import { Request, Response } from "express";
import { db } from "@lafineequipe/db";
import { eq } from "drizzle-orm";
import {
  actifMembersSettings,
  simpleMembersSettings,
} from "@lafineequipe/db/src/schema";

export const getMembersSettings = async (_req: Request, res: Response) => {
  try {
    const [actifSettings] = await db
      .select()
      .from(actifMembersSettings)
      .execute();
    const [simpleSettings] = await db
      .select()
      .from(simpleMembersSettings)
      .execute();
    res
      .status(200)
      .json({ success: true, data: { actifSettings, simpleSettings } });
  } catch (error) {
    console.error("Error fetching members settings:", error);
    res.status(500).json({ success: false, error: error });
  }
};

export const updateActifMembersSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const { url, price } = req.body;
    await db
      .update(actifMembersSettings)
      .set({ url, price })
      .where(eq(actifMembersSettings.id, 1))
      .execute();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating Actif members settings:", error);
    res.status(500).json({ success: false, error: error });
  }
};

export const updateSimpleMembersSettings = async (
  req: Request,
  res: Response
) => {
  try {
    const { url } = req.body;
    await db
      .update(simpleMembersSettings)
      .set({ url })
      .where(eq(simpleMembersSettings.id, 1))
      .execute();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating Simple members settings:", error);
    res.status(500).json({ success: false, error: error });
  }
};
