import { NextResponse } from "next/server";
import { getAllRecipients, createRecipient, db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const recipients = await getAllRecipients();
    return NextResponse.json(recipients, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching recipients:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { createdAt, updatedAt, id, projectId, ...incoming } = data;

    if(projectId !== undefined){
      // normalise to array
      incoming.projectIds = [...((incoming.projectIds as number[]) ?? []), projectId];
    }

    // Check if recipient exists by email (unique key)
    const existing = await db
      .select()
      .from(schema.emailRecipients)
      .where(eq(schema.emailRecipients.email, incoming.email));

    if (existing.length === 0) {
      const newRec = await createRecipient({ ...incoming });
      return NextResponse.json(newRec);
    }

    const current = existing[0];

    // Merge arrays (plants, disciplines, projectIds) without duplicates
    const mergedPlants = Array.from(
      new Set([...(current.plants ?? []), ...((incoming.plants as string[]) ?? [])]),
    );
    const mergedDisc = Array.from(
      new Set([
        ...(current.disciplines ?? []),
        ...((incoming.disciplines as string[]) ?? []),
      ]),
    );
    const mergedProjects = Array.from(
      new Set([
        ...(current.projectIds ?? []),
        ...((incoming.projectIds as number[]) ?? []),
      ]),
    );

    const updated = await db
      .update(schema.emailRecipients)
      .set({
        plants: mergedPlants.length ? mergedPlants : null,
        disciplines: mergedDisc.length ? mergedDisc : null,
        projectIds: mergedProjects.length ? mergedProjects : null,
        isPm: incoming.isPm ?? current.isPm,
        updatedAt: new Date(),
      })
      .where(eq(schema.emailRecipients.id, current.id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error upserting recipient:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 