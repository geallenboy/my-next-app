import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 60;

export async function POST(req: Request) {
    const { messages } = await req.json() as any;

    const result = streamText({
        system:
            'You are a helpful assistant. Respond to the user in Markdown format.',
        model: openai('gpt-4o'),
        messages,
    });

    return result.toDataStreamResponse();
}