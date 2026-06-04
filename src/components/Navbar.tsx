"use client";

import ModeToggle from "@/components/ModeToggle";
import { ProfileMenu } from "@/components/ProfileMenu";
import Link from "next/link";

function Navbar({
  user,
}: {
  user: { username: string; email: string } | null;
}) {
  return (
    <div className="sticky top-0 z-10 border-b bg-neutral-50 dark:bg-neutral-900 py-4">
      <div className="side-margin flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <Link href="/" className="text-xl font-semibold flex items-center">
            <img src="/logo-icon.png" alt="Logo" className="size-6" />
            <p>
              <span>resum</span>
              <span className="text-amber-500">IQ</span>
            </p>
          </Link>
          {user && (
            <Link
              href="/resumes"
              className="text-sm text-muted-foreground hover:text-amber-500"
            >
              Resumes
            </Link>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <ModeToggle />
          {user ? <ProfileMenu username={user.username} /> : null}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
