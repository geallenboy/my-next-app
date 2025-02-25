"use client";
import React, { useState, useRef, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";

const StreamText = () => {
  const [selectedModel, setSelectedModel] = useState("openai");
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<any>([]);
  const resultRef = useRef<any>(null);

  // 从 ai-sdk/react 获取流式返回
  const { completion, complete } = useCompletion({
    api: "/api/stream-text",
    body: { model: selectedModel, messages }
  });

  // 滚动到底部
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [messages]);

  // 点击“生成”按钮
  const handleComplete = async () => {
    // 1. 先把用户输入加入 messages
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: inputText
    };

    // 2. 预先插入一条占位的 AI 消息，内容先为空
    //    这样流式更新时就只需要更新这条消息，而不会重复插入多个
    const aiPlaceholderMessage = {
      id: Date.now() + 1,
      role: "ai",
      content: "" // 占位
    };

    setMessages((prevMessages: any) => [...prevMessages, userMessage, aiPlaceholderMessage]);

    // 3. 触发请求
    await complete(inputText);

    // 4. 清空输入框
    setInputText("");
  };

  // 当 completion（流式内容）更新时，修改最后那条 AI 消息的 content
  useEffect(() => {
    if (completion) {
      setMessages((prevMessages: any) => {
        // 找到最后一条 AI 消息
        const newMessages = [...prevMessages];
        for (let i = newMessages.length - 1; i >= 0; i--) {
          if (newMessages[i].role === "ai") {
            // 用最新的 completion 更新它的 content
            newMessages[i] = {
              ...newMessages[i],
              content: completion
            };
            break;
          }
        }
        return newMessages;
      });
    }
  }, [completion]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 聊天消息显示区域 */}
      <div ref={resultRef} className="flex-grow p-4 overflow-y-auto">
        {messages.map((m: any) => (
          <div
            key={m.id}
            className={`mb-2 p-3 rounded-lg ${
              m.role === "user" ? "bg-blue-100 self-end" : "bg-gray-200 self-start"
            }`}
          >
            <div className="font-semibold">{m.role === "user" ? "用户" : "AI"}：</div>
            <div>{m.content}</div>
          </div>
        ))}
      </div>

      {/* 输入和模型选择区域 */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-grow border rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="输入你的问题..."
          />
          <button
            onClick={handleComplete}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            生成
          </button>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="border rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="openai">OpenAI</option>
            <option value="google">Google</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StreamText;
