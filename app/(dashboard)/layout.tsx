"use client"

import * as React from "react"
import { MoveUpRight, ChevronsLeftRightEllipsis, WorkflowIcon, Bot, ChevronRight, Coins, HandCoins, Command, ChartBar, CreditCard, Folder, Landmark, User2Icon, LifeBuoy, LogOut, Map, MoreHorizontal, PieChart, Search, Send, Settings2, Share, Sparkles, SquareTerminal, Users, Repeat, ArrowUpRight, Info, ShieldUser, ExternalLink, Plus, ChartNoAxesCombinedIcon, ChartNoAxesCombined, Component, TrendingUp, ChartPie   } from 'lucide-react'

import Image
 from "next/image"

import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Header } from "@/components/header"
import { usePrivy } from "@privy-io/react-auth"
import SidebarLogo from "@/components/sidebar-logo"
import { useState } from "react"
import router from "next/router"
import { ComingSoonModal } from "@/components/coming-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Arrow } from "@radix-ui/react-dropdown-menu"
import PageLoader from "@/components/page-loader"

const data = {
  navMain: [
    {
      title: "Terminal",
      url: "/terminal",
      icon: SquareTerminal,
    },
    /*{
      title: "Namespace",
      url: "/namespace",
      icon: ShieldUser,
      items: [
        {
          title: "Explore",
          url: "/namespace/explore",
        },
        
      ]
    },*/
    {
      title: "My Agent",
      url: "/agent",
      icon: Bot,
      items: [
        {
          title: "Smart Automations",
          url: "/agent/tasks",
        },
      ]
    },
    {
      title: "Metrics",
      url: "/metrics",
      icon: ChartPie,
    },
    {
      title: "Ecosystems",
      url: "#",
      icon: Component,
      comingSoon: true,
      items: [
        {
          title: "Virtuals Protocol",
          url: "/ecosystem/virtuals",
        },
        {
          title: "Creator Bid",
          url: "/ecosystem/creatorbid",
        },
      ]
    },
    {
      title: "Trading Strategies",
      url: "#",
      icon: ChartNoAxesCombined,
      comingSoon: true,
      items: [
        {
          title: "AutoTrading Intelligence",
          url: "#",
        },
        {
          title: "Community Smart Funds",
          url: "#",
        },
      ]
    },
  ],
  management: [
    {
      name: "Settings",
      url: "/settings",
      icon: Settings2,
    },
    /*{
      name: "API Keys",
      url: "/api-keys",
      icon: ChevronsLeftRightEllipsis,
    },*/
    /*{
      name: "Plan and Pricing",
      url: "#",
      icon: CreditCard,
    },*/
    {
      name: "Analytics",
      url: "#",
      icon: ChartBar,
    },
  ],
  token: [
    {
      name: "Buy ETHY",
      url: "/swap",
      icon: Repeat,
    },
    {
      name: "Staking on Virtuals",
      url: "https://app.virtuals.io/stake-agent?id=19520",
      icon: Coins,
      target: "_blank"
    },
  ],
  navSecondary: [
    {
      title: "Give us feedback",
      url: "https://t.me/basenamesai",
      icon: LifeBuoy,
    },
  ],
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const pathname = usePathname();
  const { ready, authenticated } = usePrivy();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isTerminalPage = pathname.startsWith("/terminal")

  const handleNavigation = (url: string) => {
    if (url === "#" || !url) {
      //console.log("Coming soon")
      setIsModalOpen(true)
    } else {
      router.push(url)
    }
  }
  
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "21rem",
        } as React.CSSProperties
      }
    >
      <Sidebar variant="floating" collapsible="icon" className="border-none bg-background p-3 py-4">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarLogo />
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="mt-6 mb-2">
          <SidebarGroup>
            <SidebarMenu>
              {data.navMain.map((item) => {
                const isActive = pathname === item.url;
                
                return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={isActive}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        {item.comingSoon && <Badge variant="outline" className="ml-2 text-xs justify-end">Soon</Badge>}
                      </Link>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRight />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="mb-2">
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild className="text-primary/80 hover:bg-transparent">
                                  <Link 
                                    href={subItem.url}
                                  >
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              )
            })}
            </SidebarMenu>
          </SidebarGroup>
          <Separator className="my-2 border-border w-5/6 mx-auto" />
          {ready && authenticated && <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Account & Tools</SidebarGroupLabel>
            <SidebarMenu>
              {data.management.map((item) => {
                const isActive = pathname === item.url;
                return (
                <SidebarMenuItem className="ml-2" key={item.name}>
                  <SidebarMenuButton asChild tooltip={item.name} isActive={isActive}>
                    <Link
                      href={item.url}
                      onClick={() => item.url === "#" ? handleNavigation(item.url) : null }
                    >
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>}
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>ETHY token</SidebarGroupLabel>
            <SidebarMenu>
              {data.token.map((item) => {
                const isActive = pathname === item.url;
                return (
                <Collapsible
                  key={item.name}
                  asChild
                  defaultOpen={isActive}
                  >
                  <SidebarMenuItem key={item.name} className="flex items-center justify-between ml-2">
                    <SidebarMenuButton asChild tooltip={item.name} isActive={isActive}>
                      <Link
                        href={item.url}
                        target={item.target}
                      >
                        <span>{item.name}</span>
                      {item.target && (
                        <ArrowUpRight className="ml-0" />
                      )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Collapsible>
              )
              })}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-auto border-t border-border group-data-[collapsible=icon]:hidden mb-2">
            <SidebarGroupContent className="mt-2">
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="sm">
                      <Link href={item.url} className="group/item">
                        <span>{item.title}</span>
                        <ArrowUpRight className="transition-transform duration-200 group-hover/item:translate-x-1" />
                        </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              <SidebarMenu>
                <SidebarMenuItem>
                  <div className="flex items-center gap-4 ml-2 mt-2">
                    <Link href="https://x.com/ethy_agent" className="hover:opacity-80 transition-opacity">
                      <Image src="/img/x.svg" alt="Twitter" width={18} height={18} />
                    </Link>
                    <Link href="https://t.me/basenamesai" className="hover:opacity-80 transition-opacity"  >
                      <Image src="/img/tg.png" alt="Telegram" width={18} height={18} />
                    </Link>
                    <Link href="https://dexscreener.com/base/0x044f7f6407b68079cd9f2d2abe792aaa7a46117f" className="hover:opacity-80 transition-opacity"  >
                      <Image src="/img/dexscreener.png" alt="Dexscreener" width={24} height={24} />
                    </Link>
                    <Link href="https://app.virtuals.io/virtuals/19520" className="hover:opacity-80 transition-opacity"  >
                      <Image src="/img/virtuals-icon.svg" alt="Virtuals" width={24} height={24} />
                    </Link>
                  </div>
                </SidebarMenuItem>
              </SidebarMenu>
              <SidebarFooter>
                <p className="text-xs text-muted-foreground pt-2">2025 @ Ethy AI, v3.11.0+1c7fd</p>
              </SidebarFooter>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset 
        className={cn(
          isTerminalPage && "h-screen flex flex-col overflow-hidden"
        )}
      >
      <Header />
        <div 
          className={cn(
            "p-0 md:!p-4",
            isTerminalPage && "overflow-hidden flex flex-1 flex-col "
          )}
        >
            {!ready ?
            <PageLoader />
            :
            children
          }
        </div>
      </SidebarInset>
      <ComingSoonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </SidebarProvider>
  )
}

