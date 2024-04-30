import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Page() {
  return (
    <div className="mt-24  h-screen">
      <div className=" items-center justify-center grid">
        <p className=" text-4xl font-bold text-white"> Create New Cluster</p>
        <div className="  grid grid-cols-1 mt-10 lg:grid-cols-2 items-center justify-between    ">
          <div className=" text-l font-medium text-white "> Clone and import required libraries and modules</div>
          <Card className="  lg:mt-0 mt-4  w-[550px]">
            <CardContent></CardContent>
            <CardFooter className="flex justify-center">
              <div className="rounded-md border px-4 py-3 font-mono text-sm">
                git clone https://github.com/ScytaleTeam/scytale.git cd scytale/packages/backend/StoreNode
                <p>yarn</p>
              </div>
              <Button className="ml-10"> Copy </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="  grid grid-cols-1 mt-10 lg:grid-cols-2 items-center justify-between    ">
          <div className=" text-l font-medium text-white "> Compile contracts</div>
          <Card className="  lg:mt-0 mt-4  w-[550px]">
            <CardContent></CardContent>
            <CardFooter className="flex justify-center">
              <div className="rounded-md border px-4 py-3 font-mono text-sm">
                cd ../../hardhat yarn compile cd ../backend/StoreNode
              </div>
              <Button className="ml-10"> Copy </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="  grid grid-cols-1 mt-10 lg:grid-cols-2 items-center justify-between    ">
          <div className=" text-l font-medium text-white ">
            {" "}
            After setting up .env variables according to .env.example:
          </div>
          <Card className="  lg:mt-0 mt-4  w-[550px]">
            <CardContent></CardContent>
            <CardFooter className="flex  justify-between">
              <div className="rounded-md border px-4 py-3 font-mono text-sm">node index.js</div>
              <Button className="ml-10"> Copy </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="  grid grid-cols-1 mt-10 lg:grid-cols-2 items-center justify-between    ">
          <div className=" text-l font-medium text-white "> Done</div>
          <Card className="  lg:mt-0 mt-4  w-[550px]">
            <CardContent></CardContent>
            <CardFooter className="flex justify-center">
              <div className="rounded-md border px-4 py-3 font-mono text-sm">
                You need to stay on to provide data sharing services. Don&apos;t forget to set your port settings!
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
