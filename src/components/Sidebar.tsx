"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  ArrowLeftToLine,
  ArrowRightFromLine,
  LogOut,
} from "lucide-react";
import { signOut } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ModeToggle";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/resumes", label: "Resumes", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

function Sidebar({ user }: { user: { username: string; email: string } }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-20"} group duration-200 relative min-h-screen border-r px-4 py-6 flex flex-col justify-between`}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="cursor-pointer absolute -right-4 top-[50%] translate-y-[-50%] rounded-full text-muted-foreground bg-neutral-50 dark:bg-neutral-900 p-2 border opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        {isOpen ? (
          <ArrowLeftToLine className="size-4" />
        ) : (
          <ArrowRightFromLine className="size-4" />
        )}
      </button>

      <div className="space-y-6">
        {/* Logo */}
        <div className="flex items-center pl-3">
          {isOpen && (
            <h1 className="text-2xl font-bold font-mono">
              <span className="text-indigo-500">Resu</span>miq
            </h1>
          )}
        </div>

        {/* Nav */}
        <nav className="space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 ${isOpen ? "px-3" : "justify-center"} py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname.includes(href)
                  ? "bg-neutral-900/10 text-neutral-900 dark:text-neutral-50 dark:bg-neutral-50/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <Icon className="size-5" />
              {isOpen && label}
            </Link>
          ))}
        </nav>
      </div>

      {/* User + Sign Out */}
      <div className="space-y-2">
        {isOpen && (
          <div className="px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
            <p className="text-sm font-semibold">{user.username}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
        <div className={`flex ${!isOpen && "flex-col"} items-center gap-2`}>
          <div className={`flex-1 ${!isOpen && "order-2"}`}>
            <form action={signOut} className="w-full">
              <Button variant="outline" className="w-full" type="submit">
                <LogOut className="size-4" />
                {isOpen && "Sign Out"}
              </Button>
            </form>
          </div>
          <ModeToggle />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
