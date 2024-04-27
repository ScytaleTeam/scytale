import { cn } from "@/lib/utils"
import Image from "next/image"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import Link from "next/link"

import { ConnectButton } from "@rainbow-me/rainbowkit"
import GlobeAltIcon from "@heroicons/react/24/outline/GlobeAltIcon"
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon"
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon"
import { Button } from "./ui/button"
import { useState } from "react"

export const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn(className, "relative")}>
      <a href="/">
        <Image src="/logo.png" alt="logo.png" fill className={cn(className, "invert")} />
      </a>
    </div>
  )
}

export const NavigationItems = [
  {
    title: "Message",
    icon: null,
    href: "/message",
  },
  {
    title: "Node FE",
    icon: null,
    href: "/node-fe",
  },
]

const NavMenuDesktop = () => {
  return (
    <div className="flex-row md:gap-4 items-start justify-end md:flex hidden">
      <Logo className="w-24 h-6 top-1 md:block hidden" />
      <NavigationMenu>
        <NavigationMenuList>
          {NavigationItems.map(item => (
            <NavigationMenuItem key={item.title}>
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), "text-md text-gray-400 bg-black tracking-widest")}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

const NavMenuMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <div className="md:hidden">
      <div className="flex md:hidden flex-row gap-2">
        <button
          onClick={() => {
            setIsMenuOpen(!isMenuOpen)
          }}
          className="flex items-center justify-center w-10 h-10"
        >
          {isMenuOpen ? <XMarkIcon className="w-8 h-8" /> : <Bars3Icon className="text-white w-8 h-8" />}
        </button>
        <Logo className="w-24 h-6 top-1" />
      </div>
      <div className="relative h-0 top-5">
        {isMenuOpen && (
          <NavigationMenu className="absolute  divide-x-0" orientation="vertical">
            <NavigationMenuList className="flex flex-col w-screen items-start border-b-2 divide-x-0 divide-y-2 px-4">
              {NavigationItems.map(item => (
                <NavigationMenuItem key={item.title} className="w-full ml-0">
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-xl text-gray-400 bg-transparent tracking-widest w-full items-center justify-center h-full",
                      )}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        )}
      </div>
    </div>
  )
}

export default function Header() {
  return (
    <div className="flex flex-row justify-center items-center border-b fixed w-full z-20 bg-black">
      <div className="flex flex-row justify-between items-center max-w-7xl md:px-12 px-0 py-4 w-full">
        <NavMenuDesktop />
        <NavMenuMobile />
        <div className="flex gap-2 flex-row-reverse items-center justify-center">
          <Button variant="ghost" className="py-5 px-2">
            <GlobeAltIcon className="h-8 w-8" />
          </Button>
          <ConnectButton
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
          />
        </div>
      </div>
    </div>
  )
}
