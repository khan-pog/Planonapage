"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Download, Calendar, Settings, Plus, Trash2, Send, Clock, ArrowLeft } from "lucide-react"
import { mockProjects } from "@/lib/mock-data"
import Link from "next/link"
import { SeedDatabaseButton } from "@/components/seed-database-button"

export default function AdminReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [emailList, setEmailList] = useState([
    "jane.smith@company.com",
    "michael.johnson@company.com",
    "amanda.lee@company.com",
  ])
  const [newEmail, setNewEmail] = useState("")
  const [reportSettings, setReportSettings] = useState({
    frequency: "weekly",
    dayOfWeek: "monday",
    time: "08:00",
    enabled: true,
    includeCharts: true,
    includeSummary: true,
    includeDetails: true,
  })

  const generateWeeklyReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Weekly report generated and sent to:", emailList)
    setIsGenerating(false)
  }

  const addEmail = () => {
    if (newEmail && !emailList.includes(newEmail)) {
      setEmailList([...emailList, newEmail])
      setNewEmail("")
    }
  }

  const removeEmail = (email: string) => {
    setEmailList(emailList.filter((e) => e !== email))
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

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Reports Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage automated project cost reporting and email notifications</p>
        </div>
        <SeedDatabaseButton />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Report Overview</TabsTrigger>
          <TabsTrigger value="settings">Email & Schedule</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Report Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Weekly Cost Report Preview
              </CardTitle>
              <CardDescription>Current status of all projects for this week's report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold">{summary.totalProjects}</div>
                  <div className="text-sm text-muted-foreground">Total Projects</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{summary.underBudget}</div>
                  <div className="text-sm text-muted-foreground">Under Budget</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{summary.onTrackCost}</div>
                  <div className="text-sm text-muted-foreground">On Track</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{summary.monitorCost}</div>
                  <div className="text-sm text-muted-foreground">Monitor</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{summary.overBudget}</div>
                  <div className="text-sm text-muted-foreground">Over Budget</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-lg">Projects Requiring Attention:</h4>
                {mockProjects
                  .filter(
                    (p) =>
                      p.costTracking?.costStatus &&
                      p.costTracking.costStatus !== "On Track" &&
                      p.costTracking.costStatus !== "Under Budget",
                  )
                  .map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{project.title}</span>
                        <span className="text-sm text-muted-foreground ml-2">#{project.number}</span>
                        <div className="text-sm text-muted-foreground">PM: {project.projectManager}</div>
                      </div>
                      <Badge variant={project.costTracking?.costStatus === "Monitor" ? "secondary" : "destructive"}>
                        {project.costTracking?.costStatus}
                      </Badge>
                    </div>
                  ))}
              </div>

              <div className="flex gap-3">
                <Button onClick={generateWeeklyReport} disabled={isGenerating} className="flex items-center gap-2">
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Report Now
                    </>
                  )}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Recipients
              </CardTitle>
              <CardDescription>Manage who receives the automated reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter email address"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addEmail()}
                />
                <Button onClick={addEmail} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {emailList.map((email, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span>{email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEmail(email)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Schedule Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Report Schedule
              </CardTitle>
              <CardDescription>Configure when reports are automatically sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable-reports">Enable Automated Reports</Label>
                  <p className="text-sm text-muted-foreground">Turn on/off automatic report generation</p>
                </div>
                <Switch
                  id="enable-reports"
                  checked={reportSettings.enabled}
                  onCheckedChange={(checked) => setReportSettings({ ...reportSettings, enabled: checked })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={reportSettings.frequency}
                    onValueChange={(value) => setReportSettings({ ...reportSettings, frequency: value })}
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {reportSettings.frequency === "weekly" && (
                  <div className="space-y-2">
                    <Label htmlFor="day-of-week">Day of Week</Label>
                    <Select
                      value={reportSettings.dayOfWeek}
                      onValueChange={(value) => setReportSettings({ ...reportSettings, dayOfWeek: value })}
                    >
                      <SelectTrigger id="day-of-week">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={reportSettings.time}
                    onChange={(e) => setReportSettings({ ...reportSettings, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Next scheduled report:{" "}
                  {reportSettings.enabled
                    ? `Every ${reportSettings.frequency === "weekly" ? reportSettings.dayOfWeek : reportSettings.frequency} at ${reportSettings.time}`
                    : "Disabled"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Report Content Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Report Content
              </CardTitle>
              <CardDescription>Choose what to include in the automated reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="include-summary">Include Summary</Label>
                  <p className="text-sm text-muted-foreground">Project count and status overview</p>
                </div>
                <Switch
                  id="include-summary"
                  checked={reportSettings.includeSummary}
                  onCheckedChange={(checked) => setReportSettings({ ...reportSettings, includeSummary: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="include-charts">Include Charts</Label>
                  <p className="text-sm text-muted-foreground">Cost tracking charts and graphs</p>
                </div>
                <Switch
                  id="include-charts"
                  checked={reportSettings.includeCharts}
                  onCheckedChange={(checked) => setReportSettings({ ...reportSettings, includeCharts: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="include-details">Include Project Details</Label>
                  <p className="text-sm text-muted-foreground">Detailed information for each project</p>
                </div>
                <Switch
                  id="include-details"
                  checked={reportSettings.includeDetails}
                  onCheckedChange={(checked) => setReportSettings({ ...reportSettings, includeDetails: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>View previously sent reports and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "2023-05-22", status: "Sent", recipients: 3, type: "Weekly" },
                  { date: "2023-05-15", status: "Sent", recipients: 3, type: "Weekly" },
                  { date: "2023-05-08", status: "Sent", recipients: 2, type: "Weekly" },
                  { date: "2023-05-01", status: "Failed", recipients: 3, type: "Weekly" },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">
                        {report.type} Report - {report.date}
                      </div>
                      <div className="text-sm text-muted-foreground">Sent to {report.recipients} recipients</div>
                    </div>
                    <Badge variant={report.status === "Sent" ? "default" : "destructive"}>{report.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
