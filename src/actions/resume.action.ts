"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/actions/user.action";
import { geminiModel } from "@/lib/gemini";
import { analysisRatelimit } from "@/lib/ratelimit";

export async function uploadResume({
  filename,
  fileUrl,
}: {
  filename: string;
  fileUrl: string; // base64
}) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  // server-side file validation
  if (!filename.toLowerCase().endsWith(".pdf")) {
    return { error: "Only PDF files are allowed." };
  }

  // check base64 size (4MB limit)
  const sizeInBytes = (fileUrl.length * 3) / 4;
  if (sizeInBytes > 4 * 1024 * 1024) {
    return { error: "File size must be less than 4MB." };
  }

  // check base64 is valid PDF (starts with JVBERi0 in base64)
  if (!fileUrl.startsWith("JVBERi0")) {
    return { error: "Invalid PDF file." };
  }

  try {
    const resume = await prisma.resume.create({
      data: {
        filename,
        fileUrl,
        status: "PENDING",
        userId: user.id,
      },
    });

    return { success: true, resume };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while uploading resume." };
  }
}

export async function analyzeResume(resumeId: string) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  const { success } = await analysisRatelimit.limit(user.id);
  if (!success)
    return { error: "Analysis limit reached. Try again in an hour." };

  try {
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: user.id },
    });

    if (!resume) return { error: "Resume not found." };

    // update status to analyzing
    await prisma.resume.update({
      where: { id: resumeId },
      data: { status: "ANALYZING" },
    });

    // send to Gemini
    const result = await geminiModel.generateContent([
      {
        inlineData: {
          mimeType: "application/pdf",
          data: resume.fileUrl,
        },
      },
      {
        text: `You are an expert resume reviewer. Analyze this resume and return ONLY a valid JSON object with no markdown, no backticks, no explanation. Use exactly this structure:
            {
              "overallScore": <number 0-100>,
              "overallFeedback": "<string>",
              "sections": {
                "summary": { "score": <number>, "feedback": "<string>", "suggestions": ["<string>"] },
                "skills": { "score": <number>, "feedback": "<string>", "suggestions": ["<string>"] },
                "experience": { "score": <number>, "feedback": "<string>", "suggestions": ["<string>"] },
                "education": { "score": <number>, "feedback": "<string>", "suggestions": ["<string>"] }
              },
              "strengths": ["<string>"],
              "weaknesses": ["<string>"],
              "missingKeywords": ["<string>"]
            }`,
      },
    ]);

    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();

    let feedback;
    try {
      feedback = JSON.parse(clean);
    } catch {
      throw new Error("AI returned invalid JSON.");
    }

    // 👇 sanitize — validate required fields
    if (
      typeof feedback.overallScore !== "number" ||
      feedback.overallScore < 0 ||
      feedback.overallScore > 100
    ) {
      throw new Error("AI returned invalid score.");
    }

    if (typeof feedback.overallFeedback !== "string") {
      throw new Error("AI returned invalid feedback.");
    }

    if (typeof feedback.sections !== "object" || !feedback.sections) {
      throw new Error("AI returned invalid sections.");
    }

    // 👇 ensure arrays exist and are actually arrays
    feedback.strengths = Array.isArray(feedback.strengths)
      ? feedback.strengths
      : [];
    feedback.weaknesses = Array.isArray(feedback.weaknesses)
      ? feedback.weaknesses
      : [];
    feedback.missingKeywords = Array.isArray(feedback.missingKeywords)
      ? feedback.missingKeywords
      : [];

    // 👇 clamp score between 0-100 just in case
    feedback.overallScore = Math.min(
      100,
      Math.max(0, Math.round(feedback.overallScore)),
    );

    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        feedback,
        score: feedback.overallScore,
        status: "DONE",
      },
    });

    return { success: true, feedback };
  } catch (error) {
    console.error(error);
    await prisma.resume.update({
      where: { id: resumeId },
      data: { status: "FAILED" },
    });
    return { error: "An error occurred while analyzing resume." };
  }
}

export async function getResumes() {
  const user = await currentUser();
  if (!user) return null;

  return prisma.resume.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      filename: true,
      score: true,
      status: true,
      createdAt: true,
    },
  });
}

export async function getResume(id: string) {
  const user = await currentUser();
  if (!user) return null;

  return prisma.resume.findFirst({
    where: { id, userId: user.id },
    select: {
      id: true,
      filename: true,
      score: true,
      status: true,
      feedback: true,
      createdAt: true,
    },
  });
}

export async function deleteResume(id: string) {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized." };

  try {
    await prisma.resume.delete({ where: { id, userId: user.id } });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while deleting resume." };
  }
}
