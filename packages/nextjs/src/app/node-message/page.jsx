import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function Page() {
    return (
      <div className="flex mt-20 justify-center items-center">
        <Card className="w-[550px] overflow-y-auto">
          <CardHeader>
            <CardTitle>Active Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                {Array.from({ length: 10 }, (_, index) => (
                  <Card key={index} className="px-4 py-4">
                    <div className="flex flex-col space-y-3">
                      <Label htmlFor={`name${index}`} className="text-xl">Message {index + 1}</Label>
                      <div className="flex mt-5 justify-between items-center">
                        <div>Hash:</div>
                        <div className="rounded-md border px-4 py-3 font-mono text-sm">
                          $P$Bg2ppLbmTYDSA/2bP1xN.Y3Mdk32.X{index}
                        </div>
                        <Button> Copy</Button>
                      </div>
                      <div className="flex mt-5 items-center">
                        <div>Url:</div>
                        <a href="https://www.spacex.com/" target="_blank" rel="noopener noreferrer" className="ml-10 text-blue-500 hover:underline">https://www.spacex.com/</a>
                      </div>
                      <Button className="mt-5">Go</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }