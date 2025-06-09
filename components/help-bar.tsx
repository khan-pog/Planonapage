import { Phone, Mail } from "lucide-react"

export function HelpBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border py-2 px-4">
      <div className="container mx-auto flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <a href="tel:0431706003" className="flex items-center gap-2 hover:text-foreground transition-colors">
          <Phone className="h-4 w-4" />
          <span>0431 706 003</span>
        </a>
        <a href="mailto:khan.thompson@incitecpivot.com.au" className="flex items-center gap-2 hover:text-foreground transition-colors">
          <Mail className="h-4 w-4" />
          <span>khan.thompson@incitecpivot.com.au</span>
        </a>
      </div>
    </div>
  )
} 