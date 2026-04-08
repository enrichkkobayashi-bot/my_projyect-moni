import { GoogleGenAI, Type } from "@google/genai";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
};

const MONITORING_SYSTEM_INSTRUCTION = `あなたは実務経験20年以上の熟練した主任ケアマネジャーです。提供された情報を元に、質の高い支援経過記録（モニタリング）を作成してください。`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { action, payload } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'GEMINI_API_KEY is not set.' });
        }

        const ai = new GoogleGenAI({ apiKey });
        const usedModel = "gemini-2.0-flash-exp";

        if (action === 'summarizeMonitoring') {
            const { files, maxChars } = payload;
            const parts = files.map((f: any) => ({ inlineData: { data: f.base64, mimeType: f.type } }));
            parts.push({
                text: `${MONITORING_SYSTEM_INSTRUCTION}\n最大文字数の目安は ${maxChars} 文字です。JSON形式で {"summaryText": "内容", "extractedFields": {...}} という形で出力してください。`
            });

            const result = await ai.models.generateContent({
                model: usedModel,
                contents: { parts },
                config: { responseMimeType: "application/json" }
            });

            return res.status(200).json(JSON.parse(result.text || "{}"));

        } else if (action === 'generateConversationSummary') {
            const { files } = payload;
            const parts = files.map((f: any) => ({ inlineData: { data: f.base64, mimeType: f.type } }));
            parts.push({ text: "会話を要約してJSON形式で出力してください。" });

            const result = await ai.models.generateContent({
                model: usedModel,
                contents: { parts },
                config: { responseMimeType: "application/json" }
            });

            return res.status(200).json(JSON.parse(result.text || "{}"));
        }

        return res.status(400).json({ error: 'Invalid action' });

    } catch (error: any) {
        console.error('API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
