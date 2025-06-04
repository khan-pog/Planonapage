"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Download, Calendar } from "lucide-react"
import { mockProjects } from "@/lib/mock-data"

export function WeeklyReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateWeeklyReport = async () => {
    setIsGenerating(true)

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real implementation, this would:
    // 1. Generate PDF report
    // 2. Send email to project managers
    // 3. Store report in database

    console.log("Weekly report generated and sent!")
    setIsGenerating(false)
  }

  const getProjectSummary = () => {
    const totalProjects = mockProjects.length
    const underBudget = mockProjects.filter((p) => p.costTracking?.costStatus === "Under Budget").length
    const onTrackCost = mockProjects.filter((p) => p.costTracking?.costStatus === "On Track").length
    const monitorCost = mockProjects.filter((p) => p.costTracking?.costStatus === "Monitor").length
    const overBudget = mockProjects.filter((p) => p.costTracking?.costStatus === "Over Budget").length

    return { totalProjects, underBudget, onTrackCost, monitorCost, overBudget }
  }

  const summary = getProjectSummary()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Weekly Cost Report
        </CardTitle>
        <CardDescription>Automated weekly cost tracking report for all projects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{summary.totalProjects}</div>
            <div className="text-sm text-muted-foreground">Total Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{summary.underBudget}</div>
            <div className="text-sm text-muted-foreground">Under Budget</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{summary.onTrackCost}</div>
            <div className="text-sm text-muted-foreground">On Track</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{summary.monitorCost}</div>
            <div className="text-sm text-muted-foreground">Monitor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{summary.overBudget}</div>
            <div className="text-sm text-muted-foreground">Over Budget</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Projects Requiring Attention:</h4>
          {mockProjects
            .filter(
              (p) =>
                p.costTracking?.costStatus &&
                p.costTracking.costStatus !== "On Track" &&
                p.costTracking.costStatus !== "Under Budget",
            )
            .map((project) => (
              <div key={project.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="font-medium">{project.title}</span>
                  <span className="text-sm text-muted-foreground ml-2">#{project.number}</span>
                </div>
                <Badge variant={project.costTracking?.costStatus === "Monitor" ? "secondary" : "destructive"}>
                  {project.costTracking?.costStatus}
                </Badge>
              </div>
            ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={generateWeeklyReport} disabled={isGenerating} className="flex items-center gap-2">
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Send Weekly Report
              </>
            )}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 inline mr-1" />
          Next automated report: Every Monday at 8:00 AM
        </div>
      </CardContent>
    </Card>
  )
}
