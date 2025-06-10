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

const ITEMS_PER_PAGE = 12

export function ProjectGallery() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [phaseFilter, setPhaseFilter] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("updatedAt")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let ignore = false;
    async function fetchProjects() {
      setLoading(true);
      try {
        const response = await fetch("/api/projects", { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data = await response.json();
        if (!ignore) setProjects(data);
      } catch (err) {
        if (!ignore) setError("Failed to load projects");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchProjects();
    // Listen for refresh-projects event
    const handler = () => {
      setLoading(true);
      fetchProjects();
    };
    window.addEventListener("refresh-projects", handler);
    return () => {
      ignore = true;
      window.removeEventListener("refresh-projects", handler);
    };
  }, []);

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

  // Paginate projects
  const totalPages = Math.ceil(sortedProjects.length / ITEMS_PER_PAGE)
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

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

      {loading ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Loading projects...</h3>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-destructive">Error loading projects</h3>
          <p className="text-muted-foreground mt-1">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {sortedProjects.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
