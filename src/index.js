import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import path from 'path';
import { extractDataInstagram } from './lib/instalk.js';
import { roastAI } from './lib/gemini.js';
import { GoogleGenerativeAIResponseError } from '@google/generative-ai';

const app = express();

app.use(cors());

app.use(express.static(path.join(process.cwd(), 'public')));

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public/index.html"));
})

app.post('/roast-ig/:user', async (req, res) => {
    try {
        let { user } = req.params;
        if (!user) return res.status(400).send("Please input your username!");
        let dataExtract = await extractDataInstagram(user);
        const resultAI = await roastAI(user, dataExtract);
        res.send(resultAI);
    } catch(err) {
        console.error(err);
        if (err instanceof GoogleGenerativeAIResponseError) {
            return res.status(500).send("Internal server error at AI Models");
        }
        res.status(500).send("Internal Server Error");
    }
});

app.listen(3000, () => {
    console.log("Your server is now running!")
})