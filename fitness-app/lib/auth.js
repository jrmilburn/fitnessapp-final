// lib/auth-options.ts
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt   from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize (creds) {
        if (!creds?.email || !creds?.password) throw new Error("Missing creds")

        const user = await prisma.user.findUnique({ where: { email: creds.email } })
        if (!user) throw new Error("Invalid email or password")

        const ok = await bcrypt.compare(creds.password, user.password)
        if (!ok) throw new Error("Invalid email or password")

        return { id: user.id, email: user.email }
      }
    })
  ],

  callbacks: {
    /** Runs on *every* request that touches auth */
    async jwt({ token, user }) {
      // First login – copy user info
      if (user) return { ...token, id: user.id }

      // Subsequent requests – confirm the DB row is still there
      if (token?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { id: true }
        })
        if (!dbUser) {
          // Invalidate the session
          return {}            // Returning an empty object ➜ no session
        }
      }
      return token
    },

    async session({ session, token }) {
      if (!token?.id) return null          // “unauthenticated”
      session.user = { id: token.id, email: token.email }
      return session
    }
  }
}
