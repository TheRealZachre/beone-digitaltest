import type { NextAuthConfig } from "next-auth";
import { getAnalyticsAppUrl } from "@/lib/analytics-app-url";
import { getAuthSecret } from "@/lib/env";

export const authConfig = {
  secret: getAuthSecret(),
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const analyticsAppUrl = getAnalyticsAppUrl();
      const { pathname, search } = nextUrl;

      if (
        pathname === "/methodology" ||
        pathname.startsWith("/reports")
      ) {
        return Response.redirect(
          new URL(`${pathname}${search}`, analyticsAppUrl)
        );
      }

      const isLoggedIn = !!auth?.user;

      const isAuthRoute =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password");
      const isAuthApi = pathname.startsWith("/api/auth");
      const isPublicApi =
        isAuthApi || pathname.startsWith("/api/health");
      const isAdminRoute =
        pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
      const isStaticAsset =
        pathname.startsWith("/brand") ||
        /\.(?:svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname);

      if (isPublicApi || isStaticAsset) return true;

      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      if (isAdminRoute) {
        if (!isLoggedIn) return false;
        if (auth?.user?.role !== "admin") {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      return isLoggedIn;
    },
    jwt({ token, user, trigger, session }) {
      if (user?.id) {
        token.sub = user.id;
      }
      if (user?.role) {
        token.role = user.role;
      }
      if (user?.name) {
        token.name = user.name;
      }
      if (user?.email) {
        token.email = user.email;
      }
      if (trigger === "update" && session) {
        if (typeof session.name === "string") token.name = session.name;
        if (typeof session.email === "string") token.email = session.email;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role =
          token.role === "admin" || token.role === "user"
            ? token.role
            : "user";
        if (typeof token.name === "string") session.user.name = token.name;
        if (typeof token.email === "string") session.user.email = token.email;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
