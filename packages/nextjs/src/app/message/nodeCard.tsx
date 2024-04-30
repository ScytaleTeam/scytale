"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Address } from "../../components/address"
import { useReadContract } from "wagmi"
import config from "../../../config"
import { ethers } from "ethers"

export default function NodeCard({ address, id }: { address: string; id: number }) {
  const { data: node, isFetched } = useReadContract({
    address: config.scytale.address,
    abi: config.scytale.abi,
    functionName: "storeNodes",
    args: [address],
  })

  return (
    <>
      {isFetched && (
        <Card>
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
          <CardContent>
            <div>{(node as any).messageRelayApi}</div>
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
          </CardContent>
        </Card>
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
