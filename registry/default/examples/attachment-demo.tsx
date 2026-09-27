import { FileTextIcon, ImageIcon, XIcon } from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/registry/default/ui/attachment"

const files = [
  { name: "q3-report.pdf", meta: "2.4 MB", state: "done", icon: FileTextIcon },
  { name: "moodboard.png", meta: "Uploading… 64%", state: "uploading", icon: ImageIcon },
  { name: "invoice-0142.pdf", meta: "File is larger than 10 MB", state: "error", icon: FileTextIcon },
] as const

export default function AttachmentDemo() {
  return (
    <AttachmentGroup className="max-w-md">
      {files.map((file) => (
        <Attachment key={file.name} state={file.state}>
          <AttachmentMedia>
            <file.icon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{file.name}</AttachmentTitle>
            <AttachmentDescription>{file.meta}</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label={`Remove ${file.name}`}>
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </AttachmentGroup>
  )
}
