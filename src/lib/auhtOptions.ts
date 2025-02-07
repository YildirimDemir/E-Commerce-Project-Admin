import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { connectToDB } from "./mongodb";
import { verifyPassword } from "./authBcrypt";
import Admin from "@/models/adminModel";

export const options: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Credentials not provided");
        }

        await connectToDB();

        const admin = await Admin.findOne({ email: credentials.email });

        if (!admin) {
          throw new Error("User not found");
        }

        const isValid = await verifyPassword(credentials.password, admin.password);
        if (!isValid) {
          throw new Error("Incorrect password");
        }

        return {
          id: admin._id.toString(),
          email: admin.email,
          name: admin.name,
          role: admin.role
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token-admin",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: "admin.localhost",
      },
    },
  },
};
