import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Normalize legacy project status values (e.g., from seed data) into
// the canonical set used throughout the UI so that selects don’t break.
export function normalizeProjectStatus(raw: any) {
  if (!raw || typeof raw !== "object") return raw ?? {}

  const normalize = (value: string | undefined, category: "safety" | "schedule" | "scopeQuality" | "cost") => {
    if (!value) return value as any
    switch (category) {
      case "safety":
        if (value === "Yes") return "On Track"
        if (value === "No") return "Off Track"
        break
      case "schedule":
        if (value === "At Risk") return "Monitor"
        break
      case "scopeQuality":
        if (value === "At Risk") return "Monitor"
        break
      case "cost":
        if (value === "Monitor") return "On Track"
        break
    }
    return value
  }

  return {
    ...raw,
    safety: normalize(raw.safety, "safety"),
    schedule: normalize(raw.schedule, "schedule"),
    scopeQuality: normalize(raw.scopeQuality, "scopeQuality"),
    cost: normalize(raw.cost, "cost"),
  }
}

export function normalizeProjectData<T extends { status?: any }>(project: T): T {
  return {
    ...project,
    status: normalizeProjectStatus(project.status),
  }
}
