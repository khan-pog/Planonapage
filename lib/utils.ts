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

export function normalizeProjectData<T extends { status?: any, costTracking?: any, phasePercentages?: any }>(project: T): T {
  // Normalize costTracking costStatus as well
  let normalizedCostTracking = project.costTracking
  if (project.costTracking && project.costTracking.costStatus === "Monitor") {
    normalizedCostTracking = {
      ...project.costTracking,
      costStatus: "On Track",
    }
  }
  // Normalize monthlyData month format to YYYY-MM
  if (normalizedCostTracking && Array.isArray(normalizedCostTracking.monthlyData)) {
    const monthMap: Record<string, string> = {
      Jan: "01", January: "01",
      Feb: "02", February: "02",
      Mar: "03", March: "03",
      Apr: "04", April: "04",
      May: "05",
      Jun: "06", June: "06",
      Jul: "07", July: "07",
      Aug: "08", August: "08",
      Sep: "09", September: "09",
      Oct: "10", October: "10",
      Nov: "11", November: "11",
      Dec: "12", December: "12",
    }
    normalizedCostTracking = {
      ...normalizedCostTracking,
      monthlyData: normalizedCostTracking.monthlyData.map((m: any) => {
        if (m && typeof m.month === "string" && !/^\d{4}-\d{2}$/.test(m.month)) {
          const parts = m.month.split(/\s+/) // e.g., ["Jan", "2024"]
          if (parts.length === 2) {
            const abbr = parts[0]
            const year = parts[1]
            const mm = monthMap[abbr]
            if (mm) {
              return { ...m, month: `${year}-${mm}` }
            }
          }
        }
        return m
      }),
    }
  }

  // Normalize phasePercentages keys
  const legacyPhase = project.phasePercentages ?? {}
  const normalizedPhasePercentages: any = {
    fel0: legacyPhase.fel0 ?? legacyPhase.FEL0 ?? 0,
    fel2: legacyPhase.fel2 ?? legacyPhase.FEL2 ?? 0,
    fel3: legacyPhase.fel3 ?? legacyPhase.FEL3 ?? 0,
    preExecution: legacyPhase.preExecution ?? legacyPhase["Pre-Execution"] ?? 0,
    execution: legacyPhase.execution ?? legacyPhase.Execution ?? 0,
    closeOut: legacyPhase.closeOut ?? legacyPhase["Close-Out"] ?? 0,
  }

  return {
    ...project,
    status: normalizeProjectStatus(project.status),
    costTracking: normalizedCostTracking,
    phasePercentages: normalizedPhasePercentages,
  }
}
