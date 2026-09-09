import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { leadsRouter } from './src/route/leadsRouter.js';
import { adminRouter } from './src/route/adminRouter.js';

const app = express()

async function main() {
    app.use(express.json())

    app.use("/lead", leadsRouter);
    app.use("/admin", adminRouter);

    try {
        await mongoose.connect(process.env.MONGODB)

        console.log("DB connected successfully")
        app.listen(process.env.PORT, console.log(`Server is running on ${process.env.PORT}`))  
    } catch (error) {
        console.log("Main error", error)
    }
}main()
