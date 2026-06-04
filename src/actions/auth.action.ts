"use server";

import { getJwtSecretKey, TOKEN_NAME } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function signUp({
  username,
  email,
  password,
  confirmPassword,
}: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) return { error: "Username or email already exists." };
    if (password !== confirmPassword)
      return { error: "Passwords do not match." };
    if (password.length < 8)
      return { error: "Password must be at least 8 characters." };

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    return { success: true, user };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while signing up." };
  }
}

export async function signIn({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, password: true },
    });

    if (!user) return { error: "User not found." };

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return { error: "Invalid password." };

    const token = await new SignJWT({ sub: user.id, username: user.username })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(getJwtSecretKey());

    (await cookies()).set(TOKEN_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while signing in." };
  }
}

export async function signOut() {
  (await cookies()).delete(TOKEN_NAME);
}
