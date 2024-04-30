"use client"

import { CopyIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
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
import QRCode from "react-qr-code"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAccount, useWriteContract, useReadContract } from "wagmi"
import config from "../../config"
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline"
import { useEffect } from "react"

interface PublicKeyProps {
  address: string
  pemAddress: string
}

export const QRButton: React.FunctionComponent = () => {
  return (
    <Button variant="outline" size="icon">
      <QrCodeIcon className="h-6 w-6" />
    </Button>
  )
}

export const QrModal = ({ address, pemAddress }: { address: string; pemAddress: string }) => {
  const splittedAddress = []
  for (let i = 0; i < address.length; i += 40) {
    splittedAddress.push(address.substring(i, i + 40))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="p-3">
          <QrCodeIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {address.substring(0, 10) + "-" + address.substring(address.length - 10)}
          </DialogTitle>
          <DialogDescription className="p-2">
            <div className="flex flex-col text-center items-center">
              <QRCode value={address} />
            </div>
          </DialogDescription>
          <DialogFooter>
            <div className="pt-2 text-center font-mono text-gray-400 text-sm w-full text-wrap">
              {" "}
              <p>{`-----BEGIN PUBLIC KEY-----`}</p>
              {splittedAddress.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
              <p>{`-----END PUBLIC KEY-----`}</p>
            </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export const PublicKey: React.FunctionComponent<PublicKeyProps> = ({ address, pemAddress }) => {
  const { toast } = useToast()

  const splittedAddress = []
  for (let i = 0; i < address.length; i += 40) {
    splittedAddress.push(address.substring(i, i + 40))
  }

  const account = useAccount()

  const { data: hash, isPending, isSuccess, error, writeContract } = useWriteContract()

  const { data: rsaKey, isFetched } = useReadContract({
    address: config.scytale.address,
    abi: config.scytale.abi,
    functionName: "rsaKeys",
    args: [account.address],
  })

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

  const handleUpdatePublicAddress = async () => {
    if (!account.isConnected) {
      toast({
        title: "🔒 Connect Your Wallet",
        description: "Please connect your wallet to update your public key",
      })
      return
    }

    if (isFetched && rsaKey === pemAddress) {
      toast({
        title: "🔑 Public key already in use",
        description: "You are already using this public key",
      })
      return
    }

    writeContract({
      address: config.scytale.address,
      abi: config.scytale.abi,
      functionName: "changeRsaPublicKey",
      args: [pemAddress],
    })
  }

  return (
    <div className="text-center flex justify-center w-fit border rounded-md overflow-scroll">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div>
              <Button variant="ghost">
                <p className="font-mono text-md block">
                  {address.substring(0, 10) + "-" + address.substring(address.length - 10)}
                </p>
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent className="text-wrap">
            <article className="text-xs w-[350px] h-full text-wrap">
              <p>{`-----BEGIN PUBLIC KEY-----`}</p>
              {splittedAddress.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
              <p>{`-----END PUBLIC KEY-----`}</p>
            </article>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button
        variant="ghost"
        onClick={() => {
          navigator.clipboard.writeText(pemAddress)
          toast({
            title: "📋 Copied the full address to clipboard",
            description: pemAddress,
          })
        }}
        className="px-2"
      >
        <CopyIcon className="h-5 w-5" />
      </Button>
      <QrModal address={address} pemAddress={pemAddress} />
      <Button onClick={() => handleUpdatePublicAddress()} className="px-2" disabled={isPending}>
        <ArrowUpOnSquareIcon className="w-5 h-5" />
      </Button>
    </div>
  )
}
