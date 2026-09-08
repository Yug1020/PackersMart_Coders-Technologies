import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { leadsRouter } from './src/route/leadsRouter.js';

const app = express()

async function main() {
    app.use(express.json())

    // app.use("/", (req, res) => res.send("API is running"));
    app.use("/lead", leadsRouter);

    try {
        await mongoose.connect(process.env.MONGODB)

        console.log("DB connected successfully")
        app.listen(process.env.PORT, console.log(`Server is running on ${process.env.PORT}`))  
    } catch (error) {
        console.log("Main error", error)
    }
}main()
