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
import { Mail, Calendar, Trash2, Send, Clock, ArrowLeft, Database, AlertCircle, Bell, RefreshCcw } from "lucide-react"
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
import ReportHistory from "@/components/report-history"
import { DatePickerInput } from "@/components/date-picker-input"
import ScheduleCalendarPreview from "@/components/schedule-calendar-preview"

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

type ScheduleSettings = {
  frequency: string;
  dayOfWeek: string;
  time: string;
  enabled: boolean;
  sendDate?: string | null;
  pmReminderDay?: string | null;
  pmFinalReminderDays?: number | null;
  pmStartWeeksBefore?: number | null;
};

export default function AdminReportsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Read-only preview of DB-backed recipients list (for Settings tab)
  const [recipientsPreview, setRecipientsPreview] = useState<{ id?: number; email: string }[]>([])

  const [reportSettings, setReportSettings] = useState<ScheduleSettings>({
    frequency: "monthly",
    dayOfWeek: "monday",
    time: "08:00",
    enabled: true,
    sendDate: null,
    pmReminderDay: "monday",
    pmFinalReminderDays: 1,
    pmStartWeeksBefore: 2,
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

  // Sends a one-off demo email to a hard-coded address for testing.
  const sendDemoEmail = async () => {
    try {
      const res = await fetch('/api/reports/send?testEmail=khan.thompson@my.jcu.edu.au,khanthompson123@gmail.com,khan.thompson@incitecpivot.com.au')
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      toast.success(`Demo email sent! (sent: ${data.sent}, failed: ${data.failed})`)
    } catch (err: any) {
      console.error('Error sending demo email', err)
      toast.error(`Demo email failed: ${err.message || err}`)
    }
  }

  // Load recipients preview for Settings tab
  useEffect(() => {
    const fetchRecipientsPreview = async () => {
      try {
        const res = await fetch('/api/recipients')
        if (!res.ok) return
        const data = await res.json()
        setRecipientsPreview(data || [])
      } catch (err) {
        console.error('Failed to load recipients preview', err)
      }
    }
    fetchRecipientsPreview()
  }, [])

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

  // Normalize status values across all projects
  const handleNormalize = async () => {
    try {
      const res = await fetch('/api/projects/normalize', { method: 'POST' })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      toast.success(`Normalization complete. Updated ${data.updated}, unchanged ${data.unchanged}.`)
      fetchProjects()
    } catch (err: any) {
      console.error('Normalize error', err)
      toast.error(`Normalization failed: ${err.message || err}`)
    }
  }

  // --- Load & save schedule ---
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch("/api/report-schedule");
        if (!res.ok) throw new Error("Failed to fetch schedule");
        const data = await res.json();
        setReportSettings({
          frequency: "monthly",
          dayOfWeek: data.dayOfWeek ?? "monday",
          time: data.time,
          enabled: data.enabled,
          sendDate: data.sendDate ?? null,
          pmReminderDay: data.pmReminderDay ?? "monday",
          pmFinalReminderDays: data.pmFinalReminderDays ?? 1,
          pmStartWeeksBefore: data.pmStartWeeksBefore ?? 2,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchSchedule();
  }, []);

  const persistSchedule = async (partial: Partial<ScheduleSettings>) => {
    const optimistic = { ...reportSettings, ...partial };
    setReportSettings(optimistic);
    try {
      await fetch("/api/report-schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(optimistic),
      });
      toast.success("Schedule updated");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to update schedule: " + err.message);
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
          <Button onClick={handleNormalize} className="flex gap-2" variant="outline">
            <RefreshCcw className="h-4 w-4" />
            Normalize Data
          </Button>
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
              {/* Duplicate Test Seeding Validation button removed */}
            </div>
          </CardContent>
        </Card>
      )}

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
              <CardDescription>Current DB recipient list (read-only)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recipientsPreview.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recipients found.</p>
              ) : (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {recipientsPreview.map((r) => (
                    <li key={r.id ?? r.email}>{r.email}</li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-muted-foreground">
                To add or edit recipients, use the "Recipients" tab.
              </p>
              <Button onClick={sendDemoEmail} className="flex items-center gap-2" variant="outline">
                <Send className="h-4 w-4" />
                Send Demo Email
              </Button>
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
                  onCheckedChange={(checked) => persistSchedule({ enabled: checked })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Frequency is fixed to monthly */}
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <p className="text-sm">Monthly</p>
                </div>

                <div className="space-y-2">
                  <Label>Time</Label>
                  <p className="text-sm">08:00 AEST (fixed)</p>
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <DatePickerInput
                    value={reportSettings.sendDate}
                    onChange={(dateStr) => persistSchedule({ sendDate: dateStr })}
                  />
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> PM Reminder Rules
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pm-day">Weekly Reminder Day</Label>
                    <Select
                      value={reportSettings.pmReminderDay!}
                      onValueChange={(v)=>persistSchedule({ pmReminderDay: v })}
                    >
                      <SelectTrigger id="pm-day"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pm-final">Final Reminder (days before send)</Label>
                    <Input
                      id="pm-final"
                      type="number"
                      min={1}
                      max={7}
                      value={reportSettings.pmFinalReminderDays ?? 1}
                      onChange={(e)=>persistSchedule({ pmFinalReminderDays: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pm-weeks">Start Reminders (weeks before send)</Label>
                    <Input
                      id="pm-weeks"
                      type="number"
                      min={1}
                      max={12}
                      value={reportSettings.pmStartWeeksBefore ?? 2}
                      onChange={(e)=>persistSchedule({ pmStartWeeksBefore: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Next scheduled report:{" "}
                  {reportSettings.enabled
                    ? `Every month on the ${new Date(reportSettings.sendDate ?? '1970-01-01').getDate()} at 08:00 AEST`
                    : "Disabled"}
                </p>
              </div>

              {/* Calendar preview of upcoming sends & reminders */}
              <ScheduleCalendarPreview settings={reportSettings} />

              <Button onClick={async ()=>{
                try {
                  const res = await fetch('/api/reminders/test');
                  const data = await res.json();
                  if(!res.ok) throw new Error(data.error || 'Failed');
                  toast.success(`Reminder email sent! (sent: ${data.sent}, failed: ${data.failed})`);
                } catch(err:any){ toast.error(err.message); }
              }} variant="outline" className="flex items-center gap-2">
                <Bell className="h-4 w-4" /> Send Test PM Reminder
              </Button>
            </CardContent>
          </Card>

          {/* Report Content Settings removed per Step 3 – now hard-coded in template */}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <ReportHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
