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

  return (
    <div className="text-center flex justify-center w-fit border rounded-md">
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
          navigator.clipboard.writeText(address)
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
    </div>
  )
}
