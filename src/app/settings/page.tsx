import { currentUser } from "@/actions/user.action";
import ProfileForm from "@/components/form/ProfileForm";
import PasswordForm from "@/components/form/PasswordForm";
import AccountDelete from "@/components/AccountDelete";

export const dynamic = "force-dynamic";

async function SettingsPage() {
  const user = await currentUser();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="grid gap-6">
        <ProfileForm user={user} />
        <PasswordForm />
        <AccountDelete userId={user.id} />
      </div>
    </div>
  );
}

export default SettingsPage;
