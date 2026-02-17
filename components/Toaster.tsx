"use client";

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const Toaster = () => {
    const { toasts, remove } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "pointer-events-auto w-full rounded-md border px-4 py-3 shadow-lg backdrop-blur-md animate-in slide-in-from-bottom-4 fade-in duration-300",
                        toast.variant === "destructive"
                            ? "bg-red-950/90 border-red-800/50 text-red-100"
                            : "bg-[#141414]/95 border-white/10 text-white"
                    )}
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            {toast.title && (
                                <p
                                    className={cn(
                                        "text-sm font-semibold",
                                        toast.variant === "destructive"
                                            ? "text-red-100"
                                            : "text-orange-accent"
                                    )}
                                >
                                    {toast.title}
                                </p>
                            )}
                            {toast.description && (
                                <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                                    {toast.description}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => remove(toast.id)}
                            className="shrink-0 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Toaster;

