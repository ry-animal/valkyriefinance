import { google } from '@ai-sdk/google';
import { convertToCoreMessages, streamText } from 'ai';
import { type NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequestBody {
  messages: ChatMessage[];
}

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChatRequestBody;
  const { messages } = body;

  try {
    const result = await streamText({
      model: google('gemini-1.5-pro'),
      messages: convertToCoreMessages(messages),
      system: `You are a helpful AI assistant for Valkyrie Finance, a DeFi platform.
      You help users with:
      - Portfolio optimization and analysis
      - DeFi yield farming strategies
      - Risk assessment and management
      - Cross-chain bridge operations
      - Market analysis and insights

      Always provide accurate, helpful information about DeFi and blockchain technologies.
      If you're unsure about something, be honest about the limitations.`,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
}
