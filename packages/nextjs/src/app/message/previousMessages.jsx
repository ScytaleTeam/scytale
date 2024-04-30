import { fetchMyMessages, fetchPreviousMessages } from "@/lib/blockchain/scytaleContract"
import { useRSAContext } from "@/lib/context"
import config from "../../../config"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { removePemHeaderAndFooter } from "@/lib/utils"
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"

export default function PreviousMessages() {
  const { publicKey } = useRSAContext()
  const provider = ethers.getDefaultProvider("https://scroll-public.scroll-testnet.quiknode.pro/")

  const [messages, setMessages] = useState([])

  const fetchMessages = async () => {
    const newMessages = await fetchMyMessages(publicKey, provider)
    const finalMsg = []
    for (let i = 0; i < newMessages.length; i++) {
      const msgHash = newMessages[i].args[1]
      const contract = new ethers.Contract(config.scytale.address, config.scytale.abi, provider)

      const result = await contract.messages(msgHash)
      finalMsg.push(result)
    }

    setMessages(finalMsg)
  }

  useEffect(() => {
    if (publicKey === null) return
    fetchMessages()
  }, [publicKey])

  useEffect(() => {
    console.log(messages)
  }, [messages])
  return (
    <>
      {messages.length === 0 ? <p className="w-full text-center text-4xl">Messages are fetching...</p> : null}
      <div className="flex gap-10 flex-col">
        {messages.map((msg, index) => {
          return (
            <MessageCard
              msg={{
                sender: msg.senderAddress,
                url: msg.dataUrl,
                timestamp: Number(msg.endTime) * 1000,
              }}
            />
          )
        })}
      </div>
    </>
  )
}

const MessageCard = ({ msg }) => {
  const { decryptData } = useRSAContext()
  const [message, setMessage] = useState(null)
  const [decryptedMessage, setDecryptedMessage] = useState(null)
  useEffect(() => {
    const fetchMessage = async () => {
      const response = await fetch(msg.url)
      const data = await response.json()
      setMessage(JSON.parse(data))
    }
    fetchMessage()
  }, [msg])

  useEffect(() => {
    if (message === null) return
    decryptData(message.message).then(decrypted => {
      setDecryptedMessage(JSON.parse(decrypted))
    })
  }, [message])

  useEffect(() => {
    console.log(decryptedMessage)
  }, [decryptedMessage])

  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle>{`From: ${msg.sender}`}</CardTitle>
        <CardDescription>{message?.subject && `Subject: ${message.subject}`}</CardDescription>
      </CardHeader>
      <CardContent>
        {decryptedMessage && (
          <div className="border-2 p-4 rounded-md">
            <span className="flex gap-2 text-white">
              Message: <p className="text-white/50">{decryptedMessage.message}</p>
            </span>
            {decryptedMessage.attachments && (
              <div className="flex gap-2 items-center">
                Attachments:
                <div className="flex gap-6">
                  {decryptedMessage.attachments.map((attachment, index) => {
                    return (
                      <a
                        key={index}
                        href={attachment}
                        className="flex items-center justify-center gap-2 rounded-md text-white/50 hover:text-white"
                      >
                        File {index + 1}
                        <Button className="p-1 h-6" variant="ghost">
                          <ArrowDownOnSquareIcon className="h-4 w-4" />
                        </Button>
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
