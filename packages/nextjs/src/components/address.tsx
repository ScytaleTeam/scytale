"use client"
//TODO: change to use etherscan to scrollscan

import { CopyIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { QrCodeIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid"
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

interface AddressProps {
  address: string
  showQR?: boolean
}

export const QRButton: React.FunctionComponent = () => {
  return (
    <Button variant="outline" size="icon">
      <QrCodeIcon className="h-6 w-6" />
    </Button>
  )
}

export const QrModal = ({ address }: { address: string }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <QrCodeIcon className="mr-2 h-4 w-4" />
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
            <p className="pt-2 text-center font-mono text-gray-400 text-sm w-full">{address}</p>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export const Address: React.FunctionComponent<AddressProps> = ({ address, showQR }) => {
  const { toast } = useToast()
  const etherscanURL = `https://etherscan.io/address/${address}`

  return (
    <div className="text-center flex justify-center w-fit border rounded-md">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <a href={etherscanURL}>
              <Button variant="ghost">
                <p className="font-mono text-md sm:hidden block">
                  {address.substring(0, 5) + "-" + address.substring(address.length - 5)}
                </p>
                <p className="font-mono text-md hidden sm:block">
                  {address.substring(0, 10) + "-" + address.substring(address.length - 10)}
                </p>
                <p className="font-mono text-md md:block hidden">{address}</p>
              </Button>
            </a>
          </TooltipTrigger>
          <TooltipContent>
            <a href={etherscanURL} className="flex items-center">
              <p>Open in etherscan</p>
              <ArrowTopRightOnSquareIcon className="ml-1 h-3 w-3" />
            </a>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button
        variant="ghost"
        onClick={() => {
          navigator.clipboard.writeText(address)
          toast({
            title: "📋 Copied the full address to clipboard",
            description: address,
          })
        }}
        className="px-2"
      >
        <CopyIcon className="h-5 w-5" />
      </Button>
      {showQR && <QrModal address={address} />}
    </div>
  )
}
