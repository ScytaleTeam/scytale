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
    <div className="flex justify-center items-center h-screen">
    <Card className="w-[550px]">
      <CardHeader>
        <CardTitle>Create Node</CardTitle>
        <CardDescription>Deploy your node</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Address</Label>
              <Input id="name" placeholder="Address of your node" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Price</Label>
              <Input id="name" placeholder="$/hour" />

              
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Stake balance</Label>
              <Input id="name" placeholder="Min = 20.000$"  />

              
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Max Users</Label>
              <Input id="name" placeholder="Min = 1"  />

              
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
    </div>
  )
}
