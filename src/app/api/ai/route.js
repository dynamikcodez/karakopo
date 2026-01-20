import { NextResponse } from 'next/server';
import { retrieveContext } from '../../../lib/rag';

export async function POST(req) {
    try {
        const { message } = await req.json();
        const context = retrieveContext(message);

        // MVP: Construct a "Smart" response directly from context without external LLM if no key.
        // Usually we would send `context` + `message` to OpenAI/Gemini here.

        // The retrieveContext function now handles conversational formatting and fallbacks.
        const reply = context;

        return NextResponse.json({ reply });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
    }
}
