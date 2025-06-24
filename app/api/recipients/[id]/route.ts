import { NextResponse } from "next/server";
import { updateRecipient, deleteRecipient } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new NextResponse("Invalid recipient ID", { status: 400 });
    }

    const data = await request.json();
    const { createdAt, updatedAt, id: _ignored, ...updateData } = data;

    const updatedRecipient = await updateRecipient(id, updateData);
    if (!updatedRecipient) {
      return new NextResponse("Recipient not found", { status: 404 });
    }

    return NextResponse.json(updatedRecipient);
  } catch (error) {
    console.error("Error updating recipient:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return new NextResponse("Invalid recipient ID", { status: 400 });
    }

    const deletedRecipient = await deleteRecipient(id);
    if (!deletedRecipient) {
      return new NextResponse("Recipient not found", { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting recipient:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 