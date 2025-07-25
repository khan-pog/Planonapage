"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, Pencil, Send } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"

interface Recipient {
  id?: number
  email: string
  plants: string[] | null
  disciplines: string[] | null
  isPm?: boolean
  projectIds?: number[] | null
  isCapitalManager?: boolean;
}

interface RecipientsManagerProps {
  pmOnly?: boolean;
  capitalOnly?: boolean;
}

const plantOptions = [
  "Granulation",
  "Mineral Acid",
  "Ammonia & Laboratory",
  "Camp",
  "Power & Utilities",
]

const disciplineOptions = ["HSE", "Rotating", "Static", "EIC"]

export default function RecipientsManager({ pmOnly, capitalOnly }: RecipientsManagerProps = {}) {
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null)
  const [email, setEmail] = useState("")
  const [plants, setPlants] = useState<string[]>([])
  const [disciplines, setDisciplines] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [isPm] = useState(pmOnly)
  const [projectIds, setProjectIds] = useState<number[]>([])
  const [projectsOptions, setProjectsOptions] = useState<{id:number,title:string}[]>([])
  const [toDelete, setToDelete] = useState<number | null>(null)

  useEffect(() => {
    fetchRecipients()
  }, [])

  useEffect(()=>{
    if(pmOnly){
      fetch('/api/projects')
        .then((res)=>res.json())
        .then((data:any[])=>setProjectsOptions(data.map((p)=>({id:p.id,title:p.title}))))
      .catch(()=>{})
    }
  },[pmOnly])

  const fetchRecipients = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/recipients")
      if (!res.ok) throw new Error("Failed to fetch recipients")
      const data: Recipient[] = await res.json()
      const list: Recipient[] = data || []
      if(pmOnly !== undefined){
        setRecipients(list.filter((rec)=>!!rec.isPm === pmOnly))
      } else if(capitalOnly !== undefined){
        setRecipients(list.filter((rec)=>!!rec.isCapitalManager === capitalOnly))
      } else {
        setRecipients(list.filter((rec)=>!rec.isPm && !rec.isCapitalManager))
      }
    } catch (err: any) {
      toast.error(`Failed to load recipients: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditingRecipient(null)
    setEmail("")
    setPlants([])
    setDisciplines([])
    setProjectIds([])
    setDialogOpen(true)
  }

  const openEdit = (r: Recipient) => {
    setEditingRecipient(r)
    setEmail(r.email)
    setPlants(r.plants || [])
    setDisciplines(r.disciplines || [])
    setProjectIds(r.projectIds || [])
    setDialogOpen(true)
  }

  const toggleArrayValue = (
    value: string,
    current: string[],
    setter: (val: string[]) => void,
  ) => {
    if (current.includes(value)) {
      setter(current.filter((v) => v !== value))
    } else {
      setter([...current, value])
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      let payload: any;
      if(pmOnly){
        payload = { email, isPm:true, projectIds };
        if(projectIds.length===0){ toast.error('Select at least one project'); return; }
      } else if(capitalOnly){
        payload = { email, isCapitalManager:true };
      } else {
        payload = { email, plants, disciplines };
      }
      let res: Response
      if (editingRecipient) {
        res = await fetch(`/api/recipients/${editingRecipient.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch("/api/recipients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }
      if (!res.ok) throw new Error(await res.text())
      toast.success(`Recipient ${editingRecipient ? "updated" : "added"}`)
      setDialogOpen(false)
      fetchRecipients()
    } catch (err: any) {
      toast.error(err.message || "Error saving recipient")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    try {
      const res = await fetch(`/api/recipients/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete recipient")
      toast.success("Recipient deleted")
      fetchRecipients()
    } catch (err: any) {
      toast.error(err.message || "Error deleting recipient")
    }
  }

  const sendGroupDemo = async () => {
    try {
      const res = await fetch('/api/reports/send?testEmail=khan.thompson@incitecpivot.com.au');
      if(!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      toast.success(`Demo email sent! (sent: ${data.sent}, failed: ${data.failed})`);
    } catch(err:any){
      toast.error(err.message || 'Failed to send demo');
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Email Recipients</CardTitle>
          <CardDescription>Manage who receives automated reports</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button onClick={openAdd} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Recipient
          </Button>
          {(!pmOnly && !capitalOnly) && (
            <Button onClick={sendGroupDemo} variant="outline" className="flex items-center gap-2">
              <Send className="h-4 w-4" /> Send Demo Email
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading recipients...</p>
        ) : recipients.length === 0 ? (
          <p className="text-muted-foreground text-sm">No recipients found.</p>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 px-2">Email</th>
                  {(!pmOnly && !capitalOnly) && <th className="py-2 px-2">Plants</th>}
                  {(!pmOnly && !capitalOnly) && <th className="py-2 px-2">Disciplines</th>}
                  <th className="py-2 px-2">Projects</th>
                  <th className="py-2 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recipients.map((r: Recipient) => (
                  <tr key={r.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-2 whitespace-nowrap">{r.email}</td>
                    {(!pmOnly && !capitalOnly) && (
                      <>
                        <td className="py-2 px-2">{(r.plants || []).join(", ")}</td>
                        <td className="py-2 px-2">{(r.disciplines || []).join(", ")}</td>
                      </>
                    )}
                    <td className="py-2 px-2">
                      { (r.projectIds ?? []).map((id:number)=> projectsOptions.find(p=>p.id===id)?.title).join(', ')}
                    </td>
                    <td className="py-2 px-2 text-right space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEdit(r)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700" onClick={()=>setToDelete(r.id!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete recipient?</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={()=>{ if(toDelete) handleDelete(toDelete); setToDelete(null); }}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRecipient ? "Edit Recipient" : "Add Recipient"}
            </DialogTitle>
            <DialogDescription>
              {editingRecipient
                ? "Update the recipient details."
                : "Enter details for the new recipient."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email-input">
                Email Address
              </label>
              <Input
                id="email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
              />
            </div>

            {pmOnly ? (
              <div>
                <p className="text-sm font-medium mb-1">Projects</p>
                <ScrollArea className="h-40 pr-2">
                  <div className="space-y-1">
                    {projectsOptions.map((p:{id:number,title:string}) => (
                      <label key={p.id} className="flex items-center space-x-2">
                        <Checkbox checked={projectIds.includes(p.id)} onCheckedChange={()=>{
                          setProjectIds(projectIds.includes(p.id)? projectIds.filter(id=>id!==p.id): [...projectIds,p.id])
                        }} />
                        <span className="text-sm">{p.title}</span>
                      </label>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : capitalOnly ? null : (
              <div>
                <p className="text-sm font-medium mb-1">Plants</p>
                <div className="grid grid-cols-2 gap-2">
                  {plantOptions.map((plant) => (
                    <label key={plant} className="flex items-center space-x-2">
                      <Checkbox
                        checked={plants.includes(plant)}
                        onCheckedChange={() =>
                          toggleArrayValue(plant, plants, setPlants)
                        }
                      />
                      <span className="text-sm">{plant}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {!pmOnly && !capitalOnly && (
            <div>
              <p className="text-sm font-medium mb-1">Disciplines</p>
              <div className="grid grid-cols-2 gap-2">
                {disciplineOptions.map((d) => (
                  <label key={d} className="flex items-center space-x-2">
                    <Checkbox
                      checked={disciplines.includes(d)}
                      onCheckedChange={() =>
                        toggleArrayValue(d, disciplines, setDisciplines)
                      }
                    />
                    <span className="text-sm">{d}</span>
                  </label>
                ))}
              </div>
            </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleSave} disabled={saving || email === ""}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
} 