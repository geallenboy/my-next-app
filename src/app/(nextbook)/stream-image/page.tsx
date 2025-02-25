"use client";
import React, { useState, useRef, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";

const StreamImage = () => {
  const [selectedModel, setSelectedModel] = useState("openai");
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [messages, setMessages] = useState<any>([]);
  const resultRef = useRef<any>(null);

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

  // 处理图像选择
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 点击“生成”按钮
  const handleComplete = async () => {
    if (!inputText && !selectedImage) return;

    const userMessage: any = {
      id: Date.now(),
      role: "user",
      content: inputText
    };

    if (selectedImage) {
      userMessage.image = imagePreview; // 将图像的base64数据加入消息
    }

    const aiPlaceholderMessage = {
      id: Date.now() + 1,
      role: "ai",
      content: ""
    };

    setMessages((prevMessages: any) => [...prevMessages, userMessage, aiPlaceholderMessage]);

    // 如果有图片，创建一个FormData对象
    const formData = new FormData();
    formData.append("prompt", inputText);
    formData.append("model", selectedModel);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    await complete(inputText, {
      body: formData,
      headers: selectedImage ? {} : { "Content-Type": "application/json" } // 如果有图片，不设置Content-Type
    });

    // 清空输入和图片
    setInputText("");
    setSelectedImage(null);
    setImagePreview(null);
  };

  // 更新AI消息内容
  useEffect(() => {
    if (completion) {
      setMessages((prevMessages: any) => {
        const newMessages = [...prevMessages];
        for (let i = newMessages.length - 1; i >= 0; i--) {
          if (newMessages[i].role === "ai") {
            newMessages[i] = { ...newMessages[i], content: completion };
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
            {m.image && <img src={m.image} alt="User uploaded" className="max-w-xs my-2" />}
            <div>{m.content}</div>
          </div>
        ))}
      </div>

      {/* 输入和模型选择区域 */}
      <div className="p-4 bg-white border-t">
        <div className="space-y-4">
          {/* 图像上传区域 */}
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border rounded p-2"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover" />
            )}
          </div>

          {/* 文本输入和控制区域 */}
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
    </div>
  );
};

export default StreamImage;
