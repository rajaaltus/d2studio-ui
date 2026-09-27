import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/registry/default/ui/bubble"

export default function BubbleDemo() {
  return (
    <BubbleGroup className="w-full max-w-sm">
      <Bubble variant="muted">
        <BubbleContent>Is the new pricing page ready for review?</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Yes, pushed it an hour ago. Preview link is in the thread.</BubbleContent>
      </Bubble>
      <Bubble variant="muted" className="mb-3">
        <BubbleContent>Looks great, shipping it.</BubbleContent>
        <BubbleReactions>🎉</BubbleReactions>
      </Bubble>
    </BubbleGroup>
  )
}
