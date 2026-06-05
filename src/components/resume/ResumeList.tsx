"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteResume } from "@/actions/resume.action";
import { FileText } from "lucide-react";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import ResumeItem from "./ResumeItem";

type Resume = {
  id: string;
  filename: string;
  score: number | null;
  status: string;
  createdAt: Date;
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
          <ResumeItem resume={{ ...resume, setConfirmId: setConfirmId }} />
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
