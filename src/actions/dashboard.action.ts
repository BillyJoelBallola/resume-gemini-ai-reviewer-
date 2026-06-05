"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@/actions/user.action";

export async function getDashboardData() {
  const user = await currentUser();
  if (!user) return null;

  const [total, done, failed, recent] = await Promise.all([
    prisma.resume.count({ where: { userId: user.id } }),
    prisma.resume.findMany({
      where: { userId: user.id, status: "DONE" },
      select: { score: true },
    }),
    prisma.resume.count({ where: { userId: user.id, status: "FAILED" } }),
    prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        filename: true,
        score: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  const averageScore =
    done.length > 0
      ? Math.round(
          done.reduce((sum, r) => sum + (r.score ?? 0), 0) / done.length,
        )
      : null;

  const highestScore =
    done.length > 0 ? Math.max(...done.map((r) => r.score ?? 0)) : null;

  return {
    total,
    analyzed: done.length,
    failed,
    averageScore,
    highestScore,
    recent,
  };
}
