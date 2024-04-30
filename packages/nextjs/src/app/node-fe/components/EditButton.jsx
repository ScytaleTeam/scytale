"use client";
import { Button } from "@/components/ui/button"


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

export default function EditButton() {

    const [myNodeAddress, setMyNodeAddress] = useState();
    const [stakeValue, setStakeValue] = useState('');
    const [priceInput, setPriceInput] = useState('');

    const { toast } = useToast()

    const account = useAccount()

    const { data: hash, isPending, isSuccess, error, writeContract } = useWriteContract()


    const { data: storeNode, isFetched: isFetchedNode, error: nodeErr } = useReadContract({
        address: config.scytale.address,
        abi: config.scytale.abi,
        functionName: "storeNodes",
        args: [myNodeAddress],
    })

    let nodeStake, apiUrl, activeMessages, price;
    if (storeNode) {
        nodeStake = storeNode[0]
        apiUrl = storeNode[1]
        activeMessages = storeNode[2]
        price = storeNode[3]
    }


    useEffect(() => {
        if (isSuccess) {
            console.log("success")
            toast({
                title: "🎉 Public key updated",
                description: "Your public key has been successfully updated",
            })
        }
        if (error) {
            console.log("error")
            toast({
                title: "❌ Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }, [isSuccess, error])

    const getMyNode = async () => {
        try {
            const res = await fetch("http://localhost:8080/getAddress"); //to get local node data if it is working
            if (res.ok) {
                let json = await res.json();
                setMyNodeAddress(json);

            }
        } catch (e) {

        }
    }

    useEffect(() => {
        getMyNode();
    }, [])



    async function handleSubmit(e) {


        const res = await fetch("http://localhost:8080/updateNode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                price: priceInput.toString(),
                stake: stakeValue.toString(),
            })
        });

        if (res.ok) {
            console.log("success")
            toast({
                title: "🎉 Node key updated",
                description: "Your node preferences has been successfully updated",
            })
        } else {
            console.log("error")
            toast({
                title: "❌ Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="ml-5">Edit</Button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Node</DialogTitle>
                    <DialogDescription>
                        Edit your node preferences on-chain.
                    </DialogDescription>

                </DialogHeader>

                <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Node Address: {myNodeAddress}</Label>
                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="framework">Price (Current: {price ? formatEther(price) : 0} ETH)</Label>
                        <Input id="price" placeholder={price ? `${formatEther(price)} ETH` : "0.001 ETH"}

                            onChange={(e) => setPriceInput(e.target.value)}
                            value={priceInput} />


                    </div>
                    <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="framework">Stake Amount (Current: {price ? formatEther(nodeStake) : 0} ETH)</Label>
                        <Input id="stake" placeholder={nodeStake ? `${formatEther(nodeStake)} ETH` : "0.1 ETH"}
                            onChange={(e) => setStakeValue(e.target.value)}
                            value={stakeValue}

                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose>
                        <Button type="submit" onClick={handleSubmit}>Save changes</Button>
                    </DialogClose>
                </DialogFooter>

            </DialogContent>
        </Dialog >
    )


}
