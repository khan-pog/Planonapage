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
import { Checkbox } from "@/components/ui/checkbox"
import { PLANTS, DISCIPLINES } from "@/lib/constants"

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
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
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
      general: "",
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
    plant: PLANTS[0],
    disciplines: [],
  })
  const [pmEmail, setPmEmail] = useState("")

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!project.title.trim()) {
      newErrors.title = "Project title is required"
    }
    
    if (!project.number.trim()) {
      newErrors.number = "Project number is required"
    }
    
    if (!project.projectManager.trim()) {
      newErrors.projectManager = "Project manager is required"
    }
    
    if (!pmEmail.trim()) {
      newErrors.pmEmail = "PM email is required"
    }
    
    if (!project.reportMonth) {
      newErrors.reportMonth = "Report month is required"
    }
    
    if (!project.phase) {
      newErrors.phase = "Current phase is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

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
      // Warm up the cache in the background
      fetch('/api/warm-cache', { method: 'POST' })
      // Add PM recipient
      if (pmEmail.trim()) {
        fetch("/api/recipients", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ email: pmEmail.trim(), isPm: true, projectId: data.id }),
        }).catch(()=>{});
      }
      // Redirect to the new project's detail page
      router.push(`/projects/${data.id}`)
    } catch (error) {
      console.error("Error creating project:", error)
      alert("Failed to create project. Please try again.")
    } finally {
      setIsSubmitting(false)
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
                  <TabsTrigger value="status">Status & Blockers</TabsTrigger>
                  <TabsTrigger value="cost">Cost Tracking</TabsTrigger>
                  <TabsTrigger value="narratives">Narratives</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones & Images</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="project-title">
                        Project Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="project-title"
                        value={project.title}
                        onChange={(e) => {
                          setProject({ ...project, title: e.target.value })
                          if (errors.title) {
                            setErrors({ ...errors, title: "" })
                          }
                        }}
                        className={errors.title ? "border-red-500" : ""}
                        required
                      />
                      {errors.title && (
                        <p className="text-sm text-red-500">{errors.title}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-number">
                        Project Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="project-number"
                        value={project.number}
                        onChange={(e) => {
                          setProject({ ...project, number: e.target.value })
                          if (errors.number) {
                            setErrors({ ...errors, number: "" })
                          }
                        }}
                        className={errors.number ? "border-red-500" : ""}
                        required
                      />
                      {errors.number && (
                        <p className="text-sm text-red-500">{errors.number}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-manager">
                        Project Manager <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="project-manager"
                        value={project.projectManager}
                        onChange={(e) => {
                          setProject({ ...project, projectManager: e.target.value })
                          if (errors.projectManager) {
                            setErrors({ ...errors, projectManager: "" })
                          }
                        }}
                        className={errors.projectManager ? "border-red-500" : ""}
                        required
                      />
                      {errors.projectManager && (
                        <p className="text-sm text-red-500">{errors.projectManager}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pm-email">
                        PM Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="pm-email"
                        type="email"
                        value={pmEmail}
                        onChange={(e)=>{
                          setPmEmail(e.target.value);
                          if (errors.pmEmail) setErrors({...errors, pmEmail: ""});
                        }}
                        className={errors.pmEmail ? "border-red-500" : ""}
                        required
                      />
                      {errors.pmEmail && <p className="text-sm text-red-500">{errors.pmEmail}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-month">
                        Report Month <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="report-month"
                        type="month"
                        value={project.reportMonth}
                        onChange={(e) => {
                          setProject({ ...project, reportMonth: e.target.value })
                          if (errors.reportMonth) {
                            setErrors({ ...errors, reportMonth: "" })
                          }
                        }}
                        className={errors.reportMonth ? "border-red-500" : ""}
                        required
                      />
                      {errors.reportMonth && (
                        <p className="text-sm text-red-500">{errors.reportMonth}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-phase">
                        Current Phase <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={project.phase}
                        onValueChange={(value: any) => {
                          setProject({ ...project, phase: value })
                          if (errors.phase) {
                            setErrors({ ...errors, phase: "" })
                          }
                        }}
                      >
                        <SelectTrigger id="project-phase" className={errors.phase ? "border-red-500" : ""}>
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
                      {errors.phase && (
                        <p className="text-sm text-red-500">{errors.phase}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="plant-select">
                        Plant <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={project.plant}
                        onValueChange={(value: string) => setProject({ ...project, plant: value as any })}
                      >
                        <SelectTrigger id="plant-select">
                          <SelectValue placeholder="Select plant" />
                        </SelectTrigger>
                        <SelectContent>
                          {PLANTS.map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Disciplines</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {DISCIPLINES.map((d) => {
                          const checked = project.disciplines.includes(d as any)
                          return (
                            <div key={d} className="flex items-center gap-2">
                              <Checkbox
                                id={`discipline-${d}`}
                                checked={checked}
                                onCheckedChange={(val: boolean) => {
                                  const updated = val
                                    ? [...project.disciplines, d as any]
                                    : project.disciplines.filter((disc) => disc !== d)
                                  setProject({ ...project, disciplines: updated })
                                }}
                              />
                              <Label htmlFor={`discipline-${d}`} className="text-sm font-normal">
                                {d}
                              </Label>
                            </div>
                          )
                        })}
                      </div>
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
                              step="50"
                              value={project.phasePercentages[key as keyof typeof project.phasePercentages]}
                              onChange={(e) => {
                                const snapped = Math.round(Number(e.target.value) / 50) * 50;
                                setProject({
                                  ...project,
                                  phasePercentages: {
                                    ...project.phasePercentages,
                                    [key]: snapped,
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

                <TabsContent value="milestones" className="pt-6">
                  <div className="space-y-6">
                    <ProjectMilestones
                      milestones={project.milestones}
                      editable={true}
                      onChange={(milestones) => setProject({ ...project, milestones })}
                    />
                    <ImageUpload
                      images={project.images}
                      onChange={(images) => setProject({ ...project, images })}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
          <CardFooter>
            {activeTab !== "milestones" ? (
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  const tabsOrder = ["basic", "status", "cost", "narratives", "milestones"] as const;
                  const currentIndex = tabsOrder.indexOf(activeTab as typeof tabsOrder[number]);
                  if (currentIndex !== -1 && currentIndex < tabsOrder.length - 1) {
                    setActiveTab(tabsOrder[currentIndex + 1]);
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                form="new-project-form" 
                className="w-full"
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 