import { ToolInvocation, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    toolInvocations?: ToolInvocation[];
}

function getWeather({ city, unit }: { city: any; unit: any }) {
    return { value: 25, description: 'Sunny' };
}

export async function POST(req: Request) {
    const { messages }: { messages: Message[] } = await req.json();

    const result = streamText({
        model: openai('gpt-4o'),
        system: 'You are a helpful assistant.',
        messages,
        tools: {
            getWeather: {
                description: 'Get the weather for a location',
                parameters: z.object({
                    city: z.string().describe('The city to get the weather for'),
                    unit: z
                        .enum(['C', 'F'])
                        .describe('The unit to display the temperature in'),
                }),
                execute: async ({ city, unit }) => {
                    const { value, description } = getWeather({ city, unit });
                    return `It is currently ${value}°${unit} and ${description} in ${city}!`;
                },
            },
        },
    });

    return result.toDataStreamResponse();
}