import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Abi } from "abitype"
import { Address } from "viem"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type InheritedFunctions = { readonly [key: string]: string }

export type GenericContract = {
  address: Address
  abi: Abi
  inheritedFunctions?: InheritedFunctions
  external?: true
}

export type GenericContractsDeclaration = {
  [chainId: number]: {
    [contractName: string]: GenericContract
  }
}

export function str2ab(str: string) {
  const buf = new ArrayBuffer(str.length)
  const bufView = new Uint8Array(buf)
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return bufView
}

export function arrayBufToString(buf: any) {
  return String.fromCharCode.apply(
    null,
    Array.from(new Uint8Array(buf)).map((x: number) => x),
  )
}

export function removePemHeaderAndFooter(pem: string) {
  return pem
    .replace(/-----BEGIN (.*)-----/, "")
    .replace(/-----END (.*)-----/, "")
    .replace(/\n/g, "")
}

export function pemEncode(label: any, data: any) {
  const base64encoded = window.btoa(data)
  const base64encodedWrapped = base64encoded.replace(/(.{64})/g, "$1\n")
  return `-----BEGIN ${label}-----\n${base64encodedWrapped}\n-----END ${label}-----`
}

export async function pemEncodedPrivateKey(keyPair: CryptoKeyPair) {
  const exported = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey)
  const exportedAsString = arrayBufToString(exported)
  return pemEncode("PRIVATE KEY", exportedAsString)
}

export async function pemEncodedPublicKey(keyPair: CryptoKeyPair) {
  const exported = await window.crypto.subtle.exportKey("spki", keyPair.publicKey)
  const exportedAsString = arrayBufToString(exported)

  return pemEncode("PUBLIC KEY", exportedAsString)
}

export async function pemDecode(pem: string) {
  return window.atob(removePemHeaderAndFooter(pem))
}

export async function importPrivateKey(pem: string) {
  const decoded = await pemDecode(pem)
  const binaryDer = str2ab(decoded)

  const key = await window.crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"],
  )
  return key
}

export async function importPublicKey(pem: string) {
  const decoded = await pemDecode(pem)
  const binaryDer = str2ab(decoded)
  const key = await window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"],
  )
  return key
}

export async function generateKeyPair() {
  return window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  )
}
