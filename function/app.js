import express from 'express';
import mongoose from 'mongoose';
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

import { leadsRouter } from './src/route/leadsRouter.js';
import { adminRouter } from './src/route/adminRouter.js';
import { companyRouter } from './src/route/companyRouter.js';

const app = express()
app.use(cors({
    origin: process.env.API_CLIENT,
    origin:process.env.API_ADMIN,
    credentials: true,
}))

async function main() {
    app.use(express.json())

    app.use("/lead", leadsRouter);
    app.use("/admin", adminRouter);
    app.use("/company", companyRouter);

    try {
        await mongoose.connect(process.env.MONGODB)

        console.log("DB connected successfully")
        app.listen(process.env.PORT, console.log(`Server is running on ${process.env.PORT}`))  
    } catch (error) {
        console.log("Main error", error)
    }
}main()
