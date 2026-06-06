"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  Tag,
  TrendingUp,
} from "lucide-react";

type JobMatch = {
  matchScore: number;
  summary: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  verdict: "STRONG_MATCH" | "GOOD_MATCH" | "PARTIAL_MATCH" | "WEAK_MATCH";
};

const verdictConfig = {
  STRONG_MATCH: {
    label: "Strong match",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  GOOD_MATCH: {
    label: "Good match",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  PARTIAL_MATCH: {
    label: "Partial match",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  WEAK_MATCH: {
    label: "Weak match",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
};

const scoreColor = (score: number) => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
};

const scoreBorder = (score: number) => {
  if (score >= 80) return "border-green-500";
  if (score >= 60) return "border-yellow-500";
  return "border-red-500";
};

function JobMatchResult({ jobMatch }: { jobMatch: JobMatch }) {
  const verdict =
    verdictConfig[jobMatch.verdict] ?? verdictConfig.PARTIAL_MATCH;

  return (
    <div className="space-y-4">
      {/* Score + Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={`border-2 ${scoreBorder(jobMatch.matchScore)}`}>
          <CardContent className="flex flex-col items-center justify-center py-8 gap-2">
            <p className="text-sm text-muted-foreground">Match Score</p>
            <p
              className={`text-7xl font-bold font-mono ${scoreColor(jobMatch.matchScore)}`}
            >
              {jobMatch.matchScore}
            </p>
            <Badge className={verdict.color}>{verdict.label}</Badge>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground uppercase">
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{jobMatch.summary}</p>
          </CardContent>
        </Card>
      </div>

      {/* Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-500 text-sm">
              <Tag className="size-4" />
              Matched Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobMatch.matchedKeywords.length === 0 ? (
              <p className="text-sm text-muted-foreground">None found.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {jobMatch.matchedKeywords.map((kw) => (
                  <Badge
                    key={kw}
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    {kw}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500 text-sm">
              <Tag className="size-4" />
              Missing Keywords
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobMatch.missingKeywords.length === 0 ? (
              <p className="text-sm text-muted-foreground">None missing!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {jobMatch.missingKeywords.map((kw) => (
                  <Badge
                    key={kw}
                    variant="outline"
                    className="border-red-300 text-red-500"
                  >
                    {kw}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-500 text-sm">
              <CheckCircle2 className="size-4" />
              Matched Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobMatch.matchedSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">None found.</p>
            ) : (
              <ul className="space-y-1">
                {jobMatch.matchedSkills.map((skill, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-4 text-green-500 shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500 text-sm">
              <XCircle className="size-4" />
              Missing Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobMatch.missingSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">None missing!</p>
            ) : (
              <ul className="space-y-1">
                {jobMatch.missingSkills.map((skill, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <XCircle className="size-4 text-red-500 shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-500 text-sm">
              <TrendingUp className="size-4" />
              Strengths for this role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {jobMatch.strengths.map((item, i) => (
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
            <CardTitle className="flex items-center gap-2 text-red-500 text-sm">
              <XCircle className="size-4" />
              Gaps for this role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {jobMatch.gaps.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      {jobMatch.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Lightbulb className="size-4 text-yellow-500" />
              Suggestions to improve your match
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {jobMatch.suggestions.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Lightbulb className="size-4 text-yellow-500 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default JobMatchResult;
