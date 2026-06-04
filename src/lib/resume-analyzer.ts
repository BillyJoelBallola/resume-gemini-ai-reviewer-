import { geminiModel } from "./gemini";

export async function analyzeResume(text: string) {
  const prompt = `
    You are an expert ATS resume reviewer.

    Analyze this resume.

    Return ONLY valid JSON.

    {
      "score": 0,
      "summary": "",
      "strengths": [],
      "weaknesses": [],
      "recommendations": []
    }

    Resume:

    ${text}
  `;

  const result = await geminiModel.generateContent(prompt);

  const response = result.response.text();

  try {
    return JSON.parse(response.replace(/```json/g, "").replace(/```/g, ""));
  } catch {
    throw new Error("Failed to parse AI response");
  }
}
