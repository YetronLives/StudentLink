import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      username?: string
      school?: string
      major?: string
      year?: string
      avatarUrl?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id?: string
    username?: string
    school?: string
    major?: string
    year?: string
    avatarUrl?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string
    username?: string
    school?: string
    major?: string
    year?: string
    avatarUrl?: string
  }
}
