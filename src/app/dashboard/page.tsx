import { getDashboardData } from "@/actions/dashboard.action";
import {
  FileText,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";

export const dynamic = "force-dynamic";

const scoreColor = (score: number) => {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
};

const statusColor: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ANALYZING: "bg-blue-100 text-blue-800",
  DONE: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

async function DashboardPage() {
  const data = await getDashboardData();
  if (!data) return null;

  const summaryCards = [
    {
      label: "Total Resumes",
      value: data.total,
      icon: FileText,
      color: "text-blue-500",
      description: "Uploaded resumes",
    },
    {
      label: "Analyzed",
      value: data.analyzed,
      icon: CheckCircle2,
      color: "text-green-500",
      description: "Successfully analyzed",
    },
    {
      label: "Avg Score",
      value: data.averageScore ?? "—",
      icon: TrendingUp,
      color: "text-indigo-500",
      description: "Average resume score",
    },
    {
      label: "Best Score",
      value: data.highestScore ?? "—",
      icon: Star,
      color: "text-yellow-500",
      description: "Highest score achieved",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className={`size-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Resumes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Resumes</CardTitle>
          <Link
            href="/resumes"
            className="text-sm text-muted-foreground hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {data.recent.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="size-10 mx-auto mb-2 opacity-30" />
              <p>No resumes yet. Upload your first resume.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recent.map((resume) => (
                <Link
                  key={resume.id}
                  href={
                    resume.status === "DONE" ? `/resumes/${resume.id}` : "#"
                  }
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="size-5 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">{resume.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(resume.createdAt), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {resume.score !== null && (
                      <p
                        className={`text-lg font-bold font-mono ${scoreColor(resume.score)}`}
                      >
                        {resume.score}
                      </p>
                    )}
                    <Badge className={statusColor[resume.status]}>
                      {resume.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card className="border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950">
        <CardHeader>
          <CardTitle className="text-indigo-500 text-sm">
            💡 Tips for a better score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm text-indigo-700 dark:text-indigo-300 list-disc pl-4">
            <li>Use action verbs and quantifiable achievements</li>
            <li>Tailor your resume for each job application</li>
            <li>Include relevant keywords from the job description</li>
            <li>Keep it to 1-2 pages maximum</li>
            <li>Use a clean, ATS-friendly format</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default DashboardPage;
