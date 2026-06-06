"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lightbulb } from "lucide-react";

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
    ring: "border-green-500",
    score: "text-green-600",
    bar: "bg-green-500",
  },
  GOOD_MATCH: {
    label: "Good match",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    ring: "border-blue-500",
    score: "text-blue-600",
    bar: "bg-blue-500",
  },
  PARTIAL_MATCH: {
    label: "Partial match",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    ring: "border-yellow-500",
    score: "text-yellow-600",
    bar: "bg-yellow-500",
  },
  WEAK_MATCH: {
    label: "Weak match",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    ring: "border-red-500",
    score: "text-red-600",
    bar: "bg-red-500",
  },
};

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800">
      <div
        className={`h-1.5 rounded-full ${color}`}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}

function JobMatchResult({ jobMatch }: { jobMatch: JobMatch }) {
  const v = verdictConfig[jobMatch.verdict] ?? verdictConfig.PARTIAL_MATCH;

  const keywordTotal =
    jobMatch.matchedKeywords.length + jobMatch.missingKeywords.length;
  const skillTotal =
    jobMatch.matchedSkills.length + jobMatch.missingSkills.length;
  const keywordPct =
    keywordTotal > 0
      ? (jobMatch.matchedKeywords.length / keywordTotal) * 100
      : 0;
  const skillPct =
    skillTotal > 0 ? (jobMatch.matchedSkills.length / skillTotal) * 100 : 0;
  const gapPct =
    skillTotal > 0 ? (jobMatch.missingSkills.length / skillTotal) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Score + Summary */}
      <div className="flex items-center gap-5 p-5 rounded-xl border bg-card">
        <div
          className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border-[3px] shrink-0 ${v.ring}`}
        >
          <span className={`text-3xl font-semibold leading-none ${v.score}`}>
            {jobMatch.matchScore}
          </span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{v.label}</span>
            <Badge className={v.color}>
              {jobMatch.verdict.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {jobMatch.summary}
          </p>
        </div>
      </div>

      {/* Metric bars */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 space-y-2">
          <p className="text-xs text-muted-foreground">Keyword match</p>
          <p className="text-xl font-medium">
            {jobMatch.matchedKeywords.length}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              matched
            </span>
          </p>
          <ProgressBar value={keywordPct} color="bg-green-500" />
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 space-y-2">
          <p className="text-xs text-muted-foreground">Skills match</p>
          <p className="text-xl font-medium">
            {jobMatch.matchedSkills.length}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              matched
            </span>
          </p>
          <ProgressBar value={skillPct} color="bg-green-500" />
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 space-y-2">
          <p className="text-xs text-muted-foreground">Missing skills</p>
          <p className="text-xl font-medium">
            {jobMatch.missingSkills.length}{" "}
            <span className="text-sm font-normal text-muted-foreground">
              gaps
            </span>
          </p>
          <ProgressBar value={gapPct} color="bg-yellow-500" />
        </div>
      </div>

      {/* Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border p-4 space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Matched keywords
          </p>
          <div className="flex flex-wrap gap-2">
            {jobMatch.matchedKeywords.length === 0 ? (
              <p className="text-sm text-muted-foreground">None found.</p>
            ) : (
              jobMatch.matchedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  {kw}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="rounded-xl border p-4 space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Missing keywords
          </p>
          <div className="flex flex-wrap gap-2">
            {jobMatch.missingKeywords.length === 0 ? (
              <p className="text-sm text-muted-foreground">None missing!</p>
            ) : (
              jobMatch.missingKeywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                >
                  {kw}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Strengths */}
      {jobMatch.strengths.length > 0 && (
        <div className="rounded-xl border p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
            Strengths for this role
          </p>
          {jobMatch.strengths.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-2 py-2 border-b last:border-0 border-dashed text-sm"
            >
              <CheckCircle2 className="size-4 text-green-500 shrink-0 mt-0.5" />
              {item}
            </div>
          ))}
        </div>
      )}

      {/* Gaps + Suggestions combined */}
      {(jobMatch.gaps.length > 0 || jobMatch.suggestions.length > 0) && (
        <div className="rounded-xl border p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
            Gaps &amp; suggestions
          </p>
          {[...jobMatch.gaps, ...jobMatch.suggestions].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-2 py-2 border-b last:border-0 border-dashed text-sm"
            >
              <Lightbulb className="size-4 text-yellow-500 shrink-0 mt-0.5" />
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobMatchResult;
