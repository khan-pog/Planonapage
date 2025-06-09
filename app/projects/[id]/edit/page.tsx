"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProjectStatusPanel } from "@/components/project-status-panel"
import { ProjectNarratives } from "@/components/project-narratives"
import { ProjectMilestones } from "@/components/project-milestones"
import type { Project } from "@/lib/types"
import { ProjectCostForm } from "@/components/project-cost-form"
import { ImageUpload } from "@/components/image-upload"

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = Number.parseInt(params.id as string, 10)
  const [project, setProject] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProject() {
      try {
        if (isNaN(projectId)) {
          throw new Error("Invalid project ID")
        }
        const response = await fetch(`/api/projects/${projectId}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Project not found")
          }
          throw new Error("Failed to fetch project")
        }
        const data = await response.json()
        setProject(data)
      } catch (error) {
        console.error("Error fetching project:", error)
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      })

      if (!response.ok) {
        throw new Error("Failed to update project")
      }

      router.push(`/projects/${projectId}`)
    } catch (error) {
      console.error("Error updating project:", error)
      alert("Failed to update project. Please try again.")
    }
  }

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
          onClick={() => router.push(`/projects/${projectId}`)}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Project
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Project</CardTitle>
            <CardDescription>Update project information across the tabs below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="edit-project-form" onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="status">Status & RAG</TabsTrigger>
                  <TabsTrigger value="cost">Cost Tracking</TabsTrigger>
                  <TabsTrigger value="narratives">Narratives</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones & Images</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="project-title">Project Title</Label>
                      <Input
                        id="project-title"
                        value={project.title}
                        onChange={(e) => setProject({ ...project, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-number">Project Number</Label>
                      <Input
                        id="project-number"
                        value={project.number}
                        onChange={(e) => setProject({ ...project, number: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-manager">Project Manager</Label>
                      <Input
                        id="project-manager"
                        value={project.projectManager}
                        onChange={(e) => setProject({ ...project, projectManager: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-month">Report Month</Label>
                      <Input
                        id="report-month"
                        type="month"
                        value={project.reportMonth}
                        onChange={(e) => setProject({ ...project, reportMonth: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-phase">Current Phase</Label>
                      <Select
                        value={project.phase}
                        onValueChange={(value: any) => setProject({ ...project, phase: value })}
                      >
                        <SelectTrigger id="project-phase">
                          <SelectValue placeholder="Select phase" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FEL0">FEL0</SelectItem>
                          <SelectItem value="FEL2">FEL2</SelectItem>
                          <SelectItem value="FEL3">FEL3</SelectItem>
                          <SelectItem value="Pre-Execution">Pre-Execution</SelectItem>
                          <SelectItem value="Execution">Execution</SelectItem>
                          <SelectItem value="Close-Out">Close-Out</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="status" className="space-y-6 pt-6">
                  <ProjectStatusPanel 
                    status={project.status} 
                    editable={true} 
                    onChange={(status) => setProject({ ...project, status })}
                  />

                  <Card>
                    <CardHeader>
                      <CardTitle>Phase Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries({
                          fel0: "FEL 0",
                          fel2: "FEL 2",
                          fel3: "FEL 3",
                          preExecution: "Pre-Execution",
                          execution: "Execution",
                          closeOut: "Close-Out",
                        }).map(([key, label]) => (
                          <div key={key} className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor={`phase-${key}`}>{label}</Label>
                              <span className="text-sm text-muted-foreground">
                                {project.phasePercentages[key as keyof typeof project.phasePercentages]}%
                              </span>
                            </div>
                            <Input
                              id={`phase-${key}`}
                              type="range"
                              min="0"
                              max="100"
                              value={project.phasePercentages[key as keyof typeof project.phasePercentages]}
                              onChange={(e) => {
                                setProject({
                                  ...project,
                                  phasePercentages: {
                                    ...project.phasePercentages,
                                    [key]: Number.parseInt(e.target.value),
                                  },
                                })
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cost" className="pt-6">
                  <ProjectCostForm
                    costTracking={project.costTracking}
                    onChange={(costTracking) => setProject({ ...project, costTracking })}
                    editable={true}
                  />
                </TabsContent>

                <TabsContent value="narratives" className="pt-6">
                  <ProjectNarratives 
                    narrative={project.narrative} 
                    editable={true} 
                    onChange={(narrative) => setProject({ ...project, narrative })}
                  />
                </TabsContent>

                <TabsContent value="milestones" className="space-y-6 pt-6">
                  <ProjectMilestones 
                    milestones={project.milestones} 
                    editable={true} 
                    onChange={(milestones) => setProject({ ...project, milestones })}
                  />

                  <Card>
                    <CardHeader>
                      <CardTitle>Project Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ImageUpload
                        images={project.images}
                        onChange={(images) => setProject({ ...project, images })}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" form="edit-project-form" className="flex gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
