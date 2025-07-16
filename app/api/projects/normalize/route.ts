import { NextResponse } from "next/server";
import { getAllProjects, updateProject } from "@/lib/db";
import { normalizeProjectData } from "@/lib/utils";

export async function POST() {
  try {
    const projects = await getAllProjects();
    let updated = 0;
    let unchanged = 0;

    for (const p of projects) {
      const normalized = normalizeProjectData(p as any);
      const changedPhase = JSON.stringify(normalized.phasePercentages) !== JSON.stringify(p.phasePercentages)
      const changedStatus = JSON.stringify(normalized.status) !== JSON.stringify(p.status)
      const changedCost = JSON.stringify(normalized.costTracking) !== JSON.stringify(p.costTracking)

      if (changedStatus || changedCost || changedPhase) {
        await updateProject(p.id, {
          ...(changedStatus ? { status: normalized.status } : {}),
          ...(changedCost ? { costTracking: normalized.costTracking } : {}),
          ...(changedPhase ? { phasePercentages: normalized.phasePercentages } : {}),
        });
        updated++;
      } else {
        unchanged++;
      }
    }
    return NextResponse.json({ updated, unchanged });
  } catch (err: any) {
    console.error("Normalization error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 