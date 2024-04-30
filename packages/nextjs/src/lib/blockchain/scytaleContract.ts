import { ethers } from "ethers"
import config from "../../../config"

export async function fetchPreviousMessages(provider: any) {
  const contract = new ethers.Contract(config.scytale.address, config.scytale.abi, provider)
  const eventFilter = contract.filters.AcceptedMessage()
  const logs = await contract.queryFilter(eventFilter)

  return logs
}

export async function fetchMyMessages(address: string, provider: any) {
  const contract = new ethers.Contract(config.scytale.address, config.scytale.abi, provider)
  const eventFilter = contract.filters.AcceptedMessage(null, null, address)
  const logs = await contract.queryFilter(eventFilter)

  return logs
}

export async function fetchNodes(provider: any) {
  const contract = new ethers.Contract(config.scytale.address, config.scytale.abi, provider)
  const eventFilter = contract.filters.StoreNodeInitialized()
  const logs = await contract.queryFilter(eventFilter, provider.blockNumber - 3000, provider.blockNumber)
  const nodes: any = []
  for (const log of logs) {
    const node = log.args![0]
    if (nodes.includes(node)) continue
    nodes.push(node)
  }

  return nodes
}
