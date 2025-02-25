"use client";

import { useChat } from "@ai-sdk/react";

export default function CallTools() {
  const { messages, input, setInput, append } = useChat({
    api: "/api/call-tools",
    maxSteps: 2
  });

  return (
    <div>
      <input
        value={input}
        onChange={(event) => {
          setInput(event.target.value);
        }}
        className="fixed bottom-0 w-full max-w-xl p-2 mb-8 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
        placeholder="Say something..."
        onKeyDown={async (event) => {
          if (event.key === "Enter") {
            append({ content: input, role: "user" });
          }
        }}
      />
      {messages.map((message, index) => (
        <div key={index}>{message.content}</div>
      ))}
    </div>
  );
}
