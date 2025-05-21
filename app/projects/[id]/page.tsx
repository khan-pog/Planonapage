"use client"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Edit, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { mockProjects } from "@/lib/mock-data"
import { ProjectStatusPanel } from "@/components/project-status-panel"
import { ProjectReportingTable } from "@/components/project-reporting-table"
import { ProjectPhaseProgress } from "@/components/project-phase-progress"
import { ProjectNarratives } from "@/components/project-narratives"
import { ProjectMilestones } from "@/components/project-milestones"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  // Find the project in mock data
  const project = mockProjects.find((p) => p.id === projectId)

  if (!project) {
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
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Link>
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
            <Button variant="outline" className="flex gap-2">
              <Edit className="h-4 w-4" />
              Edit Project
            </Button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="narratives">Narratives</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
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

            <TabsContent value="images" className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {project.images && project.images.length > 0 ? (
                  project.images.map((image, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Project image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No images available for this project</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - 1/3 width on desktop */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Project Manager:</span>
                <span className="text-sm">{project.projectManager}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Report Month:</span>
                <span className="text-sm">{project.reportMonth}</span>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Current Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${project.status.safety === "Yes" ? "bg-green-500" : project.status.safety === "Monitor" ? "bg-amber-500" : "bg-red-500"}`}
                    />
                    <span className="text-xs">Safety</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${project.status.scopeQuality === "On Track" ? "bg-green-500" : project.status.scopeQuality === "Monitor" ? "bg-amber-500" : project.status.scopeQuality === "Not Applicable" ? "bg-gray-300" : "bg-red-500"}`}
                    />
                    <span className="text-xs">Scope/Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${project.status.cost === "On Track" ? "bg-green-500" : project.status.cost === "Monitor" ? "bg-amber-500" : "bg-red-500"}`}
                    />
                    <span className="text-xs">Cost</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${project.status.schedule === "On Track" ? "bg-green-500" : project.status.schedule === "Monitor" ? "bg-amber-500" : "bg-red-500"}`}
                    />
                    <span className="text-xs">Schedule</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Last Updated</h4>
                <p className="text-sm">{new Date(project.updatedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {project.images && project.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video overflow-hidden rounded-md">
                  <Image
                    src={project.images[0] || "/placeholder.svg"}
                    alt="Featured project image"
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-8 text-center border-t pt-6">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/placeholder.svg?height=40&width=120"
            alt="Incitec Pivot Ltd"
            width={120}
            height={40}
            className="opacity-70"
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Project Manager: {project.projectManager} | Report Month: {project.reportMonth}
        </p>
      </div>
    </div>
  )
}
