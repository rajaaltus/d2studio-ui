"use client"

import { Bubble, BubbleContent } from "@/registry/default/ui/bubble"
import { Message, MessageContent } from "@/registry/default/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/registry/default/ui/message-scroller"

const lines = [
  "Morning! Did the build go green overnight?",
  "It did. Two flaky tests, both retried fine.",
  "Nice. Let's tag the release after lunch.",
  "Works for me. Changelog is drafted.",
  "I'll add the migration note to it.",
  "Perfect. Anything blocking QA?",
  "Only the staging seed, running it now.",
  "Seed is done, QA can start.",
]

export default function MessageScrollerDemo() {
  return (
    <div className="h-80 w-full max-w-md rounded-xl border">
      <MessageScrollerProvider>
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent className="gap-3 p-4">
              {lines.map((line, i) => (
                <MessageScrollerItem key={i} messageId={String(i)}>
                  <Message align={i % 2 ? "end" : "start"}>
                    <MessageContent>
                      <Bubble align={i % 2 ? "end" : "start"} variant={i % 2 ? "default" : "muted"}>
                        <BubbleContent>{line}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
    </div>
  )
}
