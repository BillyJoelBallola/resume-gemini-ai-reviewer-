"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteResume } from "@/actions/resume.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Trash2 } from "lucide-react";
import { format } from "date-fns";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";

type Resume = {
  id: string;
  filename: string;
  score: number | null;
  status: string;
  createdAt: Date;
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

function ResumeList({ resumes }: { resumes: Resume[] }) {
  const router = useRouter();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeletingId(confirmId);
    try {
      const response = await deleteResume(confirmId);
      if (response.error) return toast.error(response.error);
      toast.success("Resume deleted.");
      setConfirmId(null);
      router.refresh();
    } catch {
      toast.error("An error occurred.");
    } finally {
      setDeletingId(null);
    }
  };

  if (resumes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="size-10 mx-auto mb-2 opacity-30" />
        <p>No resumes yet. Upload your first resume.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {resumes.map((resume) => (
          <Card key={resume.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div
                className="flex-1 cursor-pointer flex items-center gap-3"
                onClick={() =>
                  resume.status === "DONE" &&
                  router.push(`/resumes/${resume.id}`)
                }
              >
                <FileText className="size-8 text-amber-500 shrink-0" />
                <div>
                  <p className="font-semibold truncate">{resume.filename}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(resume.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                {resume.score !== null && (
                  <p
                    className={`text-xl md:text-2xl font-bold font-mono ${scoreColor(resume.score)}`}
                  >
                    {resume.score}
                  </p>
                )}
                <Badge className={statusColor[resume.status]}>
                  {resume.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setConfirmId(resume.id)}
                  className="hover:bg-red-100 dark:hover:bg-red-900"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={!!confirmId}
        onOpenChange={(open: boolean) => !open && setConfirmId(null)}
        title="Delete Resume"
        description={
          <>
            Are you sure you want to delete this resume? <br />
            <span className="font-semibold">This action cannot be undone.</span>
          </>
        }
        onConfirm={handleDelete}
        isLoading={!!deletingId}
        confirmLabel="Delete"
      />
    </>
  );
}

export default ResumeList;
