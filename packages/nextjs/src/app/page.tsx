"use client"
import { useRSAContext } from "@/lib/context"

export default function Home() {
  const { publicKey, privateKey, encryptData, decryptData } = useRSAContext()
  return <></>
}
