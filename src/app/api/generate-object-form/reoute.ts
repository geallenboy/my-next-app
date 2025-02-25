import { generateObject } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';

export async function POST(request: Request) {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;

    const result = await generateObject({
        model: anthropic('claude-3-5-sonnet-latest'),
        messages: [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: 'Analyze the following PDF and generate a summary.',
                    },
                    {
                        type: 'file',
                        data: await file.arrayBuffer(),
                        mimeType: 'application/pdf',
                    },
                ],
            },
        ],
        schema: z.object({
            summary: z.string().describe('A 50 word sumamry of the PDF.'),
        }),
    });

    return new Response(result.object.summary);
}