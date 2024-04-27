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

export const Logo = ({ className }: { className?: string }) => {
	return (
		<div className={cn(className, "relative")}>
			<a href="/">
				<Image
					src="/logo.png"
					alt="logo.png"
					fill
					className={cn(className, "invert")}
				/>
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

export default function Header() {
	return (
		<div className="flex flex-row justify-center items-center border-b fixed w-full z-20 bg-black">
			<div className="flex flex-row justify-between items-center max-w-7xl md:px-12 px-4 py-4 w-full">
				<div className="flex flex-row md:gap-4 items-start justify-end">
					<Logo className="w-36 h-6 top-1 md:block hidden" />
					<NavigationMenu>
						<NavigationMenuList>
							{NavigationItems.map((item) => (
								<NavigationMenuItem key={item.title}>
									<Link href={item.href} legacyBehavior passHref>
										<NavigationMenuLink
											className={cn(
												navigationMenuTriggerStyle(),
												"text-md text-gray-400 bg-black tracking-widest"
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
				</div>
				<ConnectButton
					accountStatus={{
						smallScreen: "avatar",
						largeScreen: "full",
					}}
				/>
			</div>
		</div>
	)
}
