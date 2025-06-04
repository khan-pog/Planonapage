"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"
import { toast } from "sonner"

export function SeedDatabaseButton() {
  const [isSeeding, setIsSeeding] = useState(false)

  const handleSeed = async () => {
    setIsSeeding(true)
    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      })
      
      if (!response.ok) {
        throw new Error("Failed to seed database")
      }
      
      toast.success("Database seeded successfully!")
    } catch (error) {
      console.error("Error seeding database:", error)
      toast.error("Failed to seed database")
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <Button
      onClick={handleSeed}
      disabled={isSeeding}
      className="flex items-center gap-2"
    >
      {isSeeding ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Seeding...
        </>
      ) : (
        <>
          <Database className="h-4 w-4" />
          Seed Database
        </>
      )}
    </Button>
  )
} 