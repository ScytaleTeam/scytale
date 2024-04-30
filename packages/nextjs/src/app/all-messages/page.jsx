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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const DEFAULT_STAKE = parseEther("0.1");

const AllMessages = () => {

  const router = useRouter();

  const provider = ethers.getDefaultProvider("https://scroll-public.scroll-testnet.quiknode.pro/")

  const account = useAccount()

  const [messages, setMessages] = useState([]);
  const [lastRequestId, setLastRequestId] = useState();

  const { data: lastRequest, isFetched: isFetchedNode, error: nodeErr } = useReadContract({
    address: config.alertVerifier.address,
    abi: config.alertVerifier.abi,
    functionName: "requests",
    args: [lastRequestId],
})

console.log(lastRequestId);
console.log(nodeErr);
console.log(lastRequest)
  const { data: hash, isPending, isSuccess, error, writeContract } = useWriteContract()
console.error(error)

  const fetchMessages = async () => {
    const newMessages = await fetchPreviousMessages(provider);
    const finalMsg = []
    for (let i = 0; i < newMessages.length; i++) {
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
    console.log(messageHash)
    await writeContract({
      address: config.scytale.address,
      abi: config.scytale.abi,
      functionName: "alertFreeRider",
      args: [messageHash],
      value: parseEther("0.01")
    });
    const contract = new ethers.Contract(config.alertVerifier.address, config.alertVerifier.abi, provider)
    contract.on("VerificationTask", async (verifier, id) => {
      setLastRequestId(id);
    })
  }

  const handleEndRequest = async (lastRequestId) => {
    await writeContract({
      address: config.alertVerifier.address,
      abi: config.alertVerifier.abi,
      functionName: "endRequest",
      args: [lastRequestId],
    });
  }

  return (
    <div className="flex mt-20 justify-center items-center">
      <Card className="w-[550px] overflow-y-auto">
        <CardHeader>
          <CardTitle  >Active Messages</CardTitle>
        </CardHeader>
        <CardContent>

          <div className="grid w-full items-center gap-4">
            {messages.map((value) => (
              <Card key={value.messageHash} className="px-4 py-4">
                <div className="flex flex-col space-y-3">
                  <Label htmlFor={`name${value.messageHash.toString()}`} className="text-xl">Message</Label>
                  <div className="flex mt-5 justify-between items-center">
                    <div>Hash:</div>
                    <div className="rounded-md border px-4 py-3 font-mono text-sm">
                      {value.messageHash.toString().substring(0, 15) + "..."}
                    </div>
                    <Button onClick={() => navigator.clipboard.writeText(value.messageHash.toString())}> Copy</Button>
                  </div>
                  <div className="flex mt-5 items-center">
                    <div>Url:</div>
                    <a href={value.dataUrl} target="_blank" rel="noopener noreferrer" className="ml-10 text-blue-500 hover:underline">{value.dataUrl.substring(0, 50) + "..."}</a>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      {!value.isAlerted && <Button onClick={() => handleChallenge(value.messageHash)} className="mt-5">Challenge</Button>}
                    </DialogTrigger>
                    {lastRequest ?
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Message</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <div className="flex  items-center  gap-4">
                              <Label htmlFor="name" className="text-right">
                                Yes Count:
                              </Label>
                              <p className=" text-sm">{lastRequest[3].toString()}/3</p>
                            </div>

                            <div className="flex  items-center  gap-4">
                              <Label htmlFor="name" className="text-right">
                                No Count:
                              </Label>
                              <p className=" text-sm">{lastRequest[4].toString()}/3 </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                              Store Node Adress:
                            </Label>
                            <Card className="">
                              <div className=" px-2 text-sm py-2 items-center justify-center">
                                {value.storeNodeAddress}

                              </div>
                            </Card>
                            <div className="flex mt-5 gap-2 justify-left items-center">
                              <div>Hash:</div>
                              <div className="rounded-md border px-4 py-3 font-mono text-sm">
                                {value.messageHash.toString().substring(0, 20) + "..."}
                              </div>
                            </div>
                            <div className="flex mt-5 items-center">
                              <div>Url:</div>
                              <a href={value.dataUrl} target="_blank" rel="noopener noreferrer" className="ml-10 text-blue-500 hover:underline">{value.dataUrl.substring(0, 50) + "..."}</a>
                            </div>

                          </div>
                        </div>
                        <DialogFooter>
                          {Number(lastRequest[3] + lastRequest[4]) ==3 && <Button onClick={() => handleEndRequest(lastRequestId)}>End challlenge</Button>}
                        </DialogFooter>
                      </DialogContent>
                      :
                      <DialogContent>
                        Waiting for first verification...
                      </DialogContent>
                    }
                  </Dialog>

                </div>
              </Card>
            ))}
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default AllMessages

