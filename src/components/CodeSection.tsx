"use client"

import Code from "./Code"
import { ScrollArea, ScrollBar } from "./ui/scroll-area"

const codeBlock = `const res = await fetch(
    'https://https://7304f531.jsonapi.pages.dev/api/json', 
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
