"use clinet"

import React, { useEffect } from "react"
import {
  arrayBufToString,
  generateKeyPair,
  importPrivateKey,
  importPublicKey,
  pemEncodedPrivateKey,
  pemEncodedPublicKey,
  str2ab,
} from "./utils"

interface RSAContext {
  publicKey: string
  privateKey: string
  keyPair: CryptoKeyPair | null
  encryptData: (data: string, publicKey: string) => Promise<string>
  decryptData: (data: string) => Promise<string>
}

const RSAContext = React.createContext<null | RSAContext>(null)

export const useRSAContext = () => {
  const context = React.useContext(RSAContext)
  if (!context) {
    throw new Error("useRSAContext must be used within a RSAContextProvider")
  }
  return context
}

export const RSAContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [keyPair, setKeyPair] = React.useState<CryptoKeyPair | null>(null)
  const [{ publicKey, privateKey }, setKeys] = React.useState<{ publicKey: string; privateKey: string }>({
    publicKey: "",
    privateKey: "",
  })

  useEffect(() => {
    const priKey = localStorage.getItem("privateKey")
    const pubKey = localStorage.getItem("publicKey")

    if (priKey && pubKey) {
      deriveKeyPairAndSet(priKey, pubKey)
    } else {
      generateKeyPairAndSet()
    }
  }, [privateKey && publicKey])

  const generateKeyPairAndSet = async () => {
    const keyPair = await generateKeyPair()
    const privateKey = await pemEncodedPrivateKey(keyPair)
    const publicKey = await pemEncodedPublicKey(keyPair)
    localStorage.setItem("publicKey", publicKey)
    localStorage.setItem("privateKey", privateKey)
    setKeyPair(keyPair)
    setKeys({ publicKey, privateKey })
  }

  const deriveKeyPairAndSet = async (privateKey: string, publicKey: string) => {
    const priKey = await importPrivateKey(privateKey)
    const pubKey = await importPublicKey(publicKey)
    const keyPair = { privateKey: priKey, publicKey: pubKey }
    setKeyPair(keyPair)
    setKeys({ publicKey, privateKey })
  }

  const encryptData = async (data: string, publicKey: string) => {
    const key = await importPublicKey(publicKey)

    const encoder = new TextEncoder()
    const encryptedList = []

    for (let i = 0; i < data.length; i += 100) {
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
        },
        key,
        encoder.encode(data.slice(i, i + 100)),
      )
      encryptedList.push(encryptedData)
    }
    const encrypted = window.btoa(JSON.stringify(encryptedList.map(data => arrayBufToString(data))))

    return encrypted
  }

  const decryptData = async (data: string) => {
    if (!keyPair) throw new Error("Key pair not found")
    let decryptedData = ""
    const key = keyPair.privateKey
    const decodedData = window.atob(data)
    const json = JSON.parse(decodedData)
    json.map((data: string) => str2ab(data))

    for (let i = 0; i < json.length; i++) {
      const data = json[i]
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        key,
        str2ab(data),
      )
      decryptedData += arrayBufToString(decrypted)
    }

    return decryptedData
  }

  return (
    <RSAContext.Provider value={{ keyPair, privateKey, publicKey, encryptData, decryptData }}>
      {children}
    </RSAContext.Provider>
  )
}
