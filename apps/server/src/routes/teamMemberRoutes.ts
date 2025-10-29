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
router.put("/:id", authMiddleware, editTeamMember);
router.patch("/:id/reorder", authMiddleware, reorderTeamMembers);
router.delete("/:id", authMiddleware, deleteTeamMember);
router.get("/", getTeamMembers);

export default router;
