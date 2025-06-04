"use client"

import { useState, useEffect } from "react"
import { Search, SlidersHorizontal } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProjectCard } from "@/components/project-card"
import type { Project } from "@/lib/types"

export function ProjectGallery() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [phaseFilter, setPhaseFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("updatedAt")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects")
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Filter projects based on search query and phase filter
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.number.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPhase = phaseFilter === null || project.phase === phaseFilter

    return matchesSearch && matchesPhase
  })

  // Sort projects based on sort option
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "phase") {
      return a.phase.localeCompare(b.phase)
    } else {
      // Default sort by updatedAt (most recent first)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem checked={phaseFilter === null} onCheckedChange={() => setPhaseFilter(null)}>
                All Phases
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={phaseFilter === "FEL0"}
                onCheckedChange={() => setPhaseFilter(phaseFilter === "FEL0" ? null : "FEL0")}
              >
                FEL0
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={phaseFilter === "FEL2"}
                onCheckedChange={() => setPhaseFilter(phaseFilter === "FEL2" ? null : "FEL2")}
              >
                FEL2
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={phaseFilter === "FEL3"}
                onCheckedChange={() => setPhaseFilter(phaseFilter === "FEL3" ? null : "FEL3")}
              >
                FEL3
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={phaseFilter === "Pre-Execution"}
                onCheckedChange={() => setPhaseFilter(phaseFilter === "Pre-Execution" ? null : "Pre-Execution")}
              >
                Pre-Execution
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={phaseFilter === "Execution"}
                onCheckedChange={() => setPhaseFilter(phaseFilter === "Execution" ? null : "Execution")}
              >
                Execution
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={phaseFilter === "Close-Out"}
                onCheckedChange={() => setPhaseFilter(phaseFilter === "Close-Out" ? null : "Close-Out")}
              >
                Close-Out
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt">Last Updated</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="phase">Phase</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Loading projects...</h3>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {sortedProjects.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
