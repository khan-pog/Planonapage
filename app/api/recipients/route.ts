import { NextResponse } from "next/server";
import { getAllRecipients, createRecipient } from "@/lib/db";

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
    // Ensure createdAt / updatedAt are not manually set from the client
    const { createdAt, updatedAt, id, ...insertData } = data;
    const newRecipient = await createRecipient(insertData);
    return NextResponse.json(newRecipient);
  } catch (error) {
    console.error("Error creating recipient:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 