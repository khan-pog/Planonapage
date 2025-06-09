"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
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

// Add function to get current month and year
const getCurrentMonthYear = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export default function NewProjectPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [project, setProject] = useState<Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>>({
    title: "",
    number: "",
    projectManager: "",
    reportMonth: getCurrentMonthYear(),
    phase: "FEL0",
    status: {
      schedule: "On Track",
      scopeQuality: "On Track",
      cost: "On Track",
      safety: "On Track",
      environment: "On Track",
      community: "On Track",
    },
    phasePercentages: {
      fel0: 0,
      fel2: 0,
      fel3: 0,
      preExecution: 0,
      execution: 0,
      closeOut: 0,
    },
    narrative: {
      executiveSummary: "",
      highlights: "",
      challenges: "",
      nextSteps: "",
    },
    milestones: [],
    images: [],
    pmReporting: [],
    costTracking: {
      totalBudget: 0,
      currency: "AUD",
      monthlyData: [],
      costStatus: "On Track",
      variance: 0,
      forecastCompletion: 0,
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      })

      if (!response.ok) {
        throw new Error("Failed to create project")
      }

      const data = await response.json()
      router.push(`/projects/${data.id}`)
    } catch (error) {
      console.error("Error creating project:", error)
      alert("Failed to create project. Please try again.")
    }
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

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Project</CardTitle>
            <CardDescription>Enter project information across the tabs below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="new-project-form" onSubmit={handleSubmit}>
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
            <Button type="submit" form="new-project-form" className="flex gap-2">
              <Save className="h-4 w-4" />
              Create Project
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 