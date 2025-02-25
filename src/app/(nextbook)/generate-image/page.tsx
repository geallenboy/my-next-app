"use client";
import { useChat } from "@ai-sdk/react";
import Image from "next/image";
import React, { useState } from "react";

const GenerateImage = () => {
  // 添加状态来管理模型选择
  const [selectedModel, setSelectedModel] = useState("openai");

  // useChat 配置，固定 api 并通过 body 传递模型参数
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/generate-image",
    body: {
      model: selectedModel // 将选择的模型作为参数传递给后端
    }
  });

  // 处理模型选择变化
  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value);
  };

  return (
    <div className="flex flex-col w-full max-w-md py-10 mx-auto strokech">
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div className="message">
              <div className="font-bold">{m.role}</div>
              {m.toolInvocations ? (
                m.toolInvocations.map((ti) =>
                  ti.toolName === "generateImage" ? (
                    ti.state === "result" ? (
                      <Image
                        key={ti.toolCallId}
                        src={`data:image/png;base64,${ti.result.image}`}
                        alt={ti.result.prompt}
                        height={400}
                        width={400}
                      />
                    ) : (
                      <div key={ti.toolCallId} className="animate-pulse">
                        Generating image...
                      </div>
                    )
                  ) : null
                )
              ) : (
                <p>{m.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-md mb-8">
        <div className="flex flex-col space-y-2 p-2">
          <select
            value={selectedModel}
            onChange={handleModelChange}
            className="p-2 border border-gray-300 rounded shadow-md"
          >
            <option value="openai">OpenAI</option>
            <option value="google">Google AI</option>
          </select>
          <input
            value={input}
            onChange={handleInputChange}
            type="text"
            placeholder="Say something..."
            className="w-full p-2 border border-gray-300 rounded shadow-xl"
          />
        </div>
      </form>
    </div>
  );
};

export default GenerateImage;
