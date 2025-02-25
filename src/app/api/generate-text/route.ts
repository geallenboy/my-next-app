import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { deepseek } from "@ai-sdk/deepseek";

export async function POST(req: Request) {
    const { prompt }: { prompt: string } = await req.json();
    const { text } = await generateText({
        // model: openai("gpt-4"),
        // model: google("gemini-1.5-pro"),
        model: deepseek("deepseek-chat"),
        system: "You are a helpful assistant.",
        prompt
    });

    return Response.json({ text })
}