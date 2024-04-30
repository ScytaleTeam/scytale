"use client"

import { useRSAContext } from "@/lib/context"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { PaperAirplaneIcon } from "@heroicons/react/24/outline"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { fileToBase64 } from "@/lib/utils"

export default function MessageBox() {
  const { publicKey, privateKey, encryptData, decryptData } = useRSAContext()
  const { toast } = useToast()

  const [data, setData] = useState({
    subject: "",
    message: "",
    to: "",
    attacments: [] as any,
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

    console.log(json)

    const encrypted = await encryptData(json, data.to)
    const willSend = {
      subject: data.subject,
      message: encrypted,
    }

    const decrypted = await decryptData(encrypted)

    console.log(willSend)
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
          <Button
            variant="default"
            onClick={() => {
              handleSendClicked()
            }}
          >
            Send
            <PaperAirplaneIcon className="h-4 w-4 ml-4" />
          </Button>
        </CardFooter>
      </Card>
      <div className=""></div>
    </div>
  )
}
