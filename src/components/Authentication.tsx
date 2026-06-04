import SignInDialog from "@/components/dialog/SignInDialog";
import SignUpDialog from "@/components/dialog/SignUpDialog";

function Authentication() {
  return (
    <div className="grid place-items-center gap-6 text-center">
      <div>
        <h1 className="text-5xl font-bold font-mono">
          <span className="text-amber-500">Resu</span>miq
        </h1>
        <p className="text-muted-foreground mt-2">
          AI-powered resume reviewer. Get instant feedback.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <SignInDialog />
        <SignUpDialog />
      </div>
    </div>
  );
}

export default Authentication;
