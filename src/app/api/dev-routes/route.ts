import fs from "fs"
import { NextResponse } from "next/server"
import path from "path"

const getRoutes = (dir: string, baseUrl = "") => {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  let routes: string[] = []

  for (const file of files) {
    const fullPath = path.join(dir, file.name)
    const routePath = `${baseUrl}/${file.name.replace(/\.tsx?$/, "")}`

    if (file.isDirectory()) {
      routes = [...routes, ...getRoutes(fullPath, routePath)]
    } else if (file.name === "page.tsx" || file.name === "route.ts") {
      routes.push(baseUrl.replace("/app", "").replace("/route", ""))
    }
  }

  return routes
}

export async function GET() {
  const pagesDir = path.join(process.cwd(), "app")
  const apiDir = path.join(pagesDir, "api")

  const pages = getRoutes(pagesDir).filter((r) => !r.includes("/api"))
  const apis = getRoutes(apiDir)

  return NextResponse.json({ pages, apis })
}
