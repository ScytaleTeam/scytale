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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"

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
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="mt-5">Go</Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Message {index + 1}</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <div className="flex  items-center  gap-4">
                                                            <Label htmlFor="name" className="text-right">
                                                                Yes Count:
                                                            </Label>
                                                            <p className=" text-sm">14 </p>
                                                        </div>

                                                        <div className="flex  items-center  gap-4">
                                                            <Label htmlFor="name" className="text-right">
                                                                No Count:
                                                            </Label>
                                                            <p className=" text-sm">5 </p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="username" className="text-right">
                                                            Store Node Adress
                                                        </Label>
                                                        <Card className="">
                                                            <div className=" px-2 text-sm py-2 items-center justify-center">
                                                                0x713c6DE127cf563B20dA274c63BB88D27a7Ca291

                                                            </div>
                                                        </Card>
                                                        <div className="flex mt-5 justify-between items-center">
                                                            <div>Hash:</div>
                                                            <div className="rounded-md border px-4 py-3 font-mono text-sm">
                                                                $P$Bg2ppLbmTYDSA/2bP1xN.Y3Mdk32.X
                                                            </div>
                                                        </div>
                                                        <div className="flex mt-5 items-center">
                                                            <div>Url:</div>
                                                            <a href="https://www.spacex.com/" target="_blank" rel="noopener noreferrer" className="ml-10 text-blue-500 hover:underline">https://www.spacex.com/</a>
                                                        </div>

                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button  type="submit">End challlenge</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>

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