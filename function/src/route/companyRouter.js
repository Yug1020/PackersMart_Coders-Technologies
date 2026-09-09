import express from "express";
import { getMatchingCompanies } from "../controllers/company/getMatchingCompanies.js";
import { confirmMatch } from "../controllers/company/confirmMatch.js";

export const companyRouter = express.Router();

companyRouter.get("/match/:lead_id", getMatchingCompanies);
companyRouter.post("/match/:lead_id/:company_id", confirmMatch);

export default companyRouter;