type NodeStatus = "online" | "offline" // online or not

type NodeInfo = {
  id: string
  status: NodeStatus // online or not
  cost: number // x eth per (duration in seconds * bytes)
  address: string
  trustScore: number
}
