import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import { googleEnabled } from "./constants";
import { findUserById, upsertOAuthUser, verifyUserPassword } from "./users";

export { googleEnabled };

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    ...(googleEnabled
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
          }),
        ]
      : []),
    Credentials({
      name: "Email and password",
      credentials: {
        login: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const login =
          typeof credentials?.login === "string" ? credentials.login : "";
        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!login || !password) return null;

        const user = await verifyUserPassword(login, password);
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session(params) {
      const session = authConfig.callbacks.session(params);

      if (session.user?.id) {
        const stored = await findUserById(session.user.id);
        session.user.role = stored?.role ?? "user";
      }

      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user?.id) {
        token.sub = user.id;
        token.name = user.name ?? undefined;
        token.email = user.email ?? undefined;
        token.role = user.role ?? "user";
        token.picture = user.image ?? undefined;
      } else if (token.sub) {
        const stored = await findUserById(token.sub);
        if (stored) {
          token.role = stored.role ?? "user";
          token.name = stored.name;
          token.email = stored.email;
        }
      }

      if (trigger === "update" && session) {
        if (typeof session.name === "string") token.name = session.name;
        if (typeof session.email === "string") token.email = session.email;
      }

      return token;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        const stored = await upsertOAuthUser({
          email: user.email,
          name:
            user.name ??
            (typeof profile?.name === "string" ? profile.name : user.email),
          image: user.image ?? undefined,
        });
        user.id = stored.id;
        user.role = stored.role;
      }
      return true;
    },
  },
});
