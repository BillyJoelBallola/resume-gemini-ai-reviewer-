import { currentUser } from "@/actions/user.action";
import UploadResumeCard from "@/components/resume/UploadResumeCard";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="max-w-2xl m-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-4xl font-bold">
          Is your resume good enough?
        </h1>
        <p className="text-muted-foreground">
          AI-powered resume reviewer. Get instant feedback.
        </p>
      </div>
      <UploadResumeCard isAuthenticated={!!user} />
    </div>
  );
}
