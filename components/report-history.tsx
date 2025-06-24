"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface HistoryRow {
  id: number;
  sentAt: string;
  recipients: number;
  failures: number;
  triggeredBy: "cron" | "manual" | "demo";
  testEmail?: string | null;
}

export default function ReportHistory({ pageSize = 20 }: { pageSize?: number }) {
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/report-history?pageSize=${pageSize}`);
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setHistory(data || []);
      } catch (err: any) {
        toast.error(err.message || "Error loading history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [pageSize]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report History</CardTitle>
        <CardDescription>Latest {pageSize} records</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading…</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No history yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">
                    {h.triggeredBy === "cron" ? "Scheduled" : h.triggeredBy === "manual" ? "Manual" : "Demo"} –
                    {" "}
                    {new Date(h.sentAt).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Sent to {h.recipients} recipients – failures {h.failures}
                  </div>
                </div>
                <Badge variant={h.failures === 0 ? "default" : "destructive"}>
                  {h.failures === 0 ? "Sent" : "Failed"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 