import { Avatar, AvatarFallback } from "@/registry/default/ui/avatar"
import { Bubble, BubbleContent } from "@/registry/default/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/registry/default/ui/message"

export default function MessageDemo() {
  return (
    <MessageGroup className="w-full max-w-md gap-6">
      <Message>
        <MessageAvatar>
          <Avatar>
            <AvatarFallback>MR</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Maya Reyes</MessageHeader>
          <Bubble variant="muted">
            <BubbleContent>Can you send over the onboarding copy before standup?</BubbleContent>
          </Bubble>
          <MessageFooter>9:41 AM</MessageFooter>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>On it. Draft is in the doc, two open questions at the top.</BubbleContent>
          </Bubble>
          <MessageFooter>Read 9:43 AM</MessageFooter>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}
