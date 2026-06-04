import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { currentUser } from "@/actions/user.action";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: true,
});

export const metadata: Metadata = {
  title: { default: "Resumiq", template: "%s | Resumiq" },
  description: "AI-powered resume reviewer.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-right" />
          <Navbar user={user} />
          <main className="side-margin min-h-screen py-8">{children}</main>
          <footer className="grid text-center py-8 text-xs text-muted-foreground">
            <span>Design & Built by Billy Joel</span>
            <span>
              © {new Date().getFullYear()} Resumiq. All rights reserved.
            </span>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
