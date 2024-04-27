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
