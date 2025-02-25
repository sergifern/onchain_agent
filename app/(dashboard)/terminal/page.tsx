"use client"

import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, FileInput, Globe, Send, Square, Sparkles } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { SuggestedActions } from "@/components/suggested-actions"
import Messages from "@/components/messages"
import { ChatOverview } from "@/components/chat-overview"
import WalletInfoInline from "@/components/wallet-info-inline"
import dotenv from 'dotenv'
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';

dotenv.config()


export default function ChatPage() {

  const { getAccessToken } = usePrivy();
  const [headers, setHeaders] = useState<Record<string, string>>({});

  const { messages, input, handleInputChange, handleSubmit, append, addToolResult, status } = useChat({
    api: process.env.NEXT_PUBLIC_ETHY_API_URL + '/chat',
    headers: headers,
    maxSteps: 10,
  });

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const accessToken = await getAccessToken();
        let token = accessToken || "public-key";
        console.log('token', token);
        setHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
      } catch (error) {
        console.error('Failed to fetch access token:', error);
      }
    };

    fetchToken();
  }, [getAccessToken]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  if (!headers) {
    return <p>Loading...</p>; // Show loading state while fetching token
  }

  return (
    <div className="flex flex-col h-full"> 
      
      {/* Contenedor de mensajes */}
      <div className="flex flex-col flex-1 overflow-hidden ">
        

        {/* Opcional: Encabezado *  */}
        {messages.length > 0 && (
          <div className="flex flex-row items-center gap-2 mx-auto pt-0">
            <Link href="/agent" className="flex flex-row items-center gap-2">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <p className="text-muted-foreground">Run your Agent</p>
            </Link>
          </div>
        )}

        {messages.length === 0 && <ChatOverview />}

        {/* Contenedor de mensajes con scroll */}
        <div className="flex-1 overflow-y-auto px-4"> 
          <div className="md:pt-8 pt-4 w-full md:max-w-[90%] max-w-[98%] lg:max-w-2xl mx-auto">
            <AnimatePresence initial={false}>
              <Messages messages={messages} addToolResult={addToolResult} />
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input fijo en la parte inferior */}
      <div className="p-4 pt-0 mt-auto">
        {messages.length === 0 && (
          <div className="pb-8 w-full max-w-[90%] lg:max-w-2xl mx-auto px-4">
            <SuggestedActions append={append} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
          <WalletInfoInline />
          <div className="card-outline border-0 rounded-3xl">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Send a message to Ethy..."
              className="focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[24px] max-h-[calc(75dvh)] overflow-hidden bg-transparent border-0 text-white placeholder:text-muted-foreground resize-none overflow-y-auto p-4 w-full"
              rows={2}
              autoFocus
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  if (input.trim()) {
                    handleSubmit();
                  }
                }
              }}
            />
            <div className="flex justify-between items-center px-4 py-2 outline-0">
              <div className="flex flex-row items-center gap-2 border rounded-full p-2 border-muted-foreground/60">
                <Globe className="h-5 w-5 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground/60">Search on Basenames</p>
              </div>
              <div className="p-2 flex flex-row justify-end">
                <Button type="submit" size="icon" className="h-8 w-8 rounded-full" disabled={!input.trim() || status === 'submitted' || status === 'streaming'}>
                  <ArrowUp className="h-8 w-8" />
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}
