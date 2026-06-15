import { NextRequest, NextResponse } from "next/server";
import { signOut } from "@/lib/auth";

export async function GET(request: NextRequest) {
  await signOut({ redirect: false, redirectTo: "/login" });
  return NextResponse.redirect(new URL("/login", request.url));
}
