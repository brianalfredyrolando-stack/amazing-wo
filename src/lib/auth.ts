import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "wo_session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me-please-make-it-long-enough"
);

export type Session = {
  userId: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "STAFF";
};

export async function createToken(session: Session): Promise<string> {
  return await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as Session["role"],
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getSession(): Promise<Session | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export const SESSION_COOKIE = COOKIE;
