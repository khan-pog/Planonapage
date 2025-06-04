import { NextResponse } from "next/server"
import { createProject } from "@/lib/db"
import { mockProjects } from "@/lib/mock-data"

export async function POST() {
  try {
    for (const project of mockProjects) {
      // Remove the id field so the DB can auto-generate it
      const { id, ...data } = project
      await createProject(data as any)
    }
    return NextResponse.json({ message: "Database seeded successfully" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 