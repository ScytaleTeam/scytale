import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Address } from "./address"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

interface NodeCardProps {
  node: NodeInfo
}

const NodeStatus = ({ status }: { status: NodeStatus }) => {
  return (
    <>
      {status === "online" ? (
        <>
          <div className="h-2 w-2 rounded-full bg-green-400 group-hover:hidden block m-1" />
          <ChevronRightIcon className="h-4 w-4 text-white text-3xl group-hover:block hidden" />
        </>
      ) : (
        <div className="h-2 w-2 rounded-full bg-red-400 block" />
      )}
    </>
  )
}

const NodeAddress = ({ address }: { address: string }) => {
  return (
    <div className="flex gap-1 items-center">
      <Address address={address} size="md" showQR />
    </div>
  )
}

export const NodeCard: React.FC<NodeCardProps> = ({ node }) => {
  return (
    <Card className={cn("group", node.status == "online" ? "hover:cursor-pointer" : "cursor-default")}>
      <CardHeader className="">
        <CardTitle>
          <span className="flex justify-between">
            <h4>Node {node.id}</h4>{" "}
            <span>
              <NodeStatus status={node.status} />{" "}
            </span>
          </span>
        </CardTitle>
        <CardDescription>
          <NodeAddress address={node.address} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="flex gap-1">
            Price:
            <p className="text-white/50">{node.cost}</p>
          </span>
          <span className="flex gap-1">
            Trust Score:
            <p className="text-white/50">{node.trustScore * 100}</p>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
