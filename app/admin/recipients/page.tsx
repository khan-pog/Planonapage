"use client";

import RecipientsManager from "@/components/recipients-manager";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminRecipientsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Gallery
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mt-4">Email Recipients</h1>
          <p className="text-muted-foreground mt-1 max-w-prose">
            Manage who receives automated project cost reports. Use the form below to add, edit, or remove
            recipients and define which plants or disciplines they belong to.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>How it works</CardTitle>
          <CardDescription>
            • Each recipient can be linked to multiple plants and/or disciplines.<br />
            • Reports will be sent to a recipient if any of their selected classifications match the project.<br />
            • Leave both lists empty to treat the recipient as "global" (receives all reports).
          </CardDescription>
        </CardHeader>
      </Card>

      <RecipientsManager />
    </div>
  );
} 