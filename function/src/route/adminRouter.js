import express from "express";
import { getAllLeads } from "../controllers/admin/getAllLeads.js";
import { getLeadById } from "../controllers/admin/getLeadById.js";

export const adminRouter = express.Router();

adminRouter.get("/leads", getAllLeads);
adminRouter.get("/leads/:id", getLeadById);

export default adminRouter;