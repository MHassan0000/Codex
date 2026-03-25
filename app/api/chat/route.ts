import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { chatMessages } from "@/database/schema";
import { eq, asc } from "drizzle-orm";
import config from "@/lib/config";
import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/database/redis";

const MAX_MESSAGE_LENGTH = 2000;

const chatRatelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1m"),
    prefix: "@codex/chat-ratelimit",
});

const SYSTEM_PROMPT = `You are Codex AI, a friendly and knowledgeable library assistant for a university library management system called Codex. You help students with:
- Finding and recommending books
- Understanding library policies (borrowing periods, return policies, late fees)
- Navigating the Codex platform features
- General academic and reading-related questions

Keep responses concise, warm, and helpful. Use a friendly but professional tone. If asked about something unrelated to libraries or academics, politely redirect the conversation. Format responses with markdown when helpful.`;

function mergeConsecutiveRoles(messages: { role: string; content: string }[]) {
    const merged: { role: string; content: string }[] = [];
    for (const msg of messages) {
        const last = merged[merged.length - 1];
        if (last && last.role === msg.role) {
            last.content += "\n" + msg.content;
        } else {
            merged.push({ ...msg });
        }
    }
    return merged;
}

async function callGemini(messages: { role: string; content: string }[]) {
    const apiKey = config.env.ai.geminiApiKey;
    if (!apiKey) return null;

    const safeMessages = mergeConsecutiveRoles(messages);

    const geminiMessages = safeMessages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content.slice(0, 1000) }],
    }));

    if (geminiMessages.length === 0) return null;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents: geminiMessages,
            }),
        }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

async function callOpenRouter(messages: { role: string; content: string }[]) {
    const apiKey = config.env.ai.openRouterApiKey;
    if (!apiKey) throw new Error("No AI API key configured");

    const trimmedMessages = messages.map((m) => ({
        role: m.role,
        content: m.content.slice(0, 1000),
    }));

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: "google/gemini-2.0-flash-001",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...trimmedMessages,
            ],
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`OpenRouter error: ${err}`);
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
}

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const history = await db
        .select({
            role: chatMessages.role,
            content: chatMessages.content,
            createdAt: chatMessages.createdAt,
        })
        .from(chatMessages)
        .where(eq(chatMessages.userId, session.user.id))
        .orderBy(asc(chatMessages.createdAt))
        .limit(50);

    return NextResponse.json({ messages: history });
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { success } = await chatRatelimit.limit(session.user.id);
        if (!success) {
            return NextResponse.json(
                { error: "Too many messages. Please wait a moment." },
                { status: 429 }
            );
        }
    } catch (e) {
        console.log("Chat rate limit check failed, allowing request:", e);
    }

    const { message } = await req.json();
    if (!message || typeof message !== "string" || message.trim().length === 0) {
        return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const userMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH);

    await db.insert(chatMessages).values({
        userId: session.user.id,
        role: "user",
        content: userMessage,
    });

    const history = await db
        .select({ role: chatMessages.role, content: chatMessages.content })
        .from(chatMessages)
        .where(eq(chatMessages.userId, session.user.id))
        .orderBy(asc(chatMessages.createdAt))
        .limit(20);

    let reply: string;
    try {
        const geminiReply = await callGemini(history);
        reply = geminiReply || (await callOpenRouter(history));
    } catch {
        reply = "Sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }

    await db.insert(chatMessages).values({
        userId: session.user.id,
        role: "assistant",
        content: reply,
    });

    return NextResponse.json({ reply });
}

export async function DELETE() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
        .delete(chatMessages)
        .where(eq(chatMessages.userId, session.user.id));

    return NextResponse.json({ success: true });
}
