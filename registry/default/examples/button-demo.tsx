import { ArrowUpIcon, ArrowRightIcon } from "lucide-react"

import { Button } from "@/registry/default/ui/button"

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUpIcon />
      </Button>
      <Button variant="outline" aria-label="Submit">
        Outline
        <ArrowRightIcon />
      </Button>
      <Button variant="link">Link</Button>
       <Button variant="ghost">Ghost</Button>
    </div>
  )
}
