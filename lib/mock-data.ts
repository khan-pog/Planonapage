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
  {
    id: "5",
    title: "HP Nitrogen Line Extension in Ammonia",
    number: "SPA24011",
    projectManager: "Michael Nguyen",
    reportMonth: "2024-04",
    phase: "Execution",
    status: {
      safety: "Yes",
      scopeQuality: "On Track",
      cost: "Monitor",
      schedule: "On Track",
      comments: "Execution progressing. All spool fabrication complete.",
      cpmRagComment: "Minor delays in insulation materials delivery"
    },
    phasePercentages: {
      FEL0: 100,
      FEL2: 100,
      FEL3: 100,
      "Pre-Execution": 100,
      Execution: 35,
      "Close-Out": 0
    },
    narrative: {
      general: "Extension of high pressure nitrogen utility line to support new ammonia unit.",
      achieved: "Piping isometric approval complete, 60% of spools delivered to site.",
      plannedNext: "Commence scaffold erection and hot-tap into live header during shutdown.",
      riskIssues: "Potential safety risk during live header tie-in. Mitigated via hot-work permit and standby firefighting crew."
    },
    milestones: [
      { stage: "IFC Issued", date: "2024-02-10", comment: "IFC revision B approved" },
      { stage: "Fabrication Complete", date: "2024-03-25", comment: "All spools dimensionally checked" }
    ],
    images: [],
    pmReporting: [
      { type: "PoAP Created", complete: true, date: "2024-01-15", signatory: "Michael Nguyen" },
      { type: "PoAP Report", complete: true, date: "2024-03-31", signatory: "Michael Nguyen" }
    ],
    costTracking: {
      totalBudget: 600000,
      currency: "AUD",
      monthlyData: [
        { month: "Jan 2024", budgetedCost: 80000, actualCost: 75000, cumulativeBudget: 80000, cumulativeActual: 75000, variance: -5000 },
        { month: "Feb 2024", budgetedCost: 100000, actualCost: 105000, cumulativeBudget: 180000, cumulativeActual: 180000, variance: 0 },
        { month: "Mar 2024", budgetedCost: 120000, actualCost: 118000, cumulativeBudget: 300000, cumulativeActual: 298000, variance: -2000 }
      ],
      costStatus: "Monitor",
      variance: -0.7,
      forecastCompletion: 590000
    },
    plant: "Ammonia & Laboratory",
    disciplines: ["Static", "HSE"]
  },
  {
    id: "6",
    title: "Water Quality Improvement",
    number: "SPA23006",
    projectManager: "Laura Chen",
    reportMonth: "2024-04",
    phase: "Pre-Execution",
    status: {
      safety: "Yes",
      scopeQuality: "On Track",
      cost: "On Track",
      schedule: "On Track",
      comments: "Detailed engineering finished, long-lead pumps ordered.",
      cpmRagComment: "Awaiting vendor drawings for review."
    },
    phasePercentages: {
      FEL0: 100,
      FEL2: 100,
      FEL3: 85,
      "Pre-Execution": 60,
      Execution: 0,
      "Close-Out": 0
    },
    narrative: {
      general: "Upgrade to site RO treatment train to improve boiler feed water quality.",
      achieved: "Completed HAZOP and FEL3 cost estimate.",
      plannedNext: "Release RFQ for installation contractor.",
      riskIssues: "Potential vendor manufacturing delay could impact schedule."
    },
    milestones: [
      { stage: "HAZOP Complete", date: "2024-03-10", comment: "No high risks identified." }
    ],
    images: [],
    pmReporting: [
      { type: "PoAP Created", complete: true, date: "2024-02-01", signatory: "Laura Chen" },
      { type: "PoAP Report", complete: true, date: "2024-03-29", signatory: "Laura Chen" }
    ],
    costTracking: {
      totalBudget: 950000,
      currency: "AUD",
      monthlyData: [
        { month: "Feb 2024", budgetedCost: 70000, actualCost: 68000, cumulativeBudget: 70000, cumulativeActual: 68000, variance: -2000 },
        { month: "Mar 2024", budgetedCost: 90000, actualCost: 91000, cumulativeBudget: 160000, cumulativeActual: 159000, variance: -1000 },
        { month: "Apr 2024", budgetedCost: 110000, actualCost: 105000, cumulativeBudget: 270000, cumulativeActual: 264000, variance: -6000 }
      ],
      costStatus: "On Track",
      variance: -0.6,
      forecastCompletion: 940000
    },
    plant: "Power & Utilities",
    disciplines: ["EIC", "Static"]
  },
  {
    id: "7",
    title: "Syngas Condenser HE3302 Replacement",
    number: "SPA25005",
    projectManager: "Antonio Rossi",
    reportMonth: "2024-04",
    phase: "Execution",
    status: {
      safety: "No",
      scopeQuality: "At Risk",
      cost: "Over Budget",
      schedule: "At Risk",
      comments: "Unexpected wall thinning found on adjacent piping; scope increased.",
      cpmRagComment: "Seeking additional funding approval."
    },
    phasePercentages: {
      FEL0: 100,
      FEL2: 100,
      FEL3: 100,
      "Pre-Execution": 100,
      Execution: 55,
      "Close-Out": 0
    },
    narrative: {
      general: "Replacement of shell-and-tube syngas condenser HE3302 to restore design duty.",
      achieved: "Old bundle removed; new condenser delivered to site.",
      plannedNext: "Install new unit during 10-day turnaround in May.",
      riskIssues: "Crane availability and weather conditions could impact lift."
    },
    milestones: [
      { stage: "Equipment Delivery", date: "2024-03-28", comment: "Arrived on schedule." }
    ],
    images: [],
    pmReporting: [
      { type: "PoAP Created", complete: true, date: "2024-01-20", signatory: "Antonio Rossi" },
      { type: "PoAP Report", complete: true, date: "2024-03-30", signatory: "Antonio Rossi" }
    ],
    costTracking: {
      totalBudget: 1800000,
      currency: "AUD",
      monthlyData: [
        { month: "Jan 2024", budgetedCost: 200000, actualCost: 220000, cumulativeBudget: 200000, cumulativeActual: 220000, variance: 20000 },
        { month: "Feb 2024", budgetedCost: 300000, actualCost: 320000, cumulativeBudget: 500000, cumulativeActual: 540000, variance: 40000 },
        { month: "Mar 2024", budgetedCost: 350000, actualCost: 400000, cumulativeBudget: 850000, cumulativeActual: 940000, variance: 90000 }
      ],
      costStatus: "Over Budget",
      variance: 10.6,
      forecastCompletion: 1990000
    },
    plant: "Granulation",
    disciplines: ["Static", "HSE"]
  },
  {
    id: "8",
    title: "Ammonia Plant Water Improvement - Deaerator",
    number: "SPA24001",
    projectManager: "Priya Kapoor",
    reportMonth: "2024-04",
    phase: "Execution",
    status: {
      safety: "Yes",
      scopeQuality: "On Track",
      cost: "On Track",
      schedule: "On Track",
      comments: "New deaerator skid installed, commissioning to start.",
      cpmRagComment: "Forecast handover in June."
    },
    phasePercentages: {
      FEL0: 100,
      FEL2: 100,
      FEL3: 100,
      "Pre-Execution": 100,
      Execution: 70,
      "Close-Out": 0
    },
    narrative: {
      general: "Replace undersized deaerator to improve boiler feed water quality in ammonia plant.",
      achieved: "Successfully lifted new vessel into position.",
      plannedNext: "Run performance tests and tie-ins.",
      riskIssues: "Steam demand fluctuation during start-up."
    },
    milestones: [
      { stage: "Skid Fabrication Complete", date: "2024-02-20", comment: "Supplier FAT passed." },
      { stage: "Installation Complete", date: "2024-04-05", comment: "Mechanical completion achieved." }
    ],
    images: [],
    pmReporting: [
      { type: "PoAP Created", complete: true, date: "2024-01-11", signatory: "Priya Kapoor" },
      { type: "PoAP Report", complete: true, date: "2024-03-28", signatory: "Priya Kapoor" }
    ],
    costTracking: {
      totalBudget: 1300000,
      currency: "AUD",
      monthlyData: [
        { month: "Jan 2024", budgetedCost: 150000, actualCost: 145000, cumulativeBudget: 150000, cumulativeActual: 145000, variance: -5000 },
        { month: "Feb 2024", budgetedCost: 200000, actualCost: 210000, cumulativeBudget: 350000, cumulativeActual: 355000, variance: 5000 },
        { month: "Mar 2024", budgetedCost: 220000, actualCost: 215000, cumulativeBudget: 570000, cumulativeActual: 570000, variance: 0 }
      ],
      costStatus: "On Track",
      variance: 0,
      forecastCompletion: 1300000
    },
    plant: "Ammonia & Laboratory",
    disciplines: ["Rotating", "Static"]
  },
  {
    id: "9",
    title: "Ammonia Cooler (Chiller) Replacement",
    number: "SPA23028",
    projectManager: "Daniel Lee",
    reportMonth: "2024-04",
    phase: "FEL3",
    status: {
      safety: "Yes",
      scopeQuality: "On Track",
      cost: "On Track",
      schedule: "At Risk",
      comments: "Chiller design clarified; vendor lead time 36 weeks.",
      cpmRagComment: "Schedule risk flagged."
    },
    phasePercentages: {
      FEL0: 100,
      FEL2: 100,
      FEL3: 60,
      "Pre-Execution": 0,
      Execution: 0,
      "Close-Out": 0
    },
    narrative: {
      general: "Replacement of obsolete reciprocating chiller with modern screw package improving reliability.",
      achieved: "Concept and FEED completed; vendor shortlisted.",
      plannedNext: "Issue purchase order.",
      riskIssues: "Lead time could extend project completion."
    },
    milestones: [
      { stage: "FEED Complete", date: "2024-03-18", comment: "Cost estimate ±15% produced." }
    ],
    images: [],
    pmReporting: [
      { type: "PoAP Created", complete: true, date: "2024-02-08", signatory: "Daniel Lee" },
      { type: "PoAP Report", complete: true, date: "2024-04-01", signatory: "Daniel Lee" }
    ],
    costTracking: {
      totalBudget: 2500000,
      currency: "AUD",
      monthlyData: [
        { month: "Feb 2024", budgetedCost: 60000, actualCost: 58000, cumulativeBudget: 60000, cumulativeActual: 58000, variance: -2000 },
        { month: "Mar 2024", budgetedCost: 80000, actualCost: 82000, cumulativeBudget: 140000, cumulativeActual: 140000, variance: 0 },
        { month: "Apr 2024", budgetedCost: 90000, actualCost: 89000, cumulativeBudget: 230000, cumulativeActual: 229000, variance: -1000 }
      ],
      costStatus: "On Track",
      variance: -0.4,
      forecastCompletion: 2490000
    },
    plant: "Ammonia & Laboratory",
    disciplines: ["Static", "EIC"]
  },
  {
    id: "10",
    title: "PSA Valve Upgrade",
    number: "SPA24013",
    projectManager: "Sarah Johnson",
    reportMonth: "2024-04",
    phase: "Execution",
    status: {
      safety: "No",
      scopeQuality: "On Track",
      cost: "On Track",
      schedule: "On Track",
      comments: "Vendor performing factory set pressure tests.",
      cpmRagComment: "Safety management high priority."
    },
    phasePercentages: {
      FEL0: 100,
      FEL2: 100,
      FEL3: 100,
      "Pre-Execution": 100,
      Execution: 25,
      "Close-Out": 0
    },
    narrative: {
      general: "Upgrade pressure swing adsorption unit block valves to high-integrity metal-seated design.",
      achieved: "Contract awarded; valve manufacturing commenced.",
      plannedNext: "Site installation planning during Q3 shutdown.",
      riskIssues: "Extended manufacturing could delay shutdown readiness."
    },
    milestones: [
      { stage: "Contract Award", date: "2024-03-05", comment: "PO released to ValvTech." }
    ],
    images: [],
    pmReporting: [
      { type: "PoAP Created", complete: true, date: "2024-02-12", signatory: "Sarah Johnson" },
      { type: "PoAP Report", complete: true, date: "2024-04-01", signatory: "Sarah Johnson" }
    ],
    costTracking: {
      totalBudget: 750000,
      currency: "AUD",
      monthlyData: [
        { month: "Feb 2024", budgetedCost: 50000, actualCost: 52000, cumulativeBudget: 50000, cumulativeActual: 52000, variance: 2000 },
        { month: "Mar 2024", budgetedCost: 60000, actualCost: 58000, cumulativeBudget: 110000, cumulativeActual: 110000, variance: 0 },
        { month: "Apr 2024", budgetedCost: 70000, actualCost: 69000, cumulativeBudget: 180000, cumulativeActual: 179000, variance: -1000 }
      ],
      costStatus: "On Track",
      variance: -0.6,
      forecastCompletion: 745000
    },
    plant: "Mineral Acid",
    disciplines: ["Rotating"]
  },
  {
    id: "11",
    title: "PSA PLC Upgrade",
    number: "SPA23027",
    projectManager: "Kevin Wright",
    reportMonth: "2024-04",
    phase: "Pre-Execution",
    status: {
      safety: "Yes",
      scopeQuality: "On Track",
      cost: "On Track",
      schedule: "On Track",
      comments: "PLC hardware selection complete.",
      cpmRagComment: "None"
    },
    phasePercentages: {
      FEL0: 100,
      FEL2: 90,
      FEL3: 0,
      "Pre-Execution": 0,
      Execution: 0,
      "Close-Out": 0
    },
    narrative: {
      general: "Replace obsolete PSA control PLC with modern redundant platform.",
      achieved: "Functional specification draft issued.",
      plannedNext: "Software development kick-off.",
      riskIssues: "Integration with existing SCADA may require downtime."
    },
    milestones: [
      { stage: "Functional Spec Draft", date: "2024-03-20", comment: "Under review by operations." }
    ],
    images: [],
    pmReporting: [
      { type: "PoAP Created", complete: true, date: "2024-02-20", signatory: "Kevin Wright" }
    ],
    costTracking: {
      totalBudget: 550000,
      currency: "AUD",
      monthlyData: [
        { month: "Feb 2024", budgetedCost: 30000, actualCost: 29000, cumulativeBudget: 30000, cumulativeActual: 29000, variance: -1000 },
        { month: "Mar 2024", budgetedCost: 45000, actualCost: 45000, cumulativeBudget: 75000, cumulativeActual: 74000, variance: -1000 },
        { month: "Apr 2024", budgetedCost: 50000, actualCost: 51000, cumulativeBudget: 125000, cumulativeActual: 125000, variance: 0 }
      ],
      costStatus: "On Track",
      variance: 0,
      forecastCompletion: 550000
    },
    plant: "Power & Utilities",
    disciplines: ["EIC"]
  },
  {
    id: "12",
    title: "Oil Fire Protection Upgrade",
    number: "SPA25001",
    projectManager: "Aisha Al-Farsi",
    reportMonth: "2024-04",
    phase: "Execution",
    status: {
      safety: "No",
      scopeQuality: "On Track",
      cost: "On Track",
      schedule: "On Track",
      comments: "Firewater pumps refurbishment commenced.",
      cpmRagComment: "Hot work permits tightly controlled."
    },
    phasePercentages: {
      FEL0: 100,
      FEL2: 100,
      FEL3: 100,
      "Pre-Execution": 100,
      Execution: 30,
      "Close-Out": 0
    },
    narrative: {
      general: "Upgrade of oil tank farm fire protection system including deluge nozzles and detection loops.",
      achieved: "Firewater ring main inspected and scoped for repairs.",
      plannedNext: "Install new deluge valve skids.",
      riskIssues: "Work in classified area requires strict safety measures."
    },
    milestones: [
      { stage: "Engineering Complete", date: "2024-02-28", comment: "Issued for construction." }
    ],
    images: [],
    pmReporting: [
      { type: "PoAP Created", complete: true, date: "2024-01-30", signatory: "Aisha Al-Farsi" },
      { type: "PoAP Report", complete: true, date: "2024-03-28", signatory: "Aisha Al-Farsi" }
    ],
    costTracking: {
      totalBudget: 1450000,
      currency: "AUD",
      monthlyData: [
        { month: "Jan 2024", budgetedCost: 120000, actualCost: 118000, cumulativeBudget: 120000, cumulativeActual: 118000, variance: -2000 },
        { month: "Feb 2024", budgetedCost: 150000, actualCost: 160000, cumulativeBudget: 270000, cumulativeActual: 278000, variance: 8000 },
        { month: "Mar 2024", budgetedCost: 160000, actualCost: 158000, cumulativeBudget: 430000, cumulativeActual: 436000, variance: 6000 }
      ],
      costStatus: "On Track",
      variance: 1.4,
      forecastCompletion: 1470000
    },
    plant: "Camp",
    disciplines: ["HSE", "Static"]
  },
  {
    id: "13",
    title: "FSM Compliance Stage 3",
    number: "SPA24008",
    projectManager: "Jacob Svensson",
    reportMonth: "2024-04",
    phase: "Execution",
    status: {
      safety: "Yes",
      scopeQuality: "On Track",
      cost: "Monitor",
      schedule: "On Track",
      comments: "Stage 3 packages awarded.",
      cpmRagComment: "Monitoring budget burn rate."
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
      general: "Finalize compliance upgrade to Fertilizer Safety Management code (Stage 3).",
      achieved: "Electrical risk assessment completed.",
      plannedNext: "Implement corrective actions for high priority findings.",
      riskIssues: "Contractor availability could impact progress."
    },
    milestones: [
      { stage: "Risk Assessment Complete", date: "2024-03-22", comment: "65 recommendations." }
    ],
    images: [],
    pmReporting: [
      { type: "PoAP Created", complete: true, date: "2024-03-01", signatory: "Jacob Svensson" }
    ],
    costTracking: {
      totalBudget: 850000,
      currency: "AUD",
      monthlyData: [
        { month: "Mar 2024", budgetedCost: 90000, actualCost: 95000, cumulativeBudget: 90000, cumulativeActual: 95000, variance: 5000 },
        { month: "Apr 2024", budgetedCost: 100000, actualCost: 99000, cumulativeBudget: 190000, cumulativeActual: 194000, variance: 4000 },
        { month: "May 2024", budgetedCost: 110000, actualCost: 108000, cumulativeBudget: 300000, cumulativeActual: 302000, variance: 2000 }
      ],
      costStatus: "Monitor",
      variance: 0.7,
      forecastCompletion: 856000
    },
    plant: "Granulation",
    disciplines: ["HSE", "EIC"]
  },
  {
    id: "14",
    title: "Blow Down Drum II PN3307 Replacement",
    number: "SPA25004",
    projectManager: "Olivia King",
    reportMonth: "2024-04",
    phase: "Close-Out",
    status: {
      safety: "Yes",
      scopeQuality: "On Track",
      cost: "Over Budget",
      schedule: "On Track",
      comments: "Mechanical completion achieved; preparing final dossier.",
      cpmRagComment: "Cost overrun due to additional insulation scope."
    },
    phasePercentages: {
      FEL0: 100,
      FEL2: 100,
      FEL3: 100,
      "Pre-Execution": 100,
      Execution: 100,
      "Close-Out": 80
    },
    narrative: {
      general: "Replace corroded blowdown drum PN3307 and associated internals to ensure reliable operation.",
      achieved: "Drum replacement completed and plant back online.",
      plannedNext: "Finalize documentation and close purchase orders.",
      riskIssues: "None."
    },
    milestones: [
      { stage: "Mechanical Completion", date: "2024-03-14", comment: "Pressure test passed." },
      { stage: "Start-Up", date: "2024-03-20", comment: "No leaks observed." }
    ],
    images: [],
    pmReporting: [
      { type: "PoAP Created", complete: true, date: "2024-01-25", signatory: "Olivia King" },
      { type: "Final Report", complete: false, date: "2024-04-10", signatory: "Olivia King" }
    ],
    costTracking: {
      totalBudget: 980000,
      currency: "AUD",
      monthlyData: [
        { month: "Jan 2024", budgetedCost: 120000, actualCost: 130000, cumulativeBudget: 120000, cumulativeActual: 130000, variance: 10000 },
        { month: "Feb 2024", budgetedCost: 150000, actualCost: 160000, cumulativeBudget: 270000, cumulativeActual: 290000, variance: 20000 },
        { month: "Mar 2024", budgetedCost: 190000, actualCost: 210000, cumulativeBudget: 460000, cumulativeActual: 500000, variance: 40000 }
      ],
      costStatus: "Over Budget",
      variance: 8.7,
      forecastCompletion: 1065000
    },
    plant: "Power & Utilities",
    disciplines: ["Static", "HSE"]
  },
]
