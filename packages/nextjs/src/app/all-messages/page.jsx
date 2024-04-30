"use client"

import React from "react"


import { fetchPreviousMessages } from "@/lib/blockchain/scytaleContract"

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
import config from "../../../config";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { formatEther, parseEther } from 'viem'
import { DialogClose } from "@radix-ui/react-dialog";
import { ethers } from "ethers"
import { readContract } from "viem/actions"

import { useRouter } from "next/navigation"

const DEFAULT_STAKE = parseEther("0.1");

const AllMessages = () => {

  const router = useRouter();

  const provider = ethers.getDefaultProvider("https://scroll-public.scroll-testnet.quiknode.pro/")

  const account = useAccount()

  const [messages, setMessages] = useState([]);

  const { data: hash, isPending, isSuccess, error, writeContract } = useWriteContract()


  const fetchMessages = async () => {
    const newMessages = await fetchPreviousMessages(provider);
    const finalMsg = []
    for(let i = 0; i < newMessages.length; i++) {
      const msgHash = newMessages[i].args[1];
      const contract = new ethers.Contract(config.scytale.address, config.scytale.abi, provider)
      
      const result = await contract.messages(msgHash);
      finalMsg.push(result);
    }

    setMessages(finalMsg);
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  console.log("msg:", messages)

const handleChallenge = async (messageHash) => {
  await writeContract({
    address: config.scytale.address,
    abi: config.scytale.abi,
    functionName: "alertFreeRider",
    args: [messageHash],
  });
  router.push(`/challenge/${messageHash}`)
}

  return (
    <div className="container mx-auto justify-center items-center mt-20 px-4">
      <div className="text-xl font-bold text-white mt-8 ">All Messages</div>


    </div>
  )
}

export default AllMessages
