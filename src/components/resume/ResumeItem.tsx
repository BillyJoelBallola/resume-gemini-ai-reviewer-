"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

type ResumeItemProps = {
  id: string;
  filename: string;
  score: number | null;
  status: string;
  createdAt: Date;
  setConfirmId: (value: React.SetStateAction<string | null>) => void;
};

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ANALYZING: "bg-blue-100 text-blue-800",
  DONE: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

const scoreColor = (score: number) => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
};

function ResumeItem({ resume }: { resume: ResumeItemProps }) {
  const router = useRouter();

  return (
    <Card key={resume.id}>
      <CardContent className="flex items-center justify-between py-4">
        <div
          className="flex-1 min-w-0 cursor-pointer flex items-center gap-3"
          onClick={() =>
            resume.status === "DONE" && router.push(`/resumes/${resume.id}`)
          }
        >
          <FileText className="size-8 text-amber-500 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold max-w-xs truncate">{resume.filename}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(resume.createdAt), "MMM dd, yyyy")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-4">
          {resume.score !== null && (
            <p
              className={`text-xl md:text-2xl font-bold font-mono ${scoreColor(resume.score)}`}
            >
              {resume.score}
            </p>
          )}
          <Badge className={statusColor[resume.status]}>{resume.status}</Badge>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => resume.setConfirmId(resume.id)}
            className="hover:bg-red-100 dark:hover:bg-red-900"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ResumeItem;
