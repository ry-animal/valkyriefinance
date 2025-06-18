import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = (await req.json()) as { messages: any[] };
  const { messages } = body;

  const result = streamText({
    model: google('gemini-2.0-flash'),
    messages,
  });

  return result.toDataStreamResponse();
}
