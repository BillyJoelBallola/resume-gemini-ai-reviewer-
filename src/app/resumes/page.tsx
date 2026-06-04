import { getResumes } from "@/actions/resume.action";
import { currentUser } from "@/actions/user.action";
import ResumeList from "@/components/ResumeList";
import UploadResumeCard from "@/components/resume/UploadResumeCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

async function ResumesPage() {
  const resumes = await getResumes();
  const user = await currentUser();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Resumes</h1>

      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadResumeCard isAuthenticated={!!user} />
        </CardContent>
      </Card>

      {/* List */}
      <ResumeList resumes={resumes ?? []} />
    </div>
  );
}

export default ResumesPage;
