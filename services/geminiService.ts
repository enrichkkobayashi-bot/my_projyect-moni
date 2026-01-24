import { GoogleGenAI, Type } from "@google/genai";

const MONITORING_SYSTEM_INSTRUCTION = `あなたは実務経験20年以上の熟練した主任ケアマネジャーです。
提供された情報に基づき、介護保険制度の「支援経過記録（モニタリング）」を作成してください。

【文字数制限に関する絶対厳守事項】
1. 指定された最大文字数（maxChars）を「1文字でも超過すること」は重大な欠陥であり、絶対に許されません。
2. AIの文字数計算の誤差を考慮し、最大文字数の 80%〜90% 程度の分量を目標に執筆してください。
3. 文章の充実度よりも、文字数制限（maxChars以内）に収めることを最優先してください。
4. 文字数が超過しそうな場合は、重要度の低い修飾語を削り、簡潔で専門的な表現に置き換えて調整してください。

【構成要件】
必ず以下の４つの項目に見出し（１．〜４．）をつけて構成してください。
各見出しの直前には必ず改行を2つ挿入し、明確に段落を分けてください：
１．利用者の様子（表情・発言・健康状態など）
２．現在のサービス利用状況とその評価
３．ケアプランの妥当性や課題の有無
４．今後の対応（必要であれば提案）

プロのケアマネジャーとして、具体的かつ論理的な表現（「〜である」「〜を確認」など）を用いてください。`;

export async function summarizeMonitoring(files: { base64: string, type: string }[], maxChars: number) {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const parts: any[] = files.map(f => ({ inlineData: { data: f.base64, mimeType: f.type } }));

  // 安全な目標範囲を計算（80%〜90%）
  const targetMin = Math.floor(maxChars * 0.8);
  const targetMax = Math.floor(maxChars * 0.9);

  parts.push({
    text: `以下の情報を解析し、熟練の主任ケアマネジャーとして支援経過記録（モニタリング）を作成してください。

【出力要件】
・summaryTextの文字数は、必ず ${maxChars} 文字「以内」を絶対厳守してください。
・文字数オーバーを確実に防ぐため、${targetMin}文字 〜 ${targetMax}文字 程度の範囲で執筆してください。
・100%ギリギリを狙わず、必ず安全な余白を残してください。

【構成】
１．利用者の様子（表情・発言・健康状態など）
２．現在のサービス利用状況とその評価
３．ケアプランの妥当性や課題の有無
４．今後の対応（必要であれば提案）

【抽出・整理用項目】
【時間】
【訪問場所】：利用者自宅
【面会者】
【主な支援内容】
・体調確認
・サービス利用状況
・サービスへの満足度
・家族の状況
・本人・家族の意向
・ケアプランの妥当性

JSON形式で出力してください。` });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      systemInstruction: MONITORING_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summaryText: { type: Type.STRING },
          extractedFields: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              location: { type: Type.STRING },
              interviewee: { type: Type.STRING },
              supportContent: { type: Type.STRING },
              condition: { type: Type.STRING },
              serviceStatus: { type: Type.STRING },
              satisfaction: { type: Type.STRING },
              familyStatus: { type: Type.STRING },
              intentions: { type: Type.STRING },
              planValidity: { type: Type.STRING },
            }
          }
        }
      }
    }
  });
  const result = JSON.parse(response.text || "{}");
  if (result.summaryText) {
    // 見出し（１．〜４．）の前に必ず改行を入れる処理
    result.summaryText = result.summaryText
      .replace(/([１-４][．.] )/g, '\n\n$1')
      .replace(/\n{3,}/g, '\n\n');
  }
  return result;
}

export async function generateAssessmentPhase(files: { base64: string, type: string }[], phase: string) {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const parts: any[] = files.map(f => ({ inlineData: { data: f.base64, mimeType: f.type } }));
  parts.push({ text: `解析フェーズ ${phase} に基づいてアセスメントデータを抽出してください。JSON形式（キーと値のペア）で返してください。` });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      responseMimeType: "application/json",
    }
  });
  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return {};
  }
}

export async function generateSupportChecklist(files: { base64: string, type: string }[]) {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const parts: any[] = files.map(f => ({ inlineData: { data: f.base64, mimeType: f.type } }));
  parts.push({ text: `基本チェックリストの25項目を抽出してください。JSON形式（質問と回答の配列）で返してください。` });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING }
          },
          required: ["question", "answer"]
        }
      }
    }
  });
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
}

export async function generateCarePlanFromAssessment(assessment: any) {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `以下のアセスメント情報を元に居宅サービス計画書を生成してください: ${JSON.stringify(assessment)}`,
    config: {
      responseMimeType: "application/json",
    }
  });
  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return {};
  }
}

export async function generatePreventivePlan(assessment: any) {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `以下のアセスメント情報を元に介護予防サービス計画書を生成してください: ${JSON.stringify(assessment)}`,
    config: {
      responseMimeType: "application/json",
    }
  });
  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return {};
  }
}

const CONVERSATION_SUMMARY_INSTRUCTION = `あなたはプロのライター兼ケアマネジャーです。提供された音声データやテキストから、会話の内容をわかりやすく要約してください。

【出力形式】
以下のJSON形式で出力してください：
{
  "summaryText": "会話全体の要約テキスト（話題ごとに段落を分けて記述）",
  "topics": ["話題1", "話題2", "話題3"],
  "extractedFields": {
    "interviewee": "話者（特定できれば）",
    "time": "日時（特定できれば）"
  }
}

【要約のポイント】
・「だれが」「何について」「どう言ったか」を明確にしてください。
・重要なキーワードや決定事項は漏らさないようにしてください。
・箇条書きや改行を適切に使い、読みやすいフォーマットにしてください。
・感情や雰囲気（楽しそう、不安そうなど）も可能なら記載してください。`;

export async function generateConversationSummary(files: { base64: string, type: string }[]) {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const parts: any[] = files.map(f => ({ inlineData: { data: f.base64, mimeType: f.type } }));

  parts.push({ text: `会話の内容を詳細に要約してください。JSON形式で出力してください。` });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      systemInstruction: CONVERSATION_SUMMARY_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summaryText: { type: Type.STRING },
          topics: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          extractedFields: {
            type: Type.OBJECT,
            properties: {
              interviewee: { type: Type.STRING },
              time: { type: Type.STRING }
            }
          }
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return {};
  }
}




