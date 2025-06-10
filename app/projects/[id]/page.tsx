"use client"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Edit, User } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProjectStatusPanel } from "@/components/project-status-panel"
import { ProjectReportingTable } from "@/components/project-reporting-table"
import { ProjectPhaseProgress } from "@/components/project-phase-progress"
import { ProjectNarratives } from "@/components/project-narratives"
import { ProjectMilestones } from "@/components/project-milestones"
import { ProjectCostTracking } from "@/components/project-cost-tracking"
import type { Project } from "@/lib/types"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = parseInt(params.id as string, 10)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProject() {
      try {
        if (isNaN(projectId)) {
          throw new Error('Invalid project ID')
        }
        const response = await fetch(`/api/projects/${projectId}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Project not found')
          }
          throw new Error('Failed to fetch project')
        }
        const data = await response.json()
        setProject(data)
      } catch (error) {
        console.error('Error fetching project:', error)
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <p className="mb-6">The project you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/")}>Return to Gallery</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width on desktop */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline">#{project.number}</Badge>
                <Badge>{project.phase}</Badge>
              </div>
              <h1 className="text-3xl font-bold">{project.title}</h1>
            </div>
            <Button variant="outline" className="flex gap-2" onClick={() => router.push(`/projects/${projectId}/edit`)}>
              <Edit className="h-4 w-4" />
              Edit Project
            </Button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="narratives">Narratives</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
              <TabsTrigger value="cost">Cost</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 pt-4">
              <ProjectStatusPanel status={project.status} />
              <ProjectReportingTable reporting={project.pmReporting} />
              <ProjectPhaseProgress percentages={project.phasePercentages} />
            </TabsContent>

            <TabsContent value="narratives" className="pt-4">
              <ProjectNarratives narrative={project.narrative} />
            </TabsContent>

            <TabsContent value="milestones" className="pt-4">
              <ProjectMilestones milestones={project.milestones} />
            </TabsContent>

            <TabsContent value="cost" className="pt-4">
              <ProjectCostTracking costTracking={project.costTracking} />
            </TabsContent>

            <TabsContent value="images" className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {project.images.map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Project image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - 1/3 width on desktop */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Project Manager:</span>
                <span>{project.projectManager}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Report Month:</span>
                <span>{project.reportMonth}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
