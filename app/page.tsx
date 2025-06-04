import Link from "next/link"
import { ProjectGallery } from "@/components/project-gallery"
import { useState } from "react"

export default function Home() {
  const [seeding, setSeeding] = useState(false)
  const [seeded, setSeeded] = useState(false)

  const handleSeed = async () => {
    setSeeding(true)
    setSeeded(false)
    try {
      const res = await fetch("/api/seed-mock-projects", { method: "POST" })
      if (res.ok) setSeeded(true)
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Gallery</h1>
          <p className="text-muted-foreground mt-1">Browse all projects and their current status</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/projects/new"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Add New Project
          </Link>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {seeding ? "Seeding..." : "Seed Mock Data"}
          </button>
          {seeded && <span className="text-green-600 ml-2">Seeded!</span>}
        </div>
      </div>
      <ProjectGallery />
    </div>
  )
}
