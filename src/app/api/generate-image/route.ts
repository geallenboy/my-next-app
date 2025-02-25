
import { openai } from "@ai-sdk/openai"
import { google } from "@ai-sdk/google"
import { experimental_generateImage, Message, streamText, tool } from 'ai';
import { z } from 'zod';

export async function POST(request: Request) {
    const { messages, model }: { messages: Message[]; model?: string } = await request.json();
    /**
     * 这段代码的目的是在消息数组中查找特定类型的工具调用结果（生成图片的结果），并将其中可能很长的 base64 图片数据替换为简短的占位符 'redacted-for-length'。
        这样可以避免将冗长的图片数据发送给模型（例如 AI 模型），从而减少数据传输量，提高处理效率。
     */
    const formattedMessages = messages.map(m => {
        if (m.role === 'assistant' && m.toolInvocations) {
            m.toolInvocations.forEach(ti => {
                if (ti.toolName === 'generateImage' && ti.state === 'result') {
                    ti.result.image = `redacted-for-length`;
                }
            });
        }
        return m;
    });
    if (model === 'google') {
        const result = streamText({
            model: google('gemini-1.5-pro'), // 修改为 Google 的 Gemini 模型
            messages: formattedMessages,
            tools: {
                generateImage: tool({
                    description: 'Generate an image from a text prompt',
                    parameters: z.object({
                        prompt: z.string().describe('The text prompt to generate an image for'),
                    }),
                    execute: async ({ prompt }) => {
                        console.log(prompt, "prompt")
                        // 使用 Gemini 1.5 Flash 模型生成图片
                        // const { image } = await experimental_generateImage({
                        //     model: google('gemini-1.5-flash'), // 支持图片生成的模型
                        //     // model: google.imageModel('gemini-1.5-flash'), // 支持图片生成的模型
                        //     prompt
                        // });
                        // return { image: image.base64, prompt };
                        return { prompt }
                    }
                }),
            }
        });
        return result.toDataStreamResponse();
    } else if (model === 'openai') {
        const result = streamText({
            model: openai('gpt-4o'),
            messages: formattedMessages,
            tools: {
                generateImage: tool({
                    description: 'Generate an image from a text prompt',
                    parameters: z.object({
                        prompt: z.string().describe('The text prompt to generate an image for'),
                    }),
                    execute: async ({ prompt }) => {
                        const { image } = await experimental_generateImage({
                            model: openai.image("dall-e-3"),
                            prompt
                        });
                        return { image: image.base64, prompt }
                    }

                }),
            }
        })
        return result.toDataStreamResponse();
    }

    return new Response('{"error":"model not found"}', {
        status: 404
    });
}