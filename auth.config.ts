import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import Credentials from "next-auth/providers/credentials";

const providers: NextAuthConfig["providers"] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID as string,
    clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    authorization: {
      params: {
        prompt: "consent",
        access_type: "offline",
        response_type: "code",
      },
    },
  }),

  Credentials({
    credentials: {
      email: {},
      password: {},
    },
    authorize: async (credentials) => {
      let user = {
        email: "admin@admin.com",
        password: "password",
      };

      if (user.password !== credentials?.password) {
        throw new Error("Invalid credentials.");
      }

      return user;
    },
  }),
];
if (process.env.NEXT_RUNTIME !== "edge") {
  const { default: Nodemailer } = await import(
    "next-auth/providers/nodemailer"
  );
  providers.push(
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    })
  );
}
export default {
  providers,
} satisfies NextAuthConfig;
