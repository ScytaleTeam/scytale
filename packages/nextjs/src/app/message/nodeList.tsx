"use client"
import { fetchNodes } from "@/lib/blockchain/scytaleContract"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import NodeCard from "./nodeCard"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NodeList({
  selectedNode,
  setSelectedNode,
}: {
  selectedNode?: { address: string; url: string; price: Number }
  setSelectedNode?: (node: { address: string; url: string; price: Number }) => void
}) {
  const provider = ethers.getDefaultProvider("https://scroll-public.scroll-testnet.quiknode.pro/")

  const [nodes, setNodes] = useState<string[]>([])

  useEffect(() => {
    try {
      fetchNodes(provider).then(nodes => {
        setNodes(nodes && nodes)
      })
    } catch (err) {
      console.log(err)
    }
  }, [])

  return (
    <>
      {nodes.map((node: string, i) => (
        <NodeCard
          key={i}
          address={node}
          id={i}
          setSelectedNode={setSelectedNode}
          isSelected={selectedNode && selectedNode.address === node}
        />
      ))}
    </>
  )
}
