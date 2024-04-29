import React from "react"
import TopCard from "./components/topcard"
import { Button } from "@/components/ui/button"
import MiddleCard from "./components/middlecard"

const Page: React.FC = () => {
  return (
    <div className="container mx-auto justify-center items-center mt-20 px-4">
      <div className="text-xl font-bold text-white mt-8 ">My Node</div>

      <div className="mt-4 ">
        <span className=" font-medium">Address:</span>{" "}
        <span className=" text-sm text-gray-400">0x713c6DE127cf563B20dA274c63BB88D27a7Ca291</span>
        <Button className="ml-5"> edit</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 lg:grid-cols-4 gap-4">
        <TopCard title="Revenue" amount="$45,231.89" />
        <TopCard title="Truth Score" amount="100%" />
        <TopCard title="Storage" amount="50.9GB" />
        <TopCard title="User" amount="11" />
      </div>
      <div className="mt-10 ">
        <span className=" font-medium">Node Settings</span>{" "}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 lg:grid-cols-3 gap-4">
        <MiddleCard title="Stake Balance" bottom=" Deposit">
          <div className=" mt-5 mb-5 font-bold text-center text-3xl text-white">$45,231.89</div>
          <div className="flex justify-center gap-8 mt-10 items-center ">
            {" "}
            <Button> Deposit</Button> <Button> Withdraw</Button>
          </div>
        </MiddleCard>
        <MiddleCard title="Active messages" bottom=" ">
          <div className=" mt-5 mb-5 font-bold text-center text-3xl text-white"> 11.237 TX </div>
          <div className="flex justify-center gap-8 mt-10 items-center ">
            {" "}
            <Button> Look all messages</Button>{" "}
          </div>
        </MiddleCard>
        <MiddleCard title="Current Price" bottom="">
          <div className=" mt-5 mb-5 font-bold text-center text-3xl text-white"> $0.40/hour</div>
          <div className="flex justify-center gap-8 mt-10 items-center ">
            {" "}
            <Button> Change price </Button>{" "}
          </div>
        </MiddleCard>
      </div>
    </div>
  )
}

export default Page
