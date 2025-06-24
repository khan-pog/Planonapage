"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Download, Calendar, Settings, Plus, Trash2, Send, Clock, ArrowLeft, Database, AlertCircle } from "lucide-react"
import Link from "next/link"
import { SeedDatabaseButton } from "@/components/seed-database-button"
import { MigrateDatabaseButton } from "@/components/migrate-database-button"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import RecipientsManager from "@/components/recipients-manager"

interface Project {
  id: number
  title: string
  number: string
  projectManager: string
  reportMonth: string
  phase: string
  status: {
    safety: string
    scopeQuality: string
    cost: string
    schedule: string
    comments?: string
    cpmRagComment?: string
  }
  costTracking?: {
    costStatus: string
    totalBudget?: number
    currency?: string
  }
}

export default function AdminReportsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch projects from database
  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/projects')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      setProjects(data || [])
      
      toast.success(`Successfully loaded ${data?.length || 0} projects from database`)
      
    } catch (err: any) {
      console.error('Error fetching projects:', err)
      setError(err.message)
      toast.error(`Failed to load projects: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Test seeding validation
  const testSeeding = async () => {
    try {
      const response = await fetch('/api/seed', { method: 'GET' })
      const data = await response.json()
      
      if (data.readyToSeed) {
        toast.success(`All ${data.results.validProjects} projects are ready for seeding!`)
      } else {
        toast.error(`${data.results.invalidProjects} projects have validation errors. Check console for details.`)
        console.log('Seeding validation results:', data.results)
      }
    } catch (err: any) {
      toast.error(`Seeding validation failed: ${err.message}`)
    }
  }

  const generateWeeklyReport = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/reports/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailList,
          reportSettings,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send report')
      }

      const result = await response.json()
      console.log('Report sent successfully:', result)
      toast.success(`Report sent successfully to ${result.message}`)
    } catch (error: any) {
      console.error('Error sending report:', error)
      toast.error('Failed to send report. Please try again.')
    } finally {
      setIsGenerating(false)
    }
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
    const totalProjects = projects.length
    const underBudget = projects.filter((p) => p.costTracking?.costStatus === "Under Budget").length
    const onTrackCost = projects.filter((p) => p.costTracking?.costStatus === "On Track").length
    const monitorCost = projects.filter((p) => p.costTracking?.costStatus === "Monitor").length
    const overBudget = projects.filter((p) => p.costTracking?.costStatus === "Over Budget").length

    return { totalProjects, underBudget, onTrackCost, monitorCost, overBudget }
  }

  const summary = getProjectSummary()

  const handleDeleteAllProjects = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch('/api/projects', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete projects')
      }

      const result = await response.json()
      toast.success(`Successfully deleted ${result.count} projects`)
      fetchProjects() // Refresh the projects list
    } catch (error: any) {
      console.error('Error deleting projects:', error)
      toast.error(`Failed to delete projects: ${error.message}`)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleWarmCache = async () => {
    try {
      const response = await fetch('/api/warm-cache', { method: 'POST' });
      const result = await response.json();
      if (response.ok) {
        toast.success(`Cache warmed: ${result.count} projects cached`);
      } else {
        toast.error(`Failed to warm cache: ${result.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      toast.error(`Failed to warm cache: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading projects from database...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              Database Connection Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2">
              <p className="text-sm text-red-600">Possible solutions:</p>
              <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                <li>Check if your database is running and accessible</li>
                <li>Verify POSTGRES_URL environment variable is set correctly</li>
                <li>Ensure the projects table exists in your database</li>
                <li>Try seeding the database if it's empty</li>
              </ul>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={fetchProjects} variant="outline">
                Retry Connection
              </Button>
              <Button onClick={testSeeding} variant="outline">
                Test Seeding
              </Button>
            </div>
          </CardContent>
        </Card>
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

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Reports Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage automated project cost reporting and email notifications
            {projects.length > 0 && (
              <span className="ml-2 text-green-600">
                • {projects.length} projects loaded from database
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete All Projects
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all projects from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAllProjects}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete All Projects'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={testSeeding} variant="outline" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Test Seeding
          </Button>
          <SeedDatabaseButton />
          <MigrateDatabaseButton />
          <Button variant="outline" onClick={handleWarmCache}>
            Warm Up Cache
          </Button>
        </div>
      </div>

      {projects.length === 0 && (
        <Card className="border-yellow-200 bg-yellow-50 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="h-5 w-5" />
              No Projects Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-600 mb-4">
              No projects found in the database. You may need to seed the database with initial data.
            </p>
            <div className="flex gap-2">
              <SeedDatabaseButton />
              <MigrateDatabaseButton />
              <Button onClick={testSeeding} variant="outline">
                Test Seeding Validation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Report Overview</TabsTrigger>
          <TabsTrigger value="settings">Email & Schedule</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
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
              <CardDescription>
                Current status of all projects for this week's report
                {projects.length > 0 && ` (${projects.length} projects from database)`}
              </CardDescription>
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
                {projects
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
                {projects.filter(p => 
                  p.costTracking?.costStatus &&
                  p.costTracking.costStatus !== "On Track" &&
                  p.costTracking.costStatus !== "Under Budget"
                ).length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    ✅ No projects requiring immediate attention
                  </p>
                )}
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
                <Button onClick={fetchProjects} variant="outline" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Refresh Data
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
                <Button 
                  onClick={() => {
                    setEmailList([...emailList, "khanthompson123@gmail.com"]);
                    generateWeeklyReport();
                  }} 
                  className="flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send to Khan
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

        <TabsContent value="recipients" className="space-y-6">
          <RecipientsManager />
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
