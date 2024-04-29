import { Button } from "@/components/ui/button"
import { PaperAirplaneIcon } from "@heroicons/react/24/outline"
export default function Page() {
  return (
    <div className="mt-20">
      <Button>
        Send <PaperAirplaneIcon className="w-6 h-6" />
      </Button>
    </div>
  )
}
