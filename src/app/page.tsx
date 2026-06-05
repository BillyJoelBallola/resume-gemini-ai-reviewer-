import { currentUser } from "@/actions/user.action";
import UploadResumeCard from "@/components/resume/UploadResumeCard";

export default async function Home() {
  const user = await currentUser();

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <p className="text-xs tracking-widest text-muted-foreground uppercase">
          AI-powered · instant · free
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
          Is your resume <span className="text-amber-500">good enough?</span>
        </h1>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md mx-auto">
          Upload your resume and get detailed AI feedback in seconds. Scores,
          strengths, weaknesses, and missing keywords — all in one place.
        </p>
      </div>

      {/* Upload Card */}
      <UploadResumeCard isAuthenticated={!!user} />

      {/* Feature Pills */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: "📊", label: "Score", desc: "0–100 rating" },
          { icon: "📋", label: "Sections", desc: "Per-section feedback" },
          { icon: "🏷️", label: "Keywords", desc: "Missing keywords" },
        ].map((f) => (
          <div
            key={f.label}
            className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 text-center space-y-1"
          >
            <p className="text-lg">{f.icon}</p>
            <p className="text-sm font-medium">{f.label}</p>
            <p className="text-xs text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
