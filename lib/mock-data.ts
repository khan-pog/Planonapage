export const mockProjects = [
  {
    id: "1",
    title: "Project Alpha",
    number: "PRJ-001",
    projectManager: "Alice Smith",
    reportMonth: "2024-03",
    phase: "Execution",
    status: {
      safety: "Yes",
      scopeQuality: "On Track",
      cost: "On Track",
      schedule: "On Track",
      comments: "Project progressing well",
      cpmRagComment: "All metrics green"
    },
    phasePercentages: {
      FEL0: 100,
      FEL2: 100,
      FEL3: 100,
      "Pre-Execution": 100,
      Execution: 45,
      "Close-Out": 0
    },
    narrative: {
      general: "Major infrastructure upgrade project",
      achieved: "Completed site preparation and initial setup",
      plannedNext: "Begin main construction phase",
      riskIssues: "No major risks identified"
    },
    milestones: [
      {
        stage: "Site Preparation",
        date: "2024-02-15",
        comment: "Completed ahead of schedule"
      }
    ],
    images: [],
    pmReporting: [
      {
        type: "PoAP Created",
        complete: true,
        date: "2024-02-28",
        signatory: "Alice Smith",
      },
      {
        type: "PoAP Report",
        complete: true,
        date: "2024-03-01",
        signatory: "Alice Smith",
      },
      {
        type: "PoAP Report",
        complete: true,
        date: "2024-03-20",
        signatory: "Alice Smith",
      },
      {
        type: "PoAP Report",
        complete: true,
        date: "2024-03-24",
        signatory: "Alice Smith",
      },
    ],
    costTracking: {
      totalBudget: 2500000,
      currency: "AUD",
      monthlyData: [
        {
          month: "Jan 2024",
          budgetedCost: 200000,
          actualCost: 185000,
          cumulativeBudget: 200000,
          cumulativeActual: 185000,
          variance: -15000
        },
        {
          month: "Feb 2024",
          budgetedCost: 250000,
          actualCost: 275000,
          cumulativeBudget: 450000,
          cumulativeActual: 460000,
          variance: 25000
        },
        {
          month: "Mar 2024",
          budgetedCost: 300000,
          actualCost: 290000,
          cumulativeBudget: 750000,
          cumulativeActual: 750000,
          variance: -10000
        }
      ],
      costStatus: "On Track",
      variance: 2.5,
      forecastCompletion: 2450000
    },
    plant: "Granulation",
    disciplines: ["HSE", "Static"]
  },
  {
    id: "2",
    title: "Project Beta",
    number: "PRJ-002",
    projectManager: "Charlie Brown",
    reportMonth: "2024-03",
    phase: "Pre-Execution",
    status: {
      safety: "Yes",
      scopeQuality: "On Track",
      cost: "On Track",
      schedule: "On Track",
      comments: "Planning phase complete",
      cpmRagComment: "Ready for execution"
    },
    phasePercentages: {
      FEL0: 100,
      FEL2: 100,
      FEL3: 100,
      "Pre-Execution": 90,
      Execution: 0,
      "Close-Out": 0
    },
    narrative: {
      general: "Sustainable energy initiative",
      achieved: "Completed all planning phases",
      plannedNext: "Begin execution phase",
      riskIssues: "Supply chain delays possible"
    },
    milestones: [
      {
        stage: "Planning Complete",
        date: "2024-03-01",
        comment: "All approvals received"
      }
    ],
    images: [],
    pmReporting: [
      {
        type: "PoAP Created",
        complete: true,
        date: "2024-02-25",
        signatory: "Charlie Brown",
      },
      {
        type: "PoAP Report",
        complete: true,
        date: "2024-03-01",
        signatory: "Charlie Brown",
      },
      {
        type: "PoAP Report",
        complete: true,
        date: "2024-03-20",
        signatory: "Charlie Brown",
      },
      {
        type: "PoAP Report",
        complete: true,
        date: "2024-03-24",
        signatory: "Charlie Brown",
      },
    ],
    costTracking: {
      totalBudget: 2500000,
      currency: "AUD",
      monthlyData: [
        {
          month: "Jan 2024",
          budgetedCost: 200000,
          actualCost: 175000,
          cumulativeBudget: 200000,
          cumulativeActual: 175000,
          variance: -25000
        },
        {
          month: "Feb 2024",
          budgetedCost: 250000,
          actualCost: 225000,
          cumulativeBudget: 450000,
          cumulativeActual: 400000,
          variance: -25000
        },
        {
          month: "Mar 2024",
          budgetedCost: 300000,
          actualCost: 280000,
          cumulativeBudget: 750000,
          cumulativeActual: 680000,
          variance: -20000
        }
      ],
      costStatus: "Under Budget",
      variance: -3.0,
      forecastCompletion: 2300000
    },
    plant: "Mineral Acid",
    disciplines: ["EIC", "Static"]
  },
  {
    id: "3",
    title: "Project Gamma",
    number: "PRJ-003",
    projectManager: "Eve Davis",
    reportMonth: "2024-03",
    phase: "Close-Out",
    status: {
      safety: "Yes",
      scopeQuality: "On Track",
      cost: "Monitor",
      schedule: "On Track",
      comments: "Project completed successfully with minor cost variance",
      cpmRagComment: "Monitoring final costs"
    },
    phasePercentages: {
      FEL0: 100,
      FEL2: 100,
      FEL3: 100,
      "Pre-Execution": 100,
      Execution: 100,
      "Close-Out": 85
    },
    narrative: {
      general: "Creating an innovative platform for global communication",
      achieved: "Successfully delivered all major deliverables",
      plannedNext: "Final documentation and project closure",
      riskIssues: "Minor budget overrun due to additional requirements"
    },
    milestones: [
      {
        stage: "Platform Launch",
        date: "2024-02-15",
        comment: "Successfully launched to production"
      },
      {
        stage: "User Training",
        date: "2024-02-28",
        comment: "All users trained and onboarded"
      }
    ],
    images: [],
    pmReporting: [
      {
        type: "PoAP Created",
        complete: true,
        date: "2024-01-10",
        signatory: "Eve Davis",
      },
      {
        type: "PoAP Report",
        complete: true,
        date: "2024-02-20",
        signatory: "Eve Davis",
      },
      {
        type: "PoAP Report",
        complete: true,
        date: "2024-03-01",
        signatory: "Eve Davis",
      },
      {
        type: "Final Report",
        complete: false,
        date: "2024-03-15",
        signatory: "Eve Davis",
      },
    ],
    costTracking: {
      totalBudget: 2500000,
      currency: "AUD",
      monthlyData: [
        {
          month: "Jan 2024",
          budgetedCost: 200000,
          actualCost: 210000,
          cumulativeBudget: 200000,
          cumulativeActual: 210000,
          variance: 10000,
        },
        {
          month: "Feb 2024",
          budgetedCost: 250000,
          actualCost: 260000,
          cumulativeBudget: 450000,
          cumulativeActual: 470000,
          variance: 10000,
        },
        {
          month: "Mar 2024",
          budgetedCost: 300000,
          actualCost: 310000,
          cumulativeBudget: 750000,
          cumulativeActual: 780000,
          variance: 10000,
        },
      ],
      costStatus: "Monitor",
      variance: 5.0,
      forecastCompletion: 2600000,
    },
    plant: "Ammonia & Laboratory",
    disciplines: ["Rotating"]
  },
  {
    id: "4",
    title: "Project Delta",
    number: "PRJ-004",
    projectManager: "Grace Green",
    reportMonth: "2024-03",
    phase: "FEL3",
    status: {
      safety: "Yes",
      scopeQuality: "On Track",
      cost: "Over Budget",
      schedule: "At Risk",
      comments: "Project on hold due to budget constraints and scope changes",
      cpmRagComment: "Requires management attention"
    },
    phasePercentages: {
      FEL0: 100,
      FEL2: 100,
      FEL3: 75,
      "Pre-Execution": 0,
      Execution: 0,
      "Close-Out": 0
    },
    narrative: {
      general: "Researching and developing advanced AI algorithms",
      achieved: "Completed initial research phase and prototype development",
      plannedNext: "Pending budget approval for next phase",
      riskIssues: "Significant budget overrun and scope creep identified"
    },
    milestones: [
      {
        stage: "Research Phase",
        date: "2024-01-31",
        comment: "Completed with valuable insights"
      },
      {
        stage: "Prototype Development",
        date: "2024-02-29",
        comment: "Initial prototype delivered"
      }
    ],
    images: [],
    pmReporting: [
      {
        type: "PoAP Created",
        complete: true,
        date: "2024-02-15",
        signatory: "Grace Green",
      },
      {
        type: "PoAP Report",
        complete: true,
        date: "2024-02-28",
        signatory: "Grace Green",
      },
      {
        type: "PoAP Report",
        complete: true,
        date: "2024-03-01",
        signatory: "Grace Green",
      },
      {
        type: "Budget Review",
        complete: true,
        date: "2024-03-05",
        signatory: "Grace Green",
      },
    ],
    costTracking: {
      totalBudget: 2500000,
      currency: "AUD",
      monthlyData: [
        {
          month: "Jan 2024",
          budgetedCost: 200000,
          actualCost: 220000,
          cumulativeBudget: 200000,
          cumulativeActual: 220000,
          variance: 20000,
        },
        {
          month: "Feb 2024",
          budgetedCost: 250000,
          actualCost: 280000,
          cumulativeBudget: 450000,
          cumulativeActual: 500000,
          variance: 30000,
        },
        {
          month: "Mar 2024",
          budgetedCost: 300000,
          actualCost: 340000,
          cumulativeBudget: 750000,
          cumulativeActual: 840000,
          variance: 40000,
        },
      ],
      costStatus: "Over Budget",
      variance: 7.5,
      forecastCompletion: 2700000,
    },
    plant: "Camp",
    disciplines: ["Rotating", "Static", "HSE"]
  },
]
