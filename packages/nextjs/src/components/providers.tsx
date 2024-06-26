"use client"

import "@rainbow-me/rainbowkit/styles.css"
import { darkTheme, getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { WagmiProvider } from "wagmi"
import { scrollSepolia } from "wagmi/chains"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import Header from "./header"
import { Toaster } from "@/components/ui/toaster"
import React from "react"
import { RSAContextProvider } from "@/lib/context"

const config = getDefaultConfig({
  appName: "Scytale",
  projectId: "YOUR_PROJECT_ID",
  chains: [scrollSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
})

const queryClient = new QueryClient()

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RSAContextProvider>
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: "#D1EF70",
              accentColorForeground: "black",
              borderRadius: "medium",
              fontStack: "system",
              overlayBlur: "small",
            })}
          >
            <div className="min-h-screen relative">
              <Header />
              <div className="flex items-center justify-center h-full w-full absolute">
                <div className="md:px-12 px-4 w-full h-full">{children}</div>
              </div>
              <Toaster />
            </div>
          </RainbowKitProvider>
        </RSAContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Providers
