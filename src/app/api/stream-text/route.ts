import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from "@ai-sdk/google"

export async function POST(req: Request) {
    const { prompt, model }: { prompt: string; model?: string } = await req.json();

    console.log(prompt, "prompt", model)
    if (model === 'google') {
        const result = streamText({
            model: google('gemini-1.5-pro'), // 或者其他你需要的 Gemini 模型
            messages: [{ role: "user", content: prompt }],
        });

        return result.toDataStreamResponse();

    } else if (model === 'openai') {
        const result = streamText({
            model: openai('gpt-4'),
            system: 'You are a helpful assistant.',
            prompt,
        });

        return result.toDataStreamResponse();
    }

}