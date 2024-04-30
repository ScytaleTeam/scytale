"use client"

import { useRSAContext } from "@/lib/context"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { PaperAirplaneIcon } from "@heroicons/react/24/outline"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { fileToBase64 } from "@/lib/utils"
import NodeList from "./nodeList"

export default function MessageBox() {
  const { publicKey, privateKey, encryptData, decryptData } = useRSAContext()
  const { toast } = useToast()

  const [data, setData] = useState({
    subject: "",
    message: "",
    to: "",
    attacments: [] as any,
    messageWillSend: "",
  })

  const setAttachments = async (files: any) => {
    const attachments = []
    for (let i = 0; i < files.length; i++) {
      const base64 = await fileToBase64(files[i])
      attachments.push(base64)
    }
    setData({
      ...data,
      attacments: attachments,
    })
  }

  const handleSendClicked = async () => {
    const json = JSON.stringify({
      message: data.message,
      attachments: data.attacments,
    })
    try {
      const encrypted = await encryptData(json, data.to)
      const willSend = {
        subject: data.subject,
        message: encrypted,
      }

      setData({ ...data, messageWillSend: JSON.stringify(willSend) })
    } catch (e) {
      setData({ ...data, messageWillSend: "" })
      toast({
        title: "Error",
        description: "Failed to encrypt the message check the recipient public key",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-4 flex flex-col gap-2">
          <div>
            <span className="text-lg font-bold mb-2 flex gap-1 items-center">
              Subject <p className="text-sm text-white/50">(Optional)</p>
            </span>
            <Textarea
              placeholder="Short description of your message (it is optional and will not be decrypted)"
              className="w-full h-10"
              id="messageBox"
              value={data.subject}
              onChange={e => {
                setData({
                  ...data,
                  subject: e.target.value,
                })
              }}
            />
          </div>
          <div>
            <span className="text-lg font-bold mb-2 flex gap-1 items-center">To</span>
            <Textarea
              placeholder="Pem encoded public key of the recipient"
              className="w-full h-10"
              id="messageBox"
              value={data.to}
              onChange={e => {
                setData({
                  ...data,
                  to: e.target.value,
                })
              }}
            />
          </div>
          <div>
            <p className="text-lg font-bold mb-2">Your message</p>
            <Textarea
              placeholder="Type your message here..."
              className="w-full h-40"
              id="messageBox"
              value={data.message}
              onChange={e => {
                setData({
                  ...data,
                  message: e.target.value,
                })
              }}
            />
          </div>
          <div className="w-full">
            <p className="text-lg font-bold mb-2">Attachments</p>
            <div className="w-full border p-4 rounded-md overflow-hidden">
              <input
                type="file"
                multiple
                onChange={e => {
                  setAttachments(e.target.files)
                }}
              />
            </div>
          </div>
          <div></div>
        </CardContent>
        <CardFooter className="flex justify-end">
          {/* <Dialog open={data.messageWillSend.length > 0}>
            <DialogTrigger
              onClick={() => {
                handleSendClicked()
              }}
              className="flex items-center gap-2 bg-white text-black p-2 rounded-md cursor-pointer"
            >
              Send
              <PaperAirplaneIcon className="h-4 w-4" />
            </DialogTrigger>
            <DialogContent className="w-full">
              <DialogHeader>
                <DialogTitle>Select a Node</DialogTitle>
                <DialogDescription>
                  <NodeList />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardFooter> */}
          <Sheet open={data.messageWillSend.length > 0}>
            <SheetTrigger>
              <Button
                onClick={() => {
                  handleSendClicked()
                }}
                className="flex items-center gap-2"
              >
                Send
                <PaperAirplaneIcon className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-scroll">
              <SheetHeader>
                <SheetTitle>Select a node</SheetTitle>
                <SheetDescription className="flex flex-col gap-4">
                  <NodeList />
                </SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <Button>
                  <SheetClose>Send</SheetClose>
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </CardFooter>
      </Card>
      <div className=""></div>
    </div>
  )
}
