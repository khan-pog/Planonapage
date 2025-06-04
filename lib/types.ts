export interface Project {
  id: number
  title: string
  number: string
  projectManager: string
  reportMonth: string
  phase: "FEL0" | "FEL2" | "FEL3" | "Pre-Execution" | "Execution" | "Close-Out"
  status: ProjectStatus
  pmReporting: PMReportingItem[]
  phasePercentages: PhasePercentages
  narrative: ProjectNarrative
  milestones: ProjectMilestone[]
  images: string[]
  ownerId: string
  updatedAt: string
  createdAt: string
}

export interface ProjectStatus {
  safety: "Yes" | "No" | "Monitor"
  scopeQuality: "On Track" | "Monitor" | "Not Applicable"
  cost: "On Track" | "Monitor" | "Over"
  schedule: "On Track" | "Monitor" | "Delayed"
  comments: string
  cpmRagComment: string
}

export interface PMReportingItem {
  type: string
  complete: boolean
  date: string
  signatory: string
}

export interface PhasePercentages {
  fel0: number
  fel2: number
  fel3: number
  preExecution: number
  execution: number
  closeOut: number
}

export interface ProjectNarrative {
  general: string
  achieved: string
  plannedNext: string
  riskIssues: string
}

export interface ProjectMilestone {
  stage: string
  date: string
  comment: string
}
