import { NextResponse } from 'next/server';
import { retrieveContext } from '../../../lib/rag';

export async function POST(req) {
    try {
        const { message } = await req.json();
        const context = retrieveContext(message);

        if (!context) {
            return NextResponse.json({
                reply: "I couldn't find any specific meals or ingredients matching that. Try asking about 'rice', 'soup', or check our budget options!"
            });
        }

        // MVP: Construct a "Smart" response directly from context without external LLM if no key.
        // Ideally we would send `context` + `message` to OpenAI/Gemini here.
        // For this demo, we format the context politely.

        const reply = `Here's what I found from our store:\n\n${context}\n\nYou can add these directly to your planner!`;

        return NextResponse.json({ reply });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
    }
}
