import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';


const { GEMINI_API_KEY } = process.env;
const rand = (array) => array[Math.floor(Math.random() * array.length)];

export async function roastAI(username, dataExtract) {
    const apikey = rand((GEMINI_API_KEY || "").split('|'));
    const genAI = new GoogleGenerativeAI(apikey);
    let prompt = `berikan roasting singkat dengan kejam, menyindir, sarkas, serta menyakitkan dalam bahasa gaul untuk profile instagram berikut : ${username}. Berikut detailnya: "${JSON.stringify(dataExtract)}"`;
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
    return response.text();
}
