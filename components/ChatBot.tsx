"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageSquare, X, Send, Sparkles, Trash2 } from "lucide-react";
import "@/styles/chatbot.css";

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

function formatMarkdown(text: string) {
    let html = text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`(.*?)`/g, "<code>$1</code>")
        .replace(/\n/g, "<br />");

    html = html.replace(
        /(?:^|<br \/>)[-•]\s+(.*?)(?=<br \/>|$)/g,
        "<li>$1</li>"
    );
    if (html.includes("<li>")) {
        html = "<ul>" + html.match(/<li>[\s\S]*<\/li>/)?.[0] + "</ul>";
        html = html.replace(/(<\/li>)(?!<li>|<\/ul>)([\s\S]*?)(<li>|<\/ul>)/g, "$1$3");
    }

    return html;
}

export default function ChatBot({ userId }: { userId?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading, scrollToBottom]);

    useEffect(() => {
        if (isOpen && !historyLoaded && userId) {
            fetch("/api/chat")
                .then((res) => res.json())
                .then((data) => {
                    if (data.messages?.length > 0) {
                        setMessages(
                            data.messages.map((m: ChatMessage) => ({
                                role: m.role,
                                content: m.content,
                            }))
                        );
                    }
                    setHistoryLoaded(true);
                })
                .catch(() => setHistoryLoaded(true));
        }
    }, [isOpen, historyLoaded, userId]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    if (!userId) return null;

    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        const userMsg: ChatMessage = { role: "user", content: trimmed };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: trimmed }),
            });

            const data = await res.json();
            if (data.reply) {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: data.reply },
                ]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Sorry, something went wrong. Please try again.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = async () => {
        try {
            await fetch("/api/chat", { method: "DELETE" });
            setMessages([]);
        } catch {
            /* ignore */
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                className={`chatbot-fab ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? <X /> : <MessageSquare />}
            </button>

            {/* Chat Panel */}
            <div className={`chatbot-panel ${isOpen ? "visible" : ""}`}>
                {/* Header */}
                <div className="chatbot-header">
                    <div className="chatbot-header-icon">
                        <Sparkles />
                    </div>
                    <div className="chatbot-header-info">
                        <div className="chatbot-header-title">Codex AI</div>
                        <div className="chatbot-header-status">
                            Library assistant
                        </div>
                    </div>
                    <div className="chatbot-header-actions">
                        {messages.length > 0 && (
                            <button
                                className="chatbot-header-btn"
                                onClick={handleClear}
                                title="Clear chat"
                            >
                                <Trash2 size={15} />
                            </button>
                        )}
                        <button
                            className="chatbot-header-btn close"
                            onClick={() => setIsOpen(false)}
                            title="Close"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                <div className="chatbot-messages">
                    {messages.length === 0 && !isLoading && (
                        <div className="chatbot-welcome">
                            <div className="chatbot-welcome-icon">
                                <Sparkles />
                            </div>
                            <h3>Hey there! 👋</h3>
                            <p>
                                I&apos;m your library assistant. Ask me about
                                books, borrowing, or anything library-related!
                            </p>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`chatbot-msg ${msg.role}`}>
                            {msg.role === "assistant" ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: formatMarkdown(msg.content),
                                    }}
                                />
                            ) : (
                                msg.content
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="chatbot-typing">
                            <span />
                            <span />
                            <span />
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="chatbot-input-area">
                    <input
                        ref={inputRef}
                        className="chatbot-input"
                        type="text"
                        placeholder="Ask me anything..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                    <button
                        className="chatbot-send-btn"
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        aria-label="Send message"
                    >
                        <Send />
                    </button>
                </div>
            </div>
        </>
    );
}
