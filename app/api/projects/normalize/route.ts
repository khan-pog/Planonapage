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
      // Only update if status changed
      if (JSON.stringify(normalized.status) !== JSON.stringify(p.status)) {
        await updateProject(p.id, { status: normalized.status });
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