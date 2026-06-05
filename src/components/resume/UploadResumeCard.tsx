"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  Loader,
  Lock,
  LogIn,
  LoaderCircle,
} from "lucide-react";
import { uploadResume, analyzeResume } from "@/actions/resume.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SignInDialog from "@/components/dialog/SignInDialog";
import SignUpDialog from "@/components/dialog/SignUpDialog";

function UploadResumeCard({ isAuthenticated }: { isAuthenticated: boolean }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }
    if (selectedFile.size > 4 * 1024 * 1024) {
      toast.error("File size must be less than 4MB.");
      return;
    }
    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const uploadResponse = await uploadResume({
        filename: file.name,
        fileUrl: base64,
      });

      if (uploadResponse.error) return toast.error(uploadResponse.error);
      if (!uploadResponse.resume) return toast.error("Upload failed.");

      toast.success("Resume uploaded. Analyzing...");

      const analyzeResponse = await analyzeResume(uploadResponse.resume.id);
      if (analyzeResponse.error) return toast.error(analyzeResponse.error);

      toast.success("Analysis complete!");
      router.push(`/resumes/${uploadResponse.resume.id}`);
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="border-2 border-dashed border-neutral-300 dark:border-neutral-700">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <div className="p-4 rounded-full bg-neutral-100 dark:bg-neutral-800">
            <LogIn className="size-8 text-amber-500" />
          </div>
          <div>
            <p className="font-semibold">Sign in to analyze your resume</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create a free account to get AI-powered feedback on your resume.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SignInDialog />
            <SignUpDialog />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging
            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950"
            : "border-neutral-300 dark:border-neutral-700"
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
          {file ? (
            <>
              {isLoading ? (
                <LoaderCircle className="size-12 text-amber-500 animate-spin" />
              ) : (
                <FileText className="size-12 text-amber-500" />
              )}
              <p className="font-semibold">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                Remove
              </Button>
            </>
          ) : (
            <>
              <Upload className="size-12 text-muted-foreground opacity-50" />
              <div className="text-center">
                <p className="font-semibold">Drop your resume here</p>
                <p className="text-sm text-muted-foreground">
                  PDF only, max 4MB
                </p>
              </div>
              <label htmlFor="resume-upload">
                <Button variant="outline" asChild>
                  <span>Browse File</span>
                </Button>
              </label>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleChange}
              />
              <div className="text-xs text-muted-foreground font-semibold mt-2 flex items-center gap-1">
                <Lock className="size-3" />
                <span>Privacy guaranteed</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {file && (
        <Button className="w-full" onClick={handleUpload} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="size-4 animate-spin" />
              Analyzing your resume...
            </>
          ) : (
            <>
              <Upload className="size-4" />
              Upload & Analyze
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export default UploadResumeCard;
