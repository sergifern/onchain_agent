"use client"

import * as React from "react"
import { MoveUpRight, ChevronsLeftRightEllipsis, FolderOpen, Bot, ChevronRight, Coins, HandCoins, Command, ChartBar, CreditCard, Folder, Landmark, User2Icon, LifeBuoy, LogOut, Map, MoreHorizontal, PieChart, Search, Send, Settings2, Share, Sparkles, SquareTerminal, Loader, Book2, Users } from 'lucide-react'

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

const data = {
  navMain: [
    {
      title: "Terminal",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Namespace",
      url: "#",
      icon: FolderOpen,
    },
    {
      title: "Your Agent",
      url: "#",
      icon: Bot,
    },
  ],
  management: [
    {
      name: "API Keys",
      url: "#",
      icon: ChevronsLeftRightEllipsis,
    },
    {
      name: "Analytics",
      url: "#",
      icon: ChartBar,
    },
    {
      name: "Settings",
      url: "#",
      icon: Settings2,
    },
  ],
  token: [
    {
      name: "Staking",
      url: "#",
      icon: HandCoins,
    },
    {
      name: "Governance",
      url: "#",
      icon: Landmark,
    },
  ],
  navSecondary: [
    {
      title: "Documentation",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Community",
      url: "#",
      icon: Users,
    },
  ],
}

export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const { ready } = usePrivy();

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarLogo />
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Ethy Agent</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
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
                                  <a href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="">
            <SidebarGroupLabel>$ETHY token</SidebarGroupLabel>
            <SidebarMenu>
              {data.token.map((item) => (
                <Collapsible
                  key={item.name}
                  asChild
                  >
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild tooltip={item.name}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="">
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarMenu>
              {data.management.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild tooltip={item.name}>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-auto border-t border-border">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="sm">
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                        <MoveUpRight />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <div className="flex flex-col gap-4 p-4">
          {!ready ?
          <div className="mx-auto mt-32">
            <div className="loader"></div>
          </div>
          :
          children
          }
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

