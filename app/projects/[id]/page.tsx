"use client"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Edit, User } from "lucide-react"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProjectStatusPanel } from "@/components/project-status-panel"
import { ProjectReportingTable } from "@/components/project-reporting-table"
import { ProjectPhaseProgress } from "@/components/project-phase-progress"
import { ProjectNarratives } from "@/components/project-narratives"
import { ProjectMilestones } from "@/components/project-milestones"
import { ProjectCostTracking } from "@/components/project-cost-tracking"
import type { Project } from "@/lib/types"

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = parseInt(params.id as string, 10)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // For auto-scrolling the hero carousel
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    async function fetchProject() {
      try {
        if (isNaN(projectId)) {
          throw new Error('Invalid project ID')
        }
        const response = await fetch(`/api/projects/${projectId}`)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Project not found')
          }
          throw new Error('Failed to fetch project')
        }
        const data = await response.json()
        setProject(data)
      } catch (error) {
        console.error('Error fetching project:', error)
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  useEffect(() => {
    if (!carouselApi) return
    // update selected index on init & on select
    const updateSelected = () => setSelectedIndex(carouselApi.selectedScrollSnap())
    updateSelected()
    carouselApi.on('select', updateSelected)

    const id = setInterval(() => {
      if (carouselApi?.canScrollNext()) {
        carouselApi.scrollNext()
      } else {
        carouselApi.scrollTo(0)
      }
    }, 5000) // 5-second interval
    return () => {
      clearInterval(id)
      carouselApi.off('select', updateSelected)
    }
  }, [carouselApi])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
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
          onClick={() => router.push("/")}
          className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - 2/3 width on desktop */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline">#{project.number}</Badge>
                <Badge className={(() => {
                  switch (project.phase.toLowerCase()) {
                    case 'fel0':
                      return 'bg-violet-500/10 text-violet-600 hover:bg-violet-500/20'
                    case 'fel2':
                      return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
                    case 'fel3':
                      return 'bg-cyan-500/10 text-cyan-600 hover:bg-cyan-500/20'
                    case 'pre-execution':
                      return 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                    case 'execution':
                      return 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                    case 'close-out':
                      return 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20'
                    default:
                      return 'bg-slate-500/10 text-slate-600 hover:bg-slate-500/20'
                  }
                })()}>{project.phase}</Badge>
              </div>
              <h1 className="text-3xl font-bold">{project.title}</h1>
            </div>
            <Button variant="outline" className="flex gap-2" onClick={() => router.push(`/projects/${projectId}/edit`)}>
              <Edit className="h-4 w-4" />
              Edit Project
            </Button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Narratives & Milestones</TabsTrigger>
              <TabsTrigger value="cost">Cost</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 pt-4">
              {/* Photo carousel hero */}
              {project.images && project.images.length > 0 && (
                <div className="relative">
                  <Carousel className="w-full" opts={{ loop: true }} setApi={setCarouselApi}>
                    <CarouselContent>
                      {project.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md border">
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Project image ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="!left-2 !top-1/2 !-translate-y-1/2" variant="ghost" />
                    <CarouselNext className="!right-2 !top-1/2 !-translate-y-1/2" variant="ghost" />
                  </Carousel>
                  {/* dot indicators */}
                  {project.images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                      {project.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => carouselApi?.scrollTo(i)}
                          className={`h-2 w-2 rounded-full transition-colors ${selectedIndex === i ? 'bg-white' : 'bg-white/50'}`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Project Description */}
              {project.narrative.general && (
                <Card>
                  <CardHeader>
                    <CardTitle>Project Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap">
                      {project.narrative.general}
                    </div>
                  </CardContent>
                </Card>
              )}

              <ProjectStatusPanel status={project.status} />

              <ProjectPhaseProgress percentages={project.phasePercentages} />

              {/* PM Reporting Table inside collapsible accordion at bottom */}
              <Accordion type="single" collapsible>
                <AccordionItem value="pm-reporting">
                  <AccordionTrigger>PM Reporting Tool Update</AccordionTrigger>
                  <AccordionContent>
                    <ProjectReportingTable reporting={project.pmReporting} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="details" className="space-y-8 pt-4">
              <ProjectNarratives narrative={project.narrative} showGeneral={false} />
              <ProjectMilestones milestones={project.milestones} />
            </TabsContent>

            <TabsContent value="cost" className="pt-4">
              <ProjectCostTracking costTracking={project.costTracking} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - 1/3 width on desktop */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Project Manager:</span>
                <span>{project.projectManager}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Report Month:</span>
                <span>{project.reportMonth}</span>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Plant:</span>
                <Badge variant="outline">{project.plant}</Badge>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">Disciplines:</span>
                {project.disciplines.map((d) => (
                  <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
