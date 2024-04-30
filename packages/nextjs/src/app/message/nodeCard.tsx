"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Address } from "../../components/address"
import { useReadContract } from "wagmi"
import config from "../../../config"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NodeCard({
  address,
  id,
  setSelectedNode,
  isSelected,
}: {
  address: string
  id: number
  setSelectedNode?: (node: { address: string; url: string; price: Number }) => void
  isSelected?: boolean
}) {
  const { data: node, isFetched } = useReadContract({
    address: config.scytale.address,
    abi: config.scytale.abi,
    functionName: "storeNodes",
    args: [address],
  })

  return (
    <>
      {isFetched && (
        <Button
          className={cn("group", isSelected ? "bg-gray-800" : "hover:bg-gray-800", "w-fit h-full p-2 -translate-x-3")}
          variant="ghost"
          onClick={() => {
            setSelectedNode && setSelectedNode({ address, url: (node as any)[1], price: (node as any)[3] })
          }}
        >
          <Card className="">
            <CardHeader className="">
              <CardTitle>
                <span className="flex justify-between">
                  <h4>Node {id}</h4>{" "}
                </span>
              </CardTitle>
              <CardDescription>
                <NodeAddress address={address} />
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <div className="text-white">
                <p className="text-white/50 w-52 overflow-hidden truncate">{String((node as any)[1])}</p>
              </div>
              <div className=" md:block hidden">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex gap-1">
                    Price:
                    <p className="text-white/50">{Number(ethers.utils.formatEther(String((node as any)[3])))} ETH</p>
                  </span>
                  <span className="flex gap-1">
                    Active Stores:
                    <p className="text-white/50">{Number((node as any)[2])}</p>
                  </span>
                </div>
              </div>
              <div className=" md:hidden block">
                <div className="flex flex-col items-center justify-between">
                  <span className="flex gap-1">
                    Price:
                    <p className="text-white/50">{Number(ethers.utils.formatEther(String((node as any)[3])))} ETH</p>
                  </span>
                  <span className="flex gap-1">
                    Active Stores:
                    <p className="text-white/50">{Number((node as any)[2])}</p>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Button>
      )}
    </>
  )
}

const NodeAddress = ({ address }: { address: string }) => {
  return (
    <div className="flex gap-1 items-center">
      <Address address={address} size="md" showQR />
    </div>
  )
}
