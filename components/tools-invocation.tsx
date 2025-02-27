import TaskConfirmationCard from "@/components/chat-tools/confirm-task";
import { BadgeCheck } from "lucide-react";
// component to return tools invocation

export default function ToolsInvocationMessage({ part, addToolResult }: { part: any, addToolResult: (result: any) => void }) {
  const callId = part.toolInvocation.toolCallId;

  switch (part.toolInvocation.toolName) {
    case 'askForConfirmation': {
      switch (part.toolInvocation.state) {
        case 'call':
          return (
            <div key={callId} className="text-gray-500">
              {part.toolInvocation.args.message}
              <div className="flex gap-2 mt-2">
                <button
                  className="px-4 py-2 font-bold text-violet-500 bg-white rounded hover:bg-violet-700/30"
                  onClick={() =>
                    addToolResult({
                      toolCallId: callId,
                      result: 'Yes, confirmed.',
                    })
                      }
                >
                  Yes
                </button>
                <button
                  className="px-4 py-2 font-bold text-white bg-red-500/30 rounded hover:bg-red-700"
                  onClick={() =>
                    addToolResult({
                      toolCallId: callId,
                      result: 'No, denied',
                    })
                    }
                >
                  No
                </button>
              </div>
            </div>
          );
        case 'result':
          return (
            <div key={callId} className="text-muted-foreground">
              User response:{' '}
              {part.toolInvocation.result}
            </div>
          );
      }
      break;
    }
    case 'getWeatherInformation': {
      switch (part.toolInvocation.state) {
        case 'call':
          return (
            <div key={callId} className="loading-tool">
              Getting weather information for{' '}
              {part.toolInvocation.args.city}...
            </div>
          );
        case 'result':
          return (
            <div key={callId} className="text-gray-500">
              Weather in {part.toolInvocation.args.city}:{' '}
              {part.toolInvocation.result}
            </div>
          );
      }
      break;
    }
    case 'confirmTask': {
      switch (part.toolInvocation.state) {
        case 'call':
          return (
            <TaskConfirmationCard
              action={part.toolInvocation.args.action}
              type={part.toolInvocation.args.type}
              asset={part.toolInvocation.args.asset}
              cost={part.toolInvocation.args.cost}
              onConfirm={() => {
                addToolResult({
                  toolCallId: callId,
                  result: 'Yes, confirmed.',
                })
              }}
              onCancel={() => {
                addToolResult({
                  toolCallId: callId,
                  result: 'No, denied',
                })
              }}
            />
          );
      }
      break;
    }
    case 'createTask': {
      switch (part.toolInvocation.state) {
        case 'call':
          return (
            <div key={callId} className="loading-tool">
              Creating task...
            </div>
          );
        case 'result':
          return (
            <div key={callId} className="text-gray-500">
              Task created successfully
            </div>
          );
      }
      break;
    }
    case 'searchOnNamespace': {
      switch (part.toolInvocation.state) {
        case 'call':
          return (
            <div key={callId} className="loading-tool">
              Searching on Namespace...
            </div>
          );
        case 'result':
          return (
            <div key={callId} className="mb-1">
              <div className="flex items-center gap-1 text-violeta">
                <BadgeCheck className="w-5 h-5" />
                <span className="text-md">Data verified on</span>
                <span className="text-md font-semibold">{part.toolInvocation.args.namespace}{part.toolInvocation.result.path}</span>
              </div>
            </div>
          );
      }
      break;
    }
    default: {
      switch (part.toolInvocation.state) {
        case 'result':
          return null;
        default:
          return (
            <div key={callId} className="loading-tool">
              {part.toolInvocation.toolName}
            </div>
          );
      }
    }
  }
}