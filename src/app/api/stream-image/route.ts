import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
    // 使用 FormData 处理图像和文本
    const formData = await req.formData();
    const prompt = formData.get("prompt") as string;
    const model = formData.get("model") as string;
    const image = formData.get("image") as File | null;

    console.log(prompt, "prompt", model, image ? "Image received" : "No image");

    // 如果有图像，将其转换为base64
    let imageBase64: string | undefined;
    if (image) {
        const arrayBuffer = await image.arrayBuffer();
        imageBase64 = Buffer.from(arrayBuffer).toString("base64");
    }

    if (model === 'google') {
        const messages = [
            { role: "user", content: prompt },
            ...(imageBase64 ? [{
                role: "user",
                content: [
                    { type: "text", text: "请分析这张图片并结合提示回答" },
                    { type: "image_url", image_url: `data:image/jpeg;base64,${imageBase64}` }
                ]
            }] : [])
        ] as any;

        const result = streamText({
            model: google('gemini-1.5-pro'),
            messages,
        });

        return result.toDataStreamResponse();

    } else if (model === 'openai') {
        const messages: any = [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
            ...(imageBase64 ? [{
                role: "user",
                content: [
                    { type: "text", text: "请分析这张图片并结合提示回答" },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
                ]
            }] : [])
        ];

        const result = streamText({
            model: openai('gpt-4o'), // 使用支持图像的模型，如 gpt-4o
            messages,
        });

        return result.toDataStreamResponse();
    }

    return new Response("Invalid model", { status: 400 });
}