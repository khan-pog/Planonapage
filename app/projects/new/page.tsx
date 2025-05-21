"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, ImageIcon, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProjectStatusPanel } from "@/components/project-status-panel"
import { ProjectNarratives } from "@/components/project-narratives"
import { ProjectMilestones } from "@/components/project-milestones"

export default function NewProjectPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [formState, setFormState] = useState({
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
    pmReporting: [
      { type: "PoAP Report", complete: false, date: "", signatory: "" },
      { type: "Schedule", complete: false, date: "", signatory: "" },
      { type: "Forecast", complete: false, date: "", signatory: "" },
      { type: "Execution Readiness", complete: false, date: "", signatory: "" },
    ],
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
    updatedAt: new Date().toISOString(),
    ownerId: "current-user-id",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to the database
    console.log("Submitting project:", formState)

    // Redirect to the gallery page
    router.push("/")
  }

  const nextTab = () => {
    if (activeTab === "basic") setActiveTab("status")
    else if (activeTab === "status") setActiveTab("narratives")
    else if (activeTab === "narratives") setActiveTab("milestones")
  }

  const prevTab = () => {
    if (activeTab === "milestones") setActiveTab("narratives")
    else if (activeTab === "narratives") setActiveTab("status")
    else if (activeTab === "status") setActiveTab("basic")
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
            <CardDescription>
              Add a new project to the gallery. Fill out all required information across the tabs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="new-project-form" onSubmit={handleSubmit}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="status">Status & RAG</TabsTrigger>
                  <TabsTrigger value="narratives">Narratives</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones & Images</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="project-title">Project Title</Label>
                      <Input
                        id="project-title"
                        placeholder="Enter project title"
                        value={formState.title}
                        onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-number">Project Number</Label>
                      <Input
                        id="project-number"
                        placeholder="Enter project number"
                        value={formState.number}
                        onChange={(e) => setFormState({ ...formState, number: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-manager">Project Manager</Label>
                      <Input
                        id="project-manager"
                        placeholder="Enter project manager name"
                        value={formState.projectManager}
                        onChange={(e) => setFormState({ ...formState, projectManager: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-month">Report Month</Label>
                      <Input
                        id="report-month"
                        type="month"
                        value={formState.reportMonth}
                        onChange={(e) => setFormState({ ...formState, reportMonth: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-phase">Current Phase</Label>
                      <Select
                        value={formState.phase}
                        onValueChange={(value) => setFormState({ ...formState, phase: value })}
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
                  <ProjectStatusPanel status={formState.status} editable={true} />

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
                                {formState.phasePercentages[key as keyof typeof formState.phasePercentages]}%
                              </span>
                            </div>
                            <Input
                              id={`phase-${key}`}
                              type="range"
                              min="0"
                              max="100"
                              value={formState.phasePercentages[key as keyof typeof formState.phasePercentages]}
                              onChange={(e) => {
                                setFormState({
                                  ...formState,
                                  phasePercentages: {
                                    ...formState.phasePercentages,
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

                <TabsContent value="narratives" className="pt-6">
                  <ProjectNarratives narrative={formState.narrative} editable={true} />
                </TabsContent>

                <TabsContent value="milestones" className="space-y-6 pt-6">
                  <ProjectMilestones milestones={formState.milestones} editable={true} />

                  <Card>
                    <CardHeader>
                      <CardTitle>Project Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center aspect-square cursor-pointer hover:bg-muted/50 transition-colors">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground text-center">Click to upload or drag and drop</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={prevTab} disabled={activeTab === "basic"}>
              Previous
            </Button>
            <div className="flex gap-2">
              {activeTab === "milestones" ? (
                <Button type="submit" form="new-project-form" className="flex gap-2">
                  <Save className="h-4 w-4" />
                  Save Project
                </Button>
              ) : (
                <Button type="button" onClick={nextTab} className="flex gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
