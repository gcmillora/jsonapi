"use client"

import Code from "./Code"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"

const codeBlock = `const res = await fetch(
    'https://jsonapi.gncmdev.workers.dev/api', 
    {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({message}),
  })`

export const CodeSection = () => {
    return <ScrollArea className="relative">
        <Code code={codeBlock} />
        <ScrollBar orientation="horizontal" />
    </ScrollArea>
}
