"use client"

import React from "react"
import TopCard from "../../node-fe/components/topcard"
import { Button } from "@/components/ui/button"
import MiddleCard from "../../node-fe/components/middlecard"


import { CopyIcon } from "@radix-ui/react-icons"
import { useToast } from "@/components/ui/use-toast"
import { QrCodeIcon } from "@heroicons/react/24/solid"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAccount, useWriteContract, useReadContract } from "wagmi"
import { useEffect, useState } from "react"
import config from "../../../../config";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { formatEther, parseEther } from 'viem'
import { DialogClose } from "@radix-ui/react-dialog";

const DEFAULT_STAKE = parseEther("0.1");

const NodePage = ({params}) => {

  const address = params.address;

  const { toast } = useToast()

  const { data: storeNode, isFetched: isFetchedNode, error: nodeErr } = useReadContract({
      address: config.scytale.address,
      abi: config.scytale.abi,
      functionName: "storeNodes",
      args: [address],
  })

  let nodeStake, apiUrl, activeMessages, price;
  if (storeNode) {
      nodeStake = storeNode[0]
      apiUrl = storeNode[1]
      activeMessages = storeNode[2]
      price = storeNode[3]
  }





  return (
    <div className="container mx-auto justify-center items-center mt-20 px-4">
      <div className="text-xl font-bold text-white mt-8 ">Node</div>

      <div className="mt-4 ">
        <span className=" font-medium">Address:</span>{" "}
        <span className=" text-sm text-gray-400">{address}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 lg:grid-cols-4 gap-4">
        <TopCard title="Revenue" amount={`${nodeStake ? formatEther(nodeStake - DEFAULT_STAKE) : 0} ETH`} />
        <TopCard title="Truth Score" amount={`${nodeStake ? Number(nodeStake/DEFAULT_STAKE) * 100 : 0}%`} />
        <TopCard title="RPC URL" amount={apiUrl ? apiUrl : ""} />
        <TopCard title="Status" amount="Online" />
      </div>
      <div className="mt-10 ">
        <span className=" font-medium">Node Settings</span>{" "}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 lg:grid-cols-3 gap-4">
        <MiddleCard title="Stake Balance" bottom=" Deposit">
          <div className=" mt-5 mb-5 font-bold text-center text-3xl text-white">{nodeStake ? formatEther(nodeStake) : 0} ETH</div>
          <div className="flex justify-center gap-8 mt-10 items-center ">
            {" "}
          </div>
        </MiddleCard>
        <MiddleCard title="Active messages" bottom=" ">
          <div className=" mt-5 mb-5 font-bold text-center text-3xl text-white"> {activeMessages?.toString()} </div>
          <div className="flex justify-center gap-8 mt-10 items-center ">
            {" "}
            <Button> Look all messages</Button>{" "}
          </div>
        </MiddleCard>
        <MiddleCard title="Current Price" bottom="">
          <div className=" mt-5 mb-5 font-bold text-center text-3xl text-white"> {price ? formatEther(price) : 0} ETH</div>
          <div className="flex justify-center gap-8 mt-10 items-center ">
            {" "}
          </div>
        </MiddleCard>
      </div>
    </div>
  )
}

export default NodePage
