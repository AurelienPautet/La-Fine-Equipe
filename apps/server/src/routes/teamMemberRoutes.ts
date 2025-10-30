import Router from "express";

import {
  createTeamMember,
  editTeamMember,
  reorderTeamMembers,
  deleteTeamMember,
  getTeamMembers,
} from "../controllers/teamMemberController.js";

import { authMiddleware } from "src/middleware/authMiddleware.js";
const router = Router();
router.post("/", authMiddleware, createTeamMember);
router.put("/reorder", authMiddleware, reorderTeamMembers);
router.put("/:id", authMiddleware, editTeamMember);
router.delete("/:id", authMiddleware, deleteTeamMember);
router.get("/", getTeamMembers);

export default router;
