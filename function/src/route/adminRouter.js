import express from "express";
import { getAllLeads } from "../controllers/admin/getAllLeads.js";
import { getLeadById } from "../controllers/admin/getLeadById.js";
import { getLeadStats } from "../controllers/admin/getLeadStats.js";
import { getPendingLeads } from "../controllers/admin/getPendingLeads.js";
import { getDuplicateLeads } from "../controllers/admin/getDuplicateLeads.js";
import { getFakeLeads } from "../controllers/admin/getFakeLeads.js";
import { getMatchedLeads } from "../controllers/admin/getMatchedLeads.js";
import { getVerifiedLeads } from "../controllers/admin/getVerifiedLeads.js";

export const adminRouter = express.Router();

adminRouter.get("/leads", getAllLeads);
adminRouter.get("/leads/stats", getLeadStats);

adminRouter.get("/leads/verified", getVerifiedLeads);
adminRouter.get("/leads/pending", getPendingLeads);
adminRouter.get("/leads/duplicate", getDuplicateLeads);
adminRouter.get("/leads/fake", getFakeLeads);
adminRouter.get("/leads/matched", getMatchedLeads);

adminRouter.get("/leads/:id", getLeadById);
export default adminRouter;