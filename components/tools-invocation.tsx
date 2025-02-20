
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