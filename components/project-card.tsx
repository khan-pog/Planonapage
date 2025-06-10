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
  const projectId = project.id || project._id

  const getPhaseBadgeColor = (phase: string) => {
    switch (phase.toLowerCase()) {
      case 'planning':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
      case 'in progress':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
      case 'completed':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
      case 'on hold':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
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
    <Link href={`/projects/${projectId}`}>
      <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          {project.images && project.images.length > 0 ? (
            <Image
              src={project.images[0]}
              alt={`${project.title} - Project Image`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority={false}
              quality={75}
              loading="lazy"
              onError={(e) => {
                // If image fails to load, show placeholder
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
                target.onerror = null; // Prevent infinite loop
              }}
            />
          ) : (
            <Image
              src="/placeholder.svg"
              alt="No project image available"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain p-4"
              priority={false}
              quality={75}
              loading="lazy"
            />
          )}
        </div>
        <CardContent className="p-4">
          <Badge className={cn("mb-2", getPhaseBadgeColor(project.phase))}>{project.phase}</Badge>
          <h3 className="text-lg font-semibold line-clamp-2">{project.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">#{project.number}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col items-start gap-2">
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
