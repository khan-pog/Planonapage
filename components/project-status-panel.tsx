import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ProjectStatus } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ProjectStatusPanelProps {
  status: ProjectStatus
  editable?: boolean
}

export function ProjectStatusPanel({ status, editable = false }: ProjectStatusPanelProps) {
  const getStatusColor = (status: "On Track" | "Monitor" | "Over" | "Delayed" | "Yes" | "No" | "Not Applicable") => {
    switch (status) {
      case "On Track":
      case "Yes":
        return "bg-green-500"
      case "Monitor":
        return "bg-amber-500"
      case "Over":
      case "Delayed":
      case "No":
        return "bg-red-500"
      case "Not Applicable":
        return "bg-gray-300"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="safety-status">Safety</Label>
            {editable ? (
              <Select defaultValue={status.safety}>
                <SelectTrigger id="safety-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status.safety)}`} />
                <span>{status.safety}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="scope-quality-status">Scope/Quality</Label>
            {editable ? (
              <Select defaultValue={status.scopeQuality}>
                <SelectTrigger id="scope-quality-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On Track">On Track</SelectItem>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                  <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status.scopeQuality)}`} />
                <span>{status.scopeQuality}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost-status">Cost</Label>
            {editable ? (
              <Select defaultValue={status.cost}>
                <SelectTrigger id="cost-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On Track">On Track</SelectItem>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                  <SelectItem value="Over">Over</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status.cost)}`} />
                <span>{status.cost}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule-status">Schedule</Label>
            {editable ? (
              <Select defaultValue={status.schedule}>
                <SelectTrigger id="schedule-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On Track">On Track</SelectItem>
                  <SelectItem value="Monitor">Monitor</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status.schedule)}`} />
                <span>{status.schedule}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status-comments">Status Comments</Label>
          {editable ? (
            <Textarea
              id="status-comments"
              defaultValue={status.comments}
              placeholder="Add comments about the current status..."
              className="min-h-[100px]"
            />
          ) : (
            <div className="p-3 border rounded-md min-h-[100px] whitespace-pre-wrap">
              {status.comments || "No comments provided."}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cpm-rag-comment">CPM RAG Comment</Label>
          {editable ? (
            <Textarea
              id="cpm-rag-comment"
              defaultValue={status.cpmRagComment}
              placeholder="Add CPM RAG comments..."
              className="min-h-[100px]"
            />
          ) : (
            <div className="p-3 border rounded-md min-h-[100px] whitespace-pre-wrap">
              {status.cpmRagComment || "No CPM RAG comments provided."}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
