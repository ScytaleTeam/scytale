"use client"
import { fetchNodes } from "@/lib/blockchain/scytaleContract"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import NodeCard from "./nodeCard"
import { Button } from "@/components/ui/button"

export default function NodeList({
  selectedNode,
  setSelectedNode,
}: {
  selectedNode?: string
  setSelectedNode?: (node: string) => void
}) {
  const provider = ethers.getDefaultProvider("https://scroll-public.scroll-testnet.quiknode.pro/")

  const [nodes, setNodes] = useState<string[]>([])

  useEffect(() => {
    try {
      fetchNodes(provider).then(nodes => {
        setNodes(nodes)
      })
    } catch (err) {
      console.log(err)
    }
  }, [])

  return (
    <>
      {nodes.map((node: string, i) => (
        <Button className="w-fit h-full p-2" variant="ghost" key={i}>
          <NodeCard address={node} id={i} />
        </Button>
      ))}
    </>
  )
}
