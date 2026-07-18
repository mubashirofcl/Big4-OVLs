"use client";

import { useState, useEffect } from "react";

interface PromptData {
    title: string;
    prompt: string;
}

interface UsePromptFileResult {
    status: "idle" | "loading" | "success" | "error";
    data: PromptData | null;
    error: string | null;
}

// Global in-memory cache to avoid refetching during the session
const promptCache: Record<string, PromptData> = {};

export function usePromptFile(category: string | null): UsePromptFileResult {
    const [status, setStatus] = useState<UsePromptFileResult["status"]>("idle");
    const [data, setData] = useState<PromptData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!category) {
            setStatus("idle");
            setData(null);
            setError(null);
            return;
        }

        if (promptCache[category]) {
            setStatus("success");
            setData(promptCache[category]);
            setError(null);
            return;
        }

        let isMounted = true;

        const fetchPrompt = async () => {
            setStatus("loading");
            setData(null);
            setError(null);

            try {
                const res = await fetch(`/prompts/${category}.json`);
                if (!res.ok) {
                    throw new Error(`Failed to load: ${res.status} ${res.statusText}`);
                }

                const json = await res.json();
                
                if (isMounted) {
                    promptCache[category] = json;
                    setData(json);
                    setStatus("success");
                }
            } catch (err: any) {
                if (isMounted) {
                    setError("Couldn't load this prompt.");
                    setStatus("error");
                }
            }
        };

        fetchPrompt();

        return () => {
            isMounted = false;
        };
    }, [category]);

    return { status, data, error };
}
