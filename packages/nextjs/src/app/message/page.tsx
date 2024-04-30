"use client"

import { Button } from "@/components/ui/button"
import { PaperAirplaneIcon } from "@heroicons/react/24/outline"
import MessageBox from "./messageBox"
import NodeList from "./nodeList"

import { Suspense } from "react"

export default function Page() {
  return (
    <div className="mt-20 flex flex-col items-center justify-center gap-12">
      <MessageBox />
      <NodeList />
    </div>
  )
}
