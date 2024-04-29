import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { GlobeAltIcon } from "@heroicons/react/24/outline"
import { NodeCard } from "./node-card"

interface NodeSheetProps {
  nodes: NodeInfo[]
}

const mockNodes = {
  nodes: [
    {
      id: "1",
      trustScore: 0.9,
      cost: 0.1,
      address: "0x1234567890",
      status: "online" as NodeStatus,
    },
    {
      id: "2",
      trustScore: 0.8,
      cost: 0.2,
      address: "0x8943278957423986528930ajfahjk",
      status: "offline" as NodeStatus,
    },
    {
      id: "3",
      trustScore: 0.7,
      cost: 10,
      address: "0x1234567890",
      status: "online" as NodeStatus,
    },
    {
      id: "4",
      trustScore: 0.2,
      cost: 0.5,
      address: "0xmsdakhfljksahö90378593hsamosdafdbs",
      status: "offline" as NodeStatus,
    },
  ],
}

export const NodeSheet: React.FC<NodeSheetProps> = ({ nodes }) => {
  return (
    <Sheet>
      <SheetTrigger>
        <GlobeAltIcon className="h-8 w-8" />
      </SheetTrigger>
      <SheetContent className="overflow-scroll">
        <SheetHeader>
          <SheetTitle>Nodes</SheetTitle>
          <SheetDescription className="flex flex-col gap-4">
            {mockNodes.nodes.map(node => (
              <NodeCard key={node.id} node={node} />
            ))}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
