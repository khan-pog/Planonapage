"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Project } from "@/lib/types"

export default function NewProjectPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [project, setProject] = useState<Omit<Project, 'id' | 'updatedAt' | 'ownerId'>>({
    title: "",
    number: "",
    projectManager: "",
    reportMonth: "",
    phase: "FEL0",
    status: {
      safety: "Yes",
      scopeQuality: "On Track", 
      cost: "On Track",
      schedule: "On Track",
      comments: "",
      cpmRagComment: "",
    },
    pmReporting: [],
    phasePercentages: {
      fel0: 0,
      fel2: 0,
      fel3: 0,
      preExecution: 0,
      execution: 0,
      closeOut: 0,
    },
    narrative: {
      general: "",
      achieved: "",
      plannedNext: "",
      riskIssues: "",
    },
    milestones: [],
    images: [],
    costTracking: {
      totalBudget: 0,
      currency: "AUD",
      monthlyData: [],
      costStatus: "On Track",
      variance: 0,
      forecastCompletion: 0,
    },
  })

  const validateForm = (): string | null => {
    if (!project.title.trim()) return "Project title is required"
    if (!project.number.trim()) return "Project number is required"
    if (!project.projectManager.trim()) return "Project manager is required"
    if (!project.reportMonth) return "Report month is required"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
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
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to create project (${response.status})`)
      }

      const data = await response.json()
      router.push(`/projects/${data.id}`)
    } catch (error) {
      console.error("Error creating project:", error)
      setError(error instanceof Error ? error.message : "Failed to create project. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addMilestone = () => {
    setProject({
      ...project,
      milestones: [...project.milestones, { stage: "", date: "", comment: "" }]
    })
  }

  const updateMilestone = (index: number, field: string, value: string) => {
    const newMilestones = [...project.milestones]
    newMilestones[index] = { ...newMilestones[index], [field]: value }
    setProject({ ...project, milestones: newMilestones })
  }

  const removeMilestone = (index: number) => {
    const newMilestones = project.milestones.filter((_, i) => i !== index)
    setProject({ ...project, milestones: newMilestones })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages: string[] = []
    
    for (const file of Array.from(files)) {
      if (project.images.length + newImages.length >= 10) {
        setError('Maximum 10 images allowed')
        break
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select only image files')
        continue
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        continue
      }

      try {
        const reader = new FileReader()
        const result = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        newImages.push(result)
      } catch (error) {
        console.error('Error processing file:', error)
        setError(`Error processing file: ${file.name}`)
      }
    }

    if (newImages.length > 0) {
      setProject({ ...project, images: [...project.images, ...newImages] })
    }
    
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    const newImages = project.images.filter((_, i) => i !== index)
    setProject({ ...project, images: newImages })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          disabled={isSubmitting}
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
            {error && (
              <Alert className="mb-6" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form id="new-project-form" onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="status">Status & Progress</TabsTrigger>
                  <TabsTrigger value="cost">Cost Tracking</TabsTrigger>
                  <TabsTrigger value="narratives">Narratives</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones & Images</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="project-title">Project Title <span className="text-red-500">*</span></Label>
                      <Input
                        id="project-title"
                        value={project.title}
                        onChange={(e) => setProject({ ...project, title: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-number">Project Number <span className="text-red-500">*</span></Label>
                      <Input
                        id="project-number"
                        value={project.number}
                        onChange={(e) => setProject({ ...project, number: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-manager">Project Manager <span className="text-red-500">*</span></Label>
                      <Input
                        id="project-manager"
                        value={project.projectManager}
                        onChange={(e) => setProject({ ...project, projectManager: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-month">Report Month <span className="text-red-500">*</span></Label>
                      <Input
                        id="report-month"
                        type="month"
                        value={project.reportMonth}
                        onChange={(e) => setProject({ ...project, reportMonth: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-phase">Current Phase</Label>
                      <Select
                        value={project.phase}
                        onValueChange={(value: "FEL0" | "FEL2" | "FEL3" | "Pre-Execution" | "Execution" | "Close-Out") => 
                          setProject({ ...project, phase: value })
                        }
                        disabled={isSubmitting}
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
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Status</CardTitle>
                      <CardDescription>Update the current status indicators for this project</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="safety">Safety</Label>
                          <Select
                            value={project.status.safety}
                            onValueChange={(value: "Yes" | "No" | "Monitor") => 
                              setProject({ ...project, status: { ...project.status, safety: value } })
                            }
                            disabled={isSubmitting}
                          >
                            <SelectTrigger id="safety">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                              <SelectItem value="Monitor">Monitor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="scopeQuality">Scope Quality</Label>
                          <Select
                            value={project.status.scopeQuality}
                            onValueChange={(value: "On Track" | "Monitor" | "Not Applicable") => 
                              setProject({ ...project, status: { ...project.status, scopeQuality: value } })
                            }
                            disabled={isSubmitting}
                          >
                            <SelectTrigger id="scopeQuality">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="On Track">On Track</SelectItem>
                              <SelectItem value="Monitor">Monitor</SelectItem>
                              <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cost">Cost</Label>
                          <Select
                            value={project.status.cost}
                            onValueChange={(value: "On Track" | "Monitor" | "Over") => 
                              setProject({ ...project, status: { ...project.status, cost: value } })
                            }
                            disabled={isSubmitting}
                          >
                            <SelectTrigger id="cost">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="On Track">On Track</SelectItem>
                              <SelectItem value="Monitor">Monitor</SelectItem>
                              <SelectItem value="Over">Over</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="schedule">Schedule</Label>
                          <Select
                            value={project.status.schedule}
                            onValueChange={(value: "On Track" | "Monitor" | "Delayed") => 
                              setProject({ ...project, status: { ...project.status, schedule: value } })
                            }
                            disabled={isSubmitting}
                          >
                            <SelectTrigger id="schedule">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="On Track">On Track</SelectItem>
                              <SelectItem value="Monitor">Monitor</SelectItem>
                              <SelectItem value="Delayed">Delayed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="comments">General Comments</Label>
                        <Textarea
                          id="comments"
                          value={project.status.comments}
                          onChange={(e) => setProject({ ...project, status: { ...project.status, comments: e.target.value } })}
                          disabled={isSubmitting}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpmRagComment">CPM RAG Comments</Label>
                        <Textarea
                          id="cpmRagComment"
                          value={project.status.cpmRagComment}
                          onChange={(e) => setProject({ ...project, status: { ...project.status, cpmRagComment: e.target.value } })}
                          disabled={isSubmitting}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

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
                                    [key]: Number.parseInt(e.target.value, 10),
                                  },
                                })
                              }}
                              disabled={isSubmitting}
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cost" className="pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cost Tracking</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="totalBudget">Total Budget</Label>
                          <Input
                            id="totalBudget"
                            type="number"
                            value={project.costTracking.totalBudget}
                            onChange={(e) => setProject({ 
                              ...project, 
                              costTracking: { 
                                ...project.costTracking, 
                                totalBudget: Number.parseFloat(e.target.value) || 0 
                              } 
                            })}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currency">Currency</Label>
                          <Select
                            value={project.costTracking.currency}
                            onValueChange={(value) => setProject({ 
                              ...project, 
                              costTracking: { ...project.costTracking, currency: value } 
                            })}
                            disabled={isSubmitting}
                          >
                            <SelectTrigger id="currency">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AUD">AUD</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="costStatus">Cost Status</Label>
                          <Select
                            value={project.costTracking.costStatus}
                            onValueChange={(value: "Under Budget" | "On Track" | "Monitor" | "Over Budget") => 
                              setProject({ 
                                ...project, 
                                costTracking: { ...project.costTracking, costStatus: value } 
                              })
                            }
                            disabled={isSubmitting}
                          >
                            <SelectTrigger id="costStatus">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Under Budget">Under Budget</SelectItem>
                              <SelectItem value="On Track">On Track</SelectItem>
                              <SelectItem value="Monitor">Monitor</SelectItem>
                              <SelectItem value="Over Budget">Over Budget</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="variance">Variance (%)</Label>
                          <Input
                            id="variance"
                            type="number"
                            value={project.costTracking.variance}
                            onChange={(e) => setProject({ 
                              ...project, 
                              costTracking: { 
                                ...project.costTracking, 
                                variance: Number.parseFloat(e.target.value) || 0 
                              } 
                            })}
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="forecastCompletion">Forecast Completion</Label>
                          <Input
                            id="forecastCompletion"
                            type="number"
                            value={project.costTracking.forecastCompletion}
                            onChange={(e) => setProject({ 
                              ...project, 
                              costTracking: { 
                                ...project.costTracking, 
                                forecastCompletion: Number.parseFloat(e.target.value) || 0 
                              } 
                            })}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="narratives" className="pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Narratives</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="general">General</Label>
                        <Textarea
                          id="general"
                          value={project.narrative.general}
                          onChange={(e) => setProject({ 
                            ...project, 
                            narrative: { ...project.narrative, general: e.target.value } 
                          })}
                          disabled={isSubmitting}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="achieved">Achieved</Label>
                        <Textarea
                          id="achieved"
                          value={project.narrative.achieved}
                          onChange={(e) => setProject({ 
                            ...project, 
                            narrative: { ...project.narrative, achieved: e.target.value } 
                          })}
                          disabled={isSubmitting}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="plannedNext">Planned Next</Label>
                        <Textarea
                          id="plannedNext"
                          value={project.narrative.plannedNext}
                          onChange={(e) => setProject({ 
                            ...project, 
                            narrative: { ...project.narrative, plannedNext: e.target.value } 
                          })}
                          disabled={isSubmitting}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="riskIssues">Risk Issues</Label>
                        <Textarea
                          id="riskIssues"
                          value={project.narrative.riskIssues}
                          onChange={(e) => setProject({ 
                            ...project, 
                            narrative: { ...project.narrative, riskIssues: e.target.value } 
                          })}
                          disabled={isSubmitting}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="milestones" className="space-y-6 pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Milestones</CardTitle>
                      <CardDescription>Add and manage project milestones</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {project.milestones.map((milestone, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                          <div className="space-y-2">
                            <Label htmlFor={`milestone-stage-${index}`}>Stage</Label>
                            <Input
                              id={`milestone-stage-${index}`}
                              value={milestone.stage}
                              onChange={(e) => updateMilestone(index, 'stage', e.target.value)}
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`milestone-date-${index}`}>Date</Label>
                            <Input
                              id={`milestone-date-${index}`}
                              type="date"
                              value={milestone.date}
                              onChange={(e) => updateMilestone(index, 'date', e.target.value)}
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`milestone-comment-${index}`}>Comment</Label>
                            <Input
                              id={`milestone-comment-${index}`}
                              value={milestone.comment}
                              onChange={(e) => updateMilestone(index, 'comment', e.target.value)}
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeMilestone(index)}
                              disabled={isSubmitting}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addMilestone}
                        disabled={isSubmitting}
                      >
                        Add Milestone
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Project Images</CardTitle>
                      <CardDescription>Upload project images (max 10, 10MB each)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {project.images.map((image, index) => (
                          <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                            <img
                              src={image}
                              alt={`Project image ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => removeImage(index)}
                              disabled={isSubmitting}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        {project.images.length < 10 && (
                          <div className="relative border border-dashed rounded-lg p-4 flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-muted/50 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              disabled={isSubmitting}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-8 w-8 text-muted-foreground mb-2"
                            >
                              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                              <circle cx="9" cy="9" r="2" />
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                            </svg>
                            <p className="text-sm text-muted-foreground text-center">Click to upload</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              type="submit" 
              form="new-project-form" 
              className="flex gap-2" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 