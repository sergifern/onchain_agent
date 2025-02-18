import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import Image from "next/image"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import ToolsInvocationMessage from "@/components/tools-invocation"


export default function Messages({ messages, addToolResult }: { messages: any, addToolResult: (result: any) => void }) {
  return (
    <>
      {messages.map((message: any, index: number) => (
        <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={cn("flex items-end gap-2 mb-4", message.role === "user" ? "justify-end" : "justify-start")}
        >
          <div
            className={cn(
              "relative items-center gap-2 rounded-2xl px-4 py-3 max-w-[90%]",
              message.role === "user" ? "bg-secondary text-white/80 flex" : "text-white",
            )}
            >
            {message.parts.map((part: any) => {
              switch (part.type) {       
                case "text":
                  return (
                    <div className="flex flex-col gap-2">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{ a: LinkRenderer }}
                      >
                        {part.text}
                      </ReactMarkdown>
                    </div>);
                case "tool-invocation":
                  return <ToolsInvocationMessage part={part} addToolResult={addToolResult} />
              }
            })}
            {message.role === "user" && (
              <Avatar className="w-6 h-6">
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-xs text-white">U</span>
                </div>
              </Avatar>
            )}
          </div>
        </motion.div>
      ))}
    </>
  )
}


function LinkRenderer(props: any) {
  console.log({ props });
  return (
    <a href={props.href} target="_blank" rel="noreferrer" className="text-violet-300 underline hover:text-violet-500 cursor-pointer">
      {props.children}
    </a>
  );
}

