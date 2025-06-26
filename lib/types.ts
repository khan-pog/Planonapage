export interface Project {
  id: string
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
  costTracking: CostTracking
  plant: 'Granulation' | 'Mineral Acid' | 'Ammonia & Laboratory' | 'Camp' | 'Power & Utilities'
  disciplines: ('HSE' | 'Rotating' | 'Static' | 'EIC')[]
  updatedAt: string
  ownerId: string
}

export interface ProjectStatus {
  safety: "On Track" | "Monitor" | "Off Track"
  scopeQuality: "On Track" | "Monitor" | "Not Applicable"
  cost: "On Track" | "Over Budget" | "Under Budget"
  schedule: "On Track" | "Monitor" | "Delayed"
  comments: string
  cpmRagComment: string
}

export interface PMReportingItem {
  type: "PoAP Created" | "PoAP Report" | "Final Report" | "Budget Review" | "Schedule" | "Forecast" | "Execution Readiness"
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

export interface CostTracking {
  totalBudget: number
  currency: string
  monthlyData: MonthlyCostData[]
  costStatus: "Under Budget" | "On Track" | "Over Budget"
  variance: number // percentage variance from budget
  forecastCompletion: number
}

export interface MonthlyCostData {
  month: string
  budgetedCost: number
  actualCost: number
  cumulativeBudget: number
  cumulativeActual: number
  variance: number
}
