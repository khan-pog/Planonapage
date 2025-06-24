"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { toast } from "sonner";

export function MigrateDatabaseButton() {
  const [isMigrating, setIsMigrating] = useState(false);

  const handleMigrate = async () => {
    setIsMigrating(true);
    try {
      const response = await fetch("/api/migrate", { method: "POST" });
      if (!response.ok) {
        throw new Error("Failed to migrate database");
      }
      toast.success("Database migrated successfully!");
    } catch (error) {
      console.error("Error migrating database:", error);
      toast.error("Failed to migrate database");
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Button onClick={handleMigrate} disabled={isMigrating} className="flex items-center gap-2">
      {isMigrating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Migrating...
        </>
      ) : (
        <>
          <Database className="h-4 w-4" />
          Migrate DB
        </>
      )}
    </Button>
  );
} 