"use client"

import * as React from "react"
import { MoveUpRight, ChevronsLeftRightEllipsis, PackageOpen, Bot, ChevronRight, Coins, HandCoins, Command, ChartBar, CreditCard, Folder, Landmark, User2Icon, LifeBuoy, LogOut, Map, MoreHorizontal, PieChart, Search, Send, Settings2, Share, Sparkles, SquareTerminal, Users, Repeat, ArrowUpRight, Info, ShieldUser  } from 'lucide-react'

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

const data = {
  navMain: [
    {
      title: "Terminal",
      url: "/terminal",
      icon: SquareTerminal,
    },
    {
      title: "Namespace",
      url: "/namespace",
      icon: ShieldUser,
      items: [
        {
          title: "Explore",
          url: "/namespace/explore",
        },
        
      ]
    },
    {
      title: "My Agent",
      url: "/agent",
      icon: Bot,
    },
  ],
  management: [
    {
      name: "Settings",
      url: "/settings",
      icon: Settings2,
    },
    {
      name: "API Keys",
      url: "/api-keys",
      icon: ChevronsLeftRightEllipsis,
    },
    {
      name: "Analytics",
      url: "#",
      icon: ChartBar,
    },
  ],
  token: [
    {
      name: "Burn & Supply",
      url: "/metrics",
      icon: Info,
    },
    {
      name: "Swap",
      url: "/swap",
      icon: Repeat,
    },
    {
      name: "Staking",
      url: "#",
      icon: Coins,
      comingSoon: true
    },
  ],
  navSecondary: [
    {
      title: "Documentation",
      url: "https://basenames-ai.gitbook.io/ethyai-docs",
      icon: LifeBuoy,
    },
    {
      title: "Community",
      url: "https://x.com/ethy_agent",
      icon: Users,
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
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-none">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarLogo />
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="mt-8">
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
                        <item.icon />
                        <span>{item.title}</span>
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
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
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
                <SidebarMenuItem key={item.name}>
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
                  <SidebarMenuItem key={item.name} className="flex items-center justify-between">
                    <SidebarMenuButton asChild tooltip={item.name} isActive={isActive}>
                      <Link
                        href={item.url}
                      >
                        <span>{item.name}</span>
                      {item.comingSoon && (
                        <Badge className="ml-auto text-xs bg-transparent border-primary/60 text-primary/60 hover:bg-primary/10">
                          Soon
                        </Badge>
                      )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Collapsible>
              )
              })}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-auto border-t border-border group-data-[collapsible=icon]:hidden">
            <SidebarGroupContent>
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
              <SidebarFooter>
                <p className="text-xs text-muted-foreground pt-4">2025 @ Ethy AI, v2.1.0+1c7fd</p>
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
            <div className="mx-auto mt-32">
              <div className="loader2"></div>
            </div>
            :
            children
          }
        </div>
      </SidebarInset>
      <ComingSoonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </SidebarProvider>
  )
}

