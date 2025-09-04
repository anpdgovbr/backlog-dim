import { getServerSession } from "next-auth/next"
import authOptions from "@/config/next-auth.config"

export async function auth() {
  const session = await getServerSession(authOptions)
  return session
}

export default auth
