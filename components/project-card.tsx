import Link from "next/link"
import Image from "next/image"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  // Function to determine phase badge color
  const getPhaseBadgeColor = (phase: string) => {
    switch (phase) {
      case "FEL0":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case "FEL2":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "FEL3":
        return "bg-cyan-100 text-cyan-800 hover:bg-cyan-100"
      case "Pre-Execution":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "Execution":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "Close-Out":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Function to determine status indicator color
  const getStatusColor = (status: "On Track" | "Monitor" | "Over" | "Delayed" | "Yes" | "No" | "Not Applicable") => {
    switch (status) {
      case "On Track":
      case "Yes":
        return "bg-green-500"
      case "Monitor":
        return "bg-amber-500"
      case "Over":
      case "Delayed":
      case "No":
        return "bg-red-500"
      case "Not Applicable":
        return "bg-gray-300"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {project.images && project.images.length > 0 ? (
            <Image src={project.images[0] || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <Badge className={cn("mb-2", getPhaseBadgeColor(project.phase))}>{project.phase}</Badge>
          <h3 className="text-lg font-semibold line-clamp-2">{project.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">#{project.number}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Safety</span>
                <div className={cn("w-3 h-3 rounded-full", getStatusColor(project.status.safety))} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Schedule</span>
                <div className={cn("w-3 h-3 rounded-full", getStatusColor(project.status.schedule))} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Cost</span>
                <div className={cn("w-3 h-3 rounded-full", getStatusColor(project.status.cost))} />
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">{new Date(project.updatedAt).toLocaleDateString()}</div>
        </CardFooter>
      </Card>
    </Link>
  )
}
