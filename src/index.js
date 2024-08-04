import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import path from 'path';
import { extractDataInstagram } from './lib/instalk.js';
import { GoogleGenerativeAI, GoogleGenerativeAIResponseError, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import axios from 'axios';

const app = express();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

app.use(cors())

app.use(express.static(path.join(process.cwd(), 'public')));

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public/index.html"));
})

app.post('/roast-ig/:user', async (req, res) => {
    try {
        let { user } = req.params;
        if (!user) return res.status(400).send("Please input your username!");
        let dataExtract = await extractDataInstagram(user);
        let prompt = `berikan roasting singkat dengan kejam, menyindir, sarkas, serta menyakitkan dalam bahasa gaul untuk profile instagram berikut : ${user}. Berikut detailnya: "${JSON.stringify(dataExtract)}"`;
        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
        ];

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" ,safetySettings});
        const result = await model.generateContent(prompt);
        const response = result.response;
        res.send(response.text());
    } catch(err) {
        console.error(err);
        if (err instanceof GoogleGenerativeAIResponseError) {
            return res.status(500).send("Internal server error at AI Models");
        }
        if(axios.isAxiosError(err)){
            if (err.response.status == 404){
                return res.status(404).send("User not found");
            } else if (err.response.status == 403) {
                return res.status(403).send("extract account overlimit");
            } else {
                return res.status(500).send("extract account error");
            }
        }
        res.status(500).send("Internal Server Error");
    }
});

app.listen(3000, () => {
    console.log("Your server is now running!")
})