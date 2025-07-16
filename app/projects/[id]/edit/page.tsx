"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = Number.parseInt(params.id as string, 10)
  const [project, setProject] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState("basic")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pmEmail, setPmEmail] = useState("")

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
        if (data.status && data.status.safety) {
          const legacy = data.status.safety
          if (legacy === "Yes") data.status.safety = "On Track"
          if (legacy === "No") data.status.safety = "Off Track"
        }
        setProject(data)
        setPmEmail(data.pmEmail ?? "")
      } catch (error) {
        console.error("Error fetching project:", error)
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  // Returns the map of validation errors (empty when valid)
  const validateForm = () => {
    if (!project) return {}

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

    if (!project.reportMonth) {
      newErrors.reportMonth = "Report month is required"
    }

    if (!project.phase) {
      newErrors.phase = "Current phase is required"
    }

    if (!pmEmail.trim()) {
      newErrors.pmEmail = "PM email is required"
    }

    setErrors(newErrors)
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project) return

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      // Decide which tab to show based on which fields have errors
      const basicFields = ["title", "number", "projectManager", "reportMonth", "phase", "pmEmail"]
      const progressFields: string[] = [] // extend in the future as needed

      let targetTab = activeTab
      if (basicFields.some((key) => validationErrors[key])) {
        targetTab = "basic"
      } else if (progressFields.some((key) => validationErrors[key])) {
        targetTab = "progress"
      }

      if (targetTab !== activeTab) {
        setActiveTab(targetTab)
      }

      toast({
        title: "Missing required information",
        description: "Please complete the highlighted fields before saving.",
      })

      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...project, pmEmail: pmEmail.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to update project")
      }

      // Warm up the cache in the background
      fetch('/api/warm-cache', { method: 'POST' })

      // Update PM recipient
      if (pmEmail.trim()) {
        fetch("/api/recipients", {
          method: "POST",
          headers: { "Content-Type":"application/json" },
          body: JSON.stringify({ email: pmEmail.trim(), isPm: true, projectIds: [projectId] }),
        }).catch(()=>{});
      }

      // Redirect to the project's detail page
      router.push(`/projects/${projectId}`)
    } catch (error) {
      console.error("Error updating project:", error)
      alert("Failed to update project. Please try again.")
    } finally {
      setIsSubmitting(false)
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                  <TabsTrigger value="cost">Cost Tracking</TabsTrigger>
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
                        onValueChange={(value: string) => {
                          const phaseOrder = [
                            "FEL0",
                            "FEL2",
                            "FEL3",
                            "Pre-Execution",
                            "Execution",
                            "Close-Out",
                          ] as const;

                          const keyMap: Record<typeof phaseOrder[number], keyof typeof project.phasePercentages> = {
                            "FEL0": "fel0",
                            "FEL2": "fel2",
                            "FEL3": "fel3",
                            "Pre-Execution": "preExecution",
                            "Execution": "execution",
                            "Close-Out": "closeOut",
                          };

                          const chosenIndex = phaseOrder.indexOf(value as typeof phaseOrder[number]);
                          const newPhasePercentages = { ...project.phasePercentages };
                          phaseOrder.forEach((p, idx) => {
                            const key = keyMap[p];
                            if (idx < chosenIndex) {
                              newPhasePercentages[key] = 100;
                            }
                          });

                          setProject({ ...project, phase: value as any, phasePercentages: newPhasePercentages });
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
                        onValueChange={(value: string) => {
                          setProject({ ...project, plant: value as any })
                        }}
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
                    <div className="space-y-2 md:col-span-2">
                      <Label>Project Images</Label>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            size="lg"
                            className="w-full"
                          >
                            <ImageIcon className="h-5 w-5" />
                            Manage Images
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Project Images</DialogTitle>
                            <DialogDescription>Upload and manage images for this project.</DialogDescription>
                          </DialogHeader>
                          <ImageUpload
                            images={project.images}
                            onChange={(images) => setProject({ ...project, images })}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="progress" className="space-y-6 pt-6">
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
                              step="10"
                              value={project.phasePercentages[key as keyof typeof project.phasePercentages]}
                              onChange={(e) => {
                                const snapped = Math.round(Number(e.target.value) / 10) * 10;
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

                  <ProjectMilestones
                    milestones={project.milestones}
                    editable={true}
                    onChange={(milestones) => setProject({ ...project, milestones })}
                  />

                  <ProjectNarratives
                    narrative={project.narrative}
                    editable={true}
                    onChange={(narrative) => setProject({ ...project, narrative })}
                  />
                </TabsContent>

                <TabsContent value="cost" className="pt-6">
                  <ProjectCostForm
                    costTracking={project.costTracking}
                    onChange={(costTracking) => setProject({
                      ...project,
                      costTracking,
                      status: { ...project.status, cost: costTracking.costStatus },
                    })}
                    editable={true}
                  />
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            {activeTab !== "cost" ? (
              <Button
                type="button"
                className="flex gap-2"
                onClick={() => {
                  const tabsOrder = ["basic", "progress", "cost"] as const;
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
                form="edit-project-form" 
                className="flex gap-2"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
