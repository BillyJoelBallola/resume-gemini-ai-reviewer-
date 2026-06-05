import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Lightbulb, Tag } from "lucide-react";
import BackButton from "@/components/BackButton";

export const dynamic = "force-dynamic";

const scoreColor = (score: number) => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
};

const scoreBg = (score: number) => {
  if (score >= 80) return "border-green-500";
  if (score >= 60) return "border-yellow-500";
  return "border-red-500";
};

const scoreLabel = (score: number) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Work";
};

type SectionKey = "summary" | "skills" | "experience" | "education";

const sectionLabels: Record<SectionKey, string> = {
  summary: "Summary",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
};

export default async function ResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resume = await prisma.resume.findUnique({ where: { id } });

  if (!resume) notFound();

  const feedback = resume.feedback as any;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 className="text-lg md:text-2xl font-semibold">Resume Analysis</h1>
          <p className="text-sm text-muted-foreground">{resume.filename}</p>
        </div>
      </div>

      {/* Score + Overall Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Score */}
        <Card
          className={`border-2 grid place-items-center ${scoreBg(resume.score ?? 0)}`}
        >
          <CardContent className="flex flex-col items-center justify-center py-8 gap-2">
            <p className="text-sm text-muted-foreground font-medium">
              Overall Score
            </p>
            <p
              className={`text-7xl font-bold font-mono ${scoreColor(resume.score ?? 0)}`}
            >
              {resume.score}
            </p>
            <Badge className={`${scoreBg(resume.score ?? 0)} border`}>
              {scoreLabel(resume.score ?? 0)}
            </Badge>
          </CardContent>
        </Card>

        {/* Overall Feedback */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground uppercase">
              Overall Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              {feedback.overallFeedback}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(sectionLabels) as SectionKey[]).map((key) => {
          const section = feedback.sections?.[key];
          if (!section) return null;
          return (
            <Card key={key}>
              <CardContent className="flex flex-col items-center py-4 gap-1">
                <p className="text-xs text-muted-foreground uppercase font-medium">
                  {sectionLabels[key]}
                </p>
                <p
                  className={`text-3xl font-bold font-mono ${scoreColor(section.score)}`}
                >
                  {section.score}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Section Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(sectionLabels) as SectionKey[]).map((key) => {
          const section = feedback.sections?.[key];
          if (!section) return null;
          return (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{sectionLabels[key]}</span>
                  <span
                    className={`text-lg font-mono ${scoreColor(section.score)}`}
                  >
                    {section.score}/100
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {section.feedback}
                </p>
                {section.suggestions?.length > 0 && (
                  <ul className="space-y-1">
                    {section.suggestions.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Lightbulb className="size-4 text-yellow-500 shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="size-5" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.strengths?.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="size-4 text-green-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <XCircle className="size-5" />
              Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {feedback.weaknesses?.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Missing Keywords */}
      {feedback.missingKeywords?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="size-5 text-indigo-500" />
              Missing Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {feedback.missingKeywords.map((keyword: string) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="border-indigo-300 text-indigo-500"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
