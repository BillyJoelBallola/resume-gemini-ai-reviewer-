"use client";

import { useState } from "react";
import JobMatchForm from "@/components/form/JobMatchForm";
import JobMatchResult from "@/components/JobMatchResult";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

type Props = {
  resumeId: string;
  existingJobMatch: any;
  existingJobDescription: string | null;
};

function JobMatchSection({
  resumeId,
  existingJobMatch,
  existingJobDescription,
}: Props) {
  const [jobMatch, setJobMatch] = useState(existingJobMatch);
  const [showForm, setShowForm] = useState(!existingJobMatch);

  return (
    <div className="space-y-4">
      {jobMatch && !showForm ? (
        <>
          <div className="flex items-center justify-between">
            {existingJobDescription && (
              <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                Job: {existingJobDescription.slice(0, 80)}...
              </p>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowForm(true)}
            >
              <RefreshCw className="size-4" />
              Try another job
            </Button>
          </div>
          <JobMatchResult jobMatch={jobMatch} />
        </>
      ) : (
        <JobMatchForm
          resumeId={resumeId}
          onComplete={(result) => {
            setJobMatch(result);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

export default JobMatchSection;
