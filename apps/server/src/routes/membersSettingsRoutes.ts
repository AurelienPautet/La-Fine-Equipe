import Router from "express";

import {
  getMembersSettings,
  updateActifMembersSettings,
  updateSimpleMembersSettings,
} from "../controllers/membersSettingsController.js";

import { authMiddleware } from "src/middleware/authMiddleware.js";

const router = Router();

router.get("/", getMembersSettings);
router.put("/actif", authMiddleware, updateActifMembersSettings);
router.put("/simple", authMiddleware, updateSimpleMembersSettings);

export default router;
