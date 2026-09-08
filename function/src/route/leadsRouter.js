import express from "express";
import { createLead } from "../controllers/leads/createLead.js";
import { verifyOtp } from "../controllers/leads/verifyOtp.js";

export const leadsRouter = express.Router();

leadsRouter.post("/createlead", createLead)
leadsRouter.post('/:id/verify-otp', verifyOtp);

export default leadsRouter;