"use client"

import MessageBox from "./messageBox"
import PreviousMessages from "./previousMessages"

export default function Page() {
  return (
    <div className="mt-40 flex flex-col items-center justify-center gap-12">
      <PreviousMessages />
      <MessageBox />
    </div>
  )
}
