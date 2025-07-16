"use client";
import Link from "next/link"
import { ProjectGallery } from "@/components/project-gallery"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-primary mb-1">Plan on a Page</h2>
          <h1 className="text-3xl font-bold tracking-tight">Project Gallery</h1>
          <p className="text-muted-foreground mt-1">Browse all projects and their current status</p>
          <p className="text-sm mt-1 text-primary">
            Need to manage the email recipients list?{' '}
            <Link href="/admin/recipients" className="underline hover:no-underline">Go to Email Recipients</Link>
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Add New Project
        </Link>
      </div>
      
      {/* Traffic Light Legend */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
        <span className="font-medium">Status Legend:</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span>On Track</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Monitor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <span>Off Track / Under Budget / Over Budget</span>
          </div>
        </div>
      </div>
      
      <ProjectGallery />
    </div>
  )
}
