"use client"

import { useState, useEffect, useRef } from "react"
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
import { matchesPlantAndDiscipline } from "@/lib/filter-utils"

const ITEMS_PER_PAGE = 12

export function ProjectGallery() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [phaseFilters, setPhaseFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("updatedAt")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // URL-based filters
  const [plantFilter, setPlantFilter] = useState<string | null>(null)
  const [disciplineFilters, setDisciplineFilters] = useState<string[] | null>(null)

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

    // Parse URL params on first render
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const plant = params.get("plant")
      const disciplinesParam = params.get("disciplines")
      const discArr = disciplinesParam
        ? disciplinesParam.split(",").map((d) => d.trim()).filter(Boolean)
        : null
      setPlantFilter(plant)
      setDisciplineFilters(discArr)
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

  // Filter projects based on search query, phase filter, and URL plant/discipline filters
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchQuery === "" ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.number.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPhase = phaseFilters.length === 0 || phaseFilters.includes(project.phase)

    const matchesPlantDiscipline = matchesPlantAndDiscipline(project, plantFilter, disciplineFilters)

    return matchesSearch && matchesPhase && matchesPlantDiscipline
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

  // Visible slice for infinite scroll
  const visibleProjects = sortedProjects.slice(0, visibleCount)

  // Intersection observer to load more
  useEffect(() => {
    if (!loadMoreRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          setVisibleCount((c) => Math.min(sortedProjects.length, c + ITEMS_PER_PAGE))
        }
      },
      {
        rootMargin: "200px",
      },
    )
    observer.observe(loadMoreRef.current)
    return () => {
      observer.disconnect()
    }
  }, [sortedProjects.length])

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
            <DropdownMenuCheckboxItem 
              checked={phaseFilters.length === 0} 
              onCheckedChange={() => setPhaseFilters([])}
            >
              All Phases
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={phaseFilters.includes("FEL0")}
              onCheckedChange={() => {
                if (phaseFilters.includes("FEL0")) {
                  setPhaseFilters(phaseFilters.filter(p => p !== "FEL0"))
                } else {
                  setPhaseFilters([...phaseFilters, "FEL0"])
                }
              }}
            >
              FEL0
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={phaseFilters.includes("FEL2")}
              onCheckedChange={() => {
                if (phaseFilters.includes("FEL2")) {
                  setPhaseFilters(phaseFilters.filter(p => p !== "FEL2"))
                } else {
                  setPhaseFilters([...phaseFilters, "FEL2"])
                }
              }}
            >
              FEL2
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={phaseFilters.includes("FEL3")}
              onCheckedChange={() => {
                if (phaseFilters.includes("FEL3")) {
                  setPhaseFilters(phaseFilters.filter(p => p !== "FEL3"))
                } else {
                  setPhaseFilters([...phaseFilters, "FEL3"])
                }
              }}
            >
              FEL3
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={phaseFilters.includes("Pre-Execution")}
              onCheckedChange={() => {
                if (phaseFilters.includes("Pre-Execution")) {
                  setPhaseFilters(phaseFilters.filter(p => p !== "Pre-Execution"))
                } else {
                  setPhaseFilters([...phaseFilters, "Pre-Execution"])
                }
              }}
            >
              Pre-Execution
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={phaseFilters.includes("Execution")}
              onCheckedChange={() => {
                if (phaseFilters.includes("Execution")) {
                  setPhaseFilters(phaseFilters.filter(p => p !== "Execution"))
                } else {
                  setPhaseFilters([...phaseFilters, "Execution"])
                }
              }}
            >
              Execution
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={phaseFilters.includes("Close-Out")}
              onCheckedChange={() => {
                if (phaseFilters.includes("Close-Out")) {
                  setPhaseFilters(phaseFilters.filter(p => p !== "Close-Out"))
                } else {
                  setPhaseFilters([...phaseFilters, "Close-Out"])
                }
              }}
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
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {sortedProjects.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
            </div>
          )}

          {/* Sentinel element for intersection observer */}
          {visibleCount < sortedProjects.length && (
            <div className="py-6 flex justify-center" ref={loadMoreRef}>
              <p className="text-sm text-muted-foreground">Loading more projects…</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
