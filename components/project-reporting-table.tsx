import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import type { PMReportingItem } from "@/lib/types"

interface ProjectReportingTableProps {
  reporting: PMReportingItem[]
  editable?: boolean
}

export function ProjectReportingTable({ reporting, editable = false }: ProjectReportingTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PM Reporting Tool Update</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[100px]">Complete</TableHead>
              <TableHead className="w-[150px]">Date</TableHead>
              <TableHead>Comment/Signatory</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reporting.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell>
                  {editable ? (
                    <Checkbox checked={item.complete} />
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center">
                      {item.complete ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : null}
                    </div>
                  )}
                </TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.signatory}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
