import type { Project } from "@/lib/types"

export const mockProjects: Project[] = [
  {
    id: "project-1",
    title: "Power Station Gas Turbine No.5 Replacement",
    number: "SPU23007",
    projectManager: "Jane Smith",
    reportMonth: "2023-05",
    phase: "Execution",
    status: {
      safety: "Yes",
      scopeQuality: "On Track",
      cost: "Monitor",
      schedule: "On Track",
      comments:
        "Project is progressing well with minor cost concerns due to material price increases. Safety protocols are being strictly followed with no incidents reported.",
      cpmRagComment:
        "Monitoring cost variances closely. May need additional budget approval if material costs continue to rise.",
    },
    pmReporting: [
      { type: "PoAP Report", complete: true, date: "2023-05-15", signatory: "Jane Smith" },
      { type: "Schedule", complete: true, date: "2023-05-10", signatory: "John Doe" },
      { type: "Forecast", complete: true, date: "2023-05-12", signatory: "Jane Smith" },
      { type: "Execution Readiness", complete: false, date: "", signatory: "" },
    ],
    phasePercentages: {
      fel0: 100,
      fel2: 100,
      fel3: 100,
      preExecution: 100,
      execution: 65,
      closeOut: 0,
    },
    narrative: {
      general:
        "The Gibson Bay Power Station Upgrade project aims to increase capacity by 25% while improving efficiency and reducing emissions. The project involves replacing outdated turbines, upgrading control systems, and implementing new safety measures.",
      achieved:
        "This month, we completed the installation of two new turbines ahead of schedule. The control system upgrade is 75% complete with successful initial testing. Safety training for all personnel was completed with 100% attendance.",
      plannedNext:
        "Next month, we will finalize the control system upgrade and begin comprehensive testing. The old turbines will be decommissioned and removed from the site. We will also begin preparations for the emissions reduction component of the project.",
      riskIssues:
        "Material costs have increased by 8% since project approval, putting pressure on the budget. We are exploring alternative suppliers and bulk purchase options to mitigate this risk. There is also a potential delay in specialized equipment delivery that we are monitoring closely.",
    },
    milestones: [
      { stage: "Project Approval", date: "2023-01-15", comment: "Approved with full funding" },
      { stage: "Engineering Complete", date: "2023-03-20", comment: "All designs finalized and approved" },
      { stage: "Turbine Installation", date: "2023-05-10", comment: "Completed ahead of schedule" },
      { stage: "Control System Upgrade", date: "2023-06-15", comment: "In progress" },
      { stage: "Commissioning", date: "2023-08-01", comment: "Pending" },
    ],
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2f40050b-f82a-4ae7-8f2f-9fa9d817ed3e.jpg-R21g7iAHrIFJyvBllv8sQ2bVa4ZIht.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e7713866-8ead-4577-a9ab-47c5ef0cd337.jpg-Bpo8ORLzXIZ9T1j7Ckze2ria7WcGuq.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/130bb623-929f-4083-ada1-4c0e6993b0b5.jpg-m0SvPiceNBjIlEnRqZBC82eIVQZcKH.jpeg",
    ],
    updatedAt: "2023-05-20T14:30:00Z",
    ownerId: "user-123",
  },
  {
    id: "project-2",
    title: "Permanent Power Supply for Acid Storage",
    number: "SPP23020",
    projectManager: "Michael Johnson",
    reportMonth: "2023-05",
    phase: "FEL3",
    status: {
      safety: "Yes",
      scopeQuality: "On Track",
      cost: "On Track",
      schedule: "Monitor",
      comments:
        "Project is in detailed engineering phase. Some concerns about schedule due to permitting delays, but overall the project is progressing well.",
      cpmRagComment: "Need to accelerate permitting process. Meeting scheduled with regulatory authorities next week.",
    },
    pmReporting: [
      { type: "PoAP Report", complete: true, date: "2023-05-14", signatory: "Michael Johnson" },
      { type: "Schedule", complete: true, date: "2023-05-12", signatory: "Sarah Williams" },
      { type: "Forecast", complete: true, date: "2023-05-13", signatory: "Michael Johnson" },
      { type: "Execution Readiness", complete: false, date: "", signatory: "" },
    ],
    phasePercentages: {
      fel0: 100,
      fel2: 100,
      fel3: 75,
      preExecution: 0,
      execution: 0,
      closeOut: 0,
    },
    narrative: {
      general:
        "The Riverside Chemical Plant Expansion project will increase production capacity by 40% and introduce a new product line. The expansion includes new reaction vessels, storage facilities, and automated packaging systems.",
      achieved:
        "This month, we completed 90% of the detailed engineering designs and received preliminary approval from environmental regulators. Vendor selection for major equipment is complete with purchase orders issued for long-lead items.",
      plannedNext:
        "Next month, we will finalize all engineering designs and submit for final regulatory approval. We will also begin site preparation work and finalize the construction contract with the selected EPC contractor.",
      riskIssues:
        "There is a potential delay in the permitting process that could impact the project schedule. We are actively engaging with regulatory authorities to address their concerns and expedite approvals. There is also a risk related to soil conditions that may require additional foundation work.",
    },
    milestones: [
      { stage: "Concept Approval", date: "2023-02-10", comment: "Approved by executive committee" },
      { stage: "Basic Engineering", date: "2023-04-05", comment: "Completed on schedule" },
      { stage: "Detailed Engineering", date: "2023-06-20", comment: "In progress" },
      { stage: "Permitting", date: "2023-07-15", comment: "At risk - monitoring closely" },
      { stage: "Construction Start", date: "2023-08-10", comment: "Pending" },
    ],
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/42be01d6-8e7b-4d24-b0cb-88eeeab63a1a.jpg-b6gbLMNKTn98YSnGJbIrq0QEdLB9Jy.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d2ef1594-8ee9-4eae-8c43-fae088cbb9a4.jpg-KWbZcVtaEZ84o6p0v0qI23ybWMUTcT.jpeg",
    ],
    updatedAt: "2023-05-18T09:45:00Z",
    ownerId: "user-456",
  },
  {
    id: "project-3",
    title: "Site UPS Upgrade - Stage 1",
    number: "SPF23004",
    projectManager: "Robert Chen",
    reportMonth: "2023-05",
    phase: "FEL2",
    status: {
      safety: "Yes",
      scopeQuality: "Monitor",
      cost: "On Track",
      schedule: "On Track",
      comments:
        "Project scope is being reviewed to ensure alignment with updated business requirements. Some additional features may be added to the automation system.",
      cpmRagComment: "Scope changes need to be finalized by end of month to avoid impact on schedule and budget.",
    },
    pmReporting: [
      { type: "PoAP Report", complete: true, date: "2023-05-16", signatory: "Robert Chen" },
      { type: "Schedule", complete: true, date: "2023-05-15", signatory: "Emily Davis" },
      { type: "Forecast", complete: false, date: "", signatory: "" },
      { type: "Execution Readiness", complete: false, date: "", signatory: "" },
    ],
    phasePercentages: {
      fel0: 100,
      fel2: 60,
      fel3: 0,
      preExecution: 0,
      execution: 0,
      closeOut: 0,
    },
    narrative: {
      general:
        "The Northfield Distribution Center Automation project will implement advanced robotics and AI-driven inventory management systems to improve efficiency and reduce operating costs. The project includes conveyor systems, automated storage and retrieval systems, and integrated warehouse management software.",
      achieved:
        "This month, we completed the conceptual design of the automation system and received proposals from three qualified vendors. We also conducted a site assessment to identify potential installation challenges.",
      plannedNext:
        "Next month, we will select the automation vendor and begin detailed design work. We will also develop the implementation phasing plan to minimize disruption to ongoing operations during installation.",
      riskIssues:
        "There are concerns about integration with existing legacy systems that may require additional development work. The business has also requested consideration of additional features that were not in the original scope, which could impact budget and timeline.",
    },
    milestones: [
      { stage: "Business Case Approval", date: "2023-03-05", comment: "Approved with ROI of 22%" },
      { stage: "Vendor RFP", date: "2023-04-20", comment: "Completed with three qualified responses" },
      { stage: "Vendor Selection", date: "2023-06-10", comment: "Pending" },
      { stage: "Detailed Design", date: "2023-07-30", comment: "Not started" },
      { stage: "Implementation Start", date: "2023-09-15", comment: "Not started" },
    ],
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ee6cb1db-812e-489e-a6eb-b0e96c34d2cd.jpg-whrQUMq3sfd6WUrs2LVqs4LEw5dFlU.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8257ea3c-57f7-4d47-9263-f0bc16ac18ee.jpg-Q0SlgLV7kNtlkIAAE8E6OsDUXMJN01.jpeg",
    ],
    updatedAt: "2023-05-16T16:20:00Z",
    ownerId: "user-789",
  },
  {
    id: "project-4",
    title: "Touch Potential Compliance - Stage 2",
    number: "SPA22004",
    projectManager: "Amanda Lee",
    reportMonth: "2023-05",
    phase: "Close-Out",
    status: {
      safety: "Yes",
      scopeQuality: "On Track",
      cost: "On Track",
      schedule: "On Track",
      comments:
        "Project is in final close-out phase with all deliverables completed successfully. Documentation and handover to operations is in progress.",
      cpmRagComment:
        "Excellent execution throughout the project lifecycle. Team to document lessons learned for future safety projects.",
    },
    pmReporting: [
      { type: "PoAP Report", complete: true, date: "2023-05-10", signatory: "Amanda Lee" },
      { type: "Schedule", complete: true, date: "2023-05-08", signatory: "Thomas Wilson" },
      { type: "Forecast", complete: true, date: "2023-05-09", signatory: "Amanda Lee" },
      { type: "Execution Readiness", complete: true, date: "2023-02-15", signatory: "Amanda Lee" },
    ],
    phasePercentages: {
      fel0: 100,
      fel2: 100,
      fel3: 100,
      preExecution: 100,
      execution: 100,
      closeOut: 90,
    },
    narrative: {
      general:
        "The Westlake Safety Compliance Upgrade project was initiated to bring the facility into compliance with updated safety regulations and industry best practices. The project included installation of new fire suppression systems, emergency response equipment, and safety monitoring devices throughout the facility.",
      achieved:
        "This month, we completed the final safety audit with zero non-conformances. All documentation has been finalized and training materials have been handed over to the operations team. The project has been formally accepted by operations.",
      plannedNext:
        "Next month, we will conduct the final project review meeting and document lessons learned. All financial reconciliation will be completed and the project will be officially closed in the system.",
      riskIssues:
        "No significant risks or issues remain. All safety systems are functioning as designed and have been fully commissioned.",
    },
    milestones: [
      { stage: "Project Initiation", date: "2022-10-05", comment: "Approved as high priority" },
      { stage: "Design Complete", date: "2022-12-10", comment: "Approved by safety committee" },
      { stage: "Installation Complete", date: "2023-03-15", comment: "Completed on schedule" },
      { stage: "Testing & Commissioning", date: "2023-04-20", comment: "Passed all tests" },
      { stage: "Handover to Operations", date: "2023-05-05", comment: "Accepted with no punch list items" },
    ],
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9338bda5-bf65-463c-9ffd-52f3937fd66d.jpg-6fBTwPQZx9Rk1LoVRnAy758bsUmZEi.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/130bb623-929f-4083-ada1-4c0e6993b0b5%20%281%29.jpg-1MNWPxIWoyrEapApOjgFFRjnw26UhH.jpeg",
    ],
    updatedAt: "2023-05-12T11:15:00Z",
    ownerId: "user-101",
  },
  {
    id: "project-5",
    title: "Anti Surge Controller - MAC & N2 (SPA21084)",
    number: "SPA22012",
    projectManager: "David Park",
    reportMonth: "2023-05",
    phase: "Pre-Execution",
    status: {
      safety: "Yes",
      scopeQuality: "On Track",
      cost: "On Track",
      schedule: "Monitor",
      comments:
        "Project is transitioning from planning to execution phase. Some schedule concerns due to resource availability, but mitigation plans are in place.",
      cpmRagComment: "Need to confirm resource commitments from IT department to avoid schedule delays.",
    },
    pmReporting: [
      { type: "PoAP Report", complete: true, date: "2023-05-17", signatory: "David Park" },
      { type: "Schedule", complete: true, date: "2023-05-16", signatory: "Lisa Johnson" },
      { type: "Forecast", complete: true, date: "2023-05-15", signatory: "David Park" },
      { type: "Execution Readiness", complete: true, date: "2023-05-10", signatory: "David Park" },
    ],
    phasePercentages: {
      fel0: 100,
      fel2: 100,
      fel3: 100,
      preExecution: 85,
      execution: 0,
      closeOut: 0,
    },
    narrative: {
      general:
        "The Eastern Region Supply Chain Optimization project will implement new logistics software, warehouse reorganization, and process improvements to reduce lead times and inventory costs. The project covers five distribution centers across the eastern region.",
      achieved:
        "This month, we completed the detailed implementation plan and finalized the software configuration. User acceptance testing was completed with minor issues identified and resolved. Training materials have been developed and approved.",
      plannedNext:
        "Next month, we will begin the phased implementation starting with the Atlanta distribution center. The training program will be delivered to all staff, and we will establish the performance monitoring dashboard to track benefits realization.",
      riskIssues:
        "There is a risk related to IT resource availability during the implementation phase. We are working with the IT department to secure dedicated resources. There is also a concern about potential disruption to operations during the transition, which we are addressing through careful phasing and contingency planning.",
    },
    milestones: [
      { stage: "Project Approval", date: "2023-02-20", comment: "Approved with full funding" },
      { stage: "Software Selection", date: "2023-03-25", comment: "Selected LogiTech Pro platform" },
      { stage: "Implementation Planning", date: "2023-05-15", comment: "Completed with stakeholder approval" },
      { stage: "Atlanta Implementation", date: "2023-06-10", comment: "Scheduled" },
      { stage: "Full Deployment", date: "2023-08-30", comment: "Planned" },
    ],
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bace26ba-bf2b-465d-abd9-d736e40f8c52.jpg-nYkK0l5zmjm8N9aJPZPkCr5gs0OfgP.jpeg",
    ],
    updatedAt: "2023-05-17T14:45:00Z",
    ownerId: "user-202",
  },
  {
    id: "project-6",
    title: "NG Pressure Reduction Skid Spare Valves",
    number: "SPU23009",
    projectManager: "Rachel Green",
    reportMonth: "2023-05",
    phase: "FEL0",
    status: {
      safety: "Yes",
      scopeQuality: "Monitor",
      cost: "Monitor",
      schedule: "On Track",
      comments:
        "Project is in early concept phase with some uncertainty around scope and cost. Environmental requirements are still being clarified with regulatory authorities.",
      cpmRagComment: "Need to engage environmental consultants to better define requirements and cost implications.",
    },
    pmReporting: [
      { type: "PoAP Report", complete: false, date: "", signatory: "" },
      { type: "Schedule", complete: true, date: "2023-05-05", signatory: "Rachel Green" },
      { type: "Forecast", complete: false, date: "", signatory: "" },
      { type: "Execution Readiness", complete: false, date: "", signatory: "" },
    ],
    phasePercentages: {
      fel0: 40,
      fel2: 0,
      fel3: 0,
      preExecution: 0,
      execution: 0,
      closeOut: 0,
    },
    narrative: {
      general:
        "The Southport Environmental Compliance Project aims to upgrade the facility's emissions control systems to meet new regulatory requirements that will come into effect in 2024. The project includes installation of new scrubbers, monitoring equipment, and process modifications to reduce environmental impact.",
      achieved:
        "This month, we completed the initial assessment of current emissions and identified the key areas requiring upgrades. We also had preliminary discussions with three potential technology providers and received budgetary quotes.",
      plannedNext:
        "Next month, we will engage environmental consultants to conduct a detailed gap analysis and develop specific recommendations. We will also begin developing the business case with preliminary cost estimates and implementation timelines.",
      riskIssues:
        "There is significant uncertainty around the final regulatory requirements, which could impact project scope and cost. Technology selection is also challenging as we need to balance compliance, cost, and operational impact. Early engagement with regulators will be critical to project success.",
    },
    milestones: [
      { stage: "Initial Assessment", date: "2023-05-20", comment: "Completed" },
      { stage: "Gap Analysis", date: "2023-06-30", comment: "Planned" },
      { stage: "Business Case Approval", date: "2023-08-15", comment: "Target date" },
      { stage: "Detailed Engineering", date: "2023-10-30", comment: "Planned" },
      { stage: "Implementation", date: "2024-02-15", comment: "Target completion before new regulations" },
    ],
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/130bb623-929f-4083-ada1-4c0e6993b0b5.jpg-m0SvPiceNBjIlEnRqZBC82eIVQZcKH.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e7713866-8ead-4577-a9ab-47c5ef0cd337.jpg-Bpo8ORLzXIZ9T1j7Ckze2ria7WcGuq.jpeg",
    ],
    updatedAt: "2023-05-20T10:30:00Z",
    ownerId: "user-303",
  },
  {
    id: "project-7",
    title: "Partial Discharge (PD) Testing Instrument",
    number: "SPU23010",
    projectManager: "Rachel Green",
    reportMonth: "2023-05",
    phase: "FEL0",
    status: {
      safety: "Yes",
      scopeQuality: "Monitor",
      cost: "Monitor",
      schedule: "On Track",
      comments: "Project is in early concept phase with some uncertainty around scope and cost.",
      cpmRagComment: "Need to engage consultants to better define requirements and cost implications.",
    },
    pmReporting: [
      { type: "PoAP Report", complete: false, date: "", signatory: "" },
      { type: "Schedule", complete: true, date: "2023-05-05", signatory: "Rachel Green" },
      { type: "Forecast", complete: false, date: "", signatory: "" },
      { type: "Execution Readiness", complete: false, date: "", signatory: "" },
    ],
    phasePercentages: {
      fel0: 40,
      fel2: 0,
      fel3: 0,
      preExecution: 0,
      execution: 0,
      closeOut: 0,
    },
    narrative: {
      general: "The project aims to procure and implement a Partial Discharge (PD) Testing Instrument.",
      achieved: "This month, we completed the initial assessment of current testing capabilities.",
      plannedNext:
        "Next month, we will engage consultants to conduct a detailed gap analysis and develop specific recommendations. We will also begin developing the business case with preliminary cost estimates and implementation timelines.",
      riskIssues:
        "There is significant uncertainty around the final testing requirements, which could impact project scope and cost.",
    },
    milestones: [
      { stage: "Initial Assessment", date: "2023-05-20", comment: "Completed" },
      { stage: "Gap Analysis", date: "2023-06-30", comment: "Planned" },
      { stage: "Business Case Approval", date: "2023-08-15", comment: "Target date" },
      { stage: "Detailed Engineering", date: "2023-10-30", comment: "Planned" },
      { stage: "Implementation", date: "2024-02-15", comment: "Target completion" },
    ],
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d2ef1594-8ee9-4eae-8c43-fae088cbb9a4.jpg-KWbZcVtaEZ84o6p0v0qI23ybWMUTcT.jpeg",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/42be01d6-8e7b-4d24-b0cb-88eeeab63a1a.jpg-b6gbLMNKTn98YSnGJbIrq0QEdLB9Jy.jpeg",
    ],
    updatedAt: "2023-05-20T10:30:00Z",
    ownerId: "user-303",
  },
]
