import NextAuth, { User, Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import jwt from "jsonwebtoken";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  debug: true,
  pages: {
    signIn: "/admin/login",
    newUser: "/signup",
    error: "/error",
    verifyRequest: "/verify",
  },

  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token, user }) {
      // console.log("[SESSION]", session, token, user);
      // console.log("[token]", token);
      // console.log("[user]", user);

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      return session;
    },

    async signIn({
      user,
      account,
    }: {
      user?: User;
      account?: Account | null;
      profile?: Profile;
    }) {
      if (!user || !account) {
        console.error("[SIGN IN ERROR] Missing user or account data.");
        return false;
      }

      if (account?.provider === "nodemailer" && account.providerAccountId) {
        console.log("[PROVIDER]", account.provider);

        const userExists = await prisma.user.findUnique({
          where: { email: account.providerAccountId },
        });
        if (userExists) {
          return true;
        }

        const newUser = await prisma.user.create({
          data: {
            email: account.providerAccountId,
            emailVerified: new Date(),
          },
        });
        console.log("[newUser]", newUser);
      }

      return true;
    },

    async jwt({ token, account, profile }) {
      // let userdb = null;
      // let accountdb = null;
      // if (account) {
      //   // First-time login, save the `access_token`, its expiry and the `refresh_token`
      //   return {
      //     ...token,
      //     access_token: account.access_token,
      //     expires_at: account.expires_at,
      //     refresh_token: account.refresh_token,
      //   };
      // } else if (Date.now() < token.expires_at * 1000) {
      //   // Subsequent logins, but the `access_token` is still valid
      //   return token;
      // } else {
      //   // Subsequent logins, but the `access_token` has expired, try to refresh it
      //   if (!token.refresh_token) {
      //     console.log(token, account);
      //     userdb = await prisma.user.findUnique({
      //       where: {
      //         email: token.email as string,
      //       },
      //       include: {
      //         accounts: true,
      //       },
      //     });

      //     console.log("[USERDB]", userdb);

      //     accountdb = userdb?.accounts.find(
      //       (account) => account.provider === "google"
      //     );

      //     if (accountdb) {
      //       token.refresh_token = accountdb.refresh_token as string;
      //     }

      //     // throw new TypeError("Missing refresh_token");
      //   }

      //   try {
      //     const response = await fetch("https://oauth2.googleapis.com/token", {
      //       method: "POST",
      //       body: new URLSearchParams({
      //         client_id: process.env.AUTH_GOOGLE_ID! as string,
      //         client_secret: process.env.AUTH_GOOGLE_SECRET! as string,
      //         grant_type: "refresh_token",
      //         refresh_token: token.refresh_token! as string,
      //       }),
      //     });

      //     const tokensOrError = await response.json();

      //     if (!response.ok) throw tokensOrError;

      //     const newTokens = tokensOrError as {
      //       access_token: string;
      //       expires_in: number;
      //       refresh_token?: string;
      //     };
      //     console.log(token);

      //     return {
      //       ...token,
      //       access_token: newTokens.access_token,
      //       expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
      //       refresh_token: newTokens.refresh_token
      //         ? newTokens.refresh_token
      //         : token.refresh_token,
      //     };
      //   } catch (error) {
      //     console.error("Error refreshing access_token", error);
      //     token.error = "RefreshTokenError";

      return token;
      // }
      // }
    },
  },

  ...authConfig,
});

// const getSession = () => getServerSession(authOptions);

// export { getSession };
