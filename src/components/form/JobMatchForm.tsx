"use client";

import { useState } from "react";
import { toast } from "sonner";
import { analyzeJobMatch } from "@/actions/resume.action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader, Briefcase } from "lucide-react";

type Props = {
  resumeId: string;
  onComplete: (jobMatch: any) => void;
};

function JobMatchForm({ resumeId, onComplete }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [jobDescription, setJobDescription] = useState("");

  const isDisabled = isLoading || jobDescription.trim().length < 50;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await analyzeJobMatch({ resumeId, jobDescription });
      if (response.error) return toast.error(response.error);
      if (response.jobMatch) {
        toast.success("Job match analysis complete!");
        onComplete(response.jobMatch);
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="size-5 text-indigo-500" />
          Job Description Matcher
        </CardTitle>
        <CardDescription>
          Paste a job description to see how well your resume matches the role.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-40 resize-none"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {jobDescription.length} characters
              {jobDescription.trim().length < 50 && " (min 50)"}
            </p>
            <Button type="submit" disabled={isDisabled}>
              {isLoading ? (
                <>
                  <Loader className="size-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Briefcase className="size-4" />
                  Analyze Match
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default JobMatchForm;
