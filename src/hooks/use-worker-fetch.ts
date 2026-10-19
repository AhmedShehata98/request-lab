import { useState } from "react";
import { REQUEST_TO_NETWORK } from "../constants/events";
import type { RequestType } from "../types/request-type";
import type { ApiResponse } from "../types/response-type";

export default function useWorkerFetch() {
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);

    async function fetchNetworkRequest(request: RequestType) {
        try {
            setLoading(true);
            setError(null);
            if (typeof chrome === "undefined" ||
                typeof chrome.runtime === "undefined" ||
                typeof chrome.runtime?.sendMessage === "undefined"
            ) {
                setError(new Error("Chrome runtime not available"));
                setLoading(false);
                return;
            }
            const result = await chrome.runtime.sendMessage({ type: REQUEST_TO_NETWORK, payload: request });
            if (chrome.runtime.lastError) {
                setError(chrome.runtime.lastError as Error);
            } else if (!result?.ok) {
                setError(new Error(result?.error ?? "Request could not be executed"));
            } else {
                setResponse(result.response as ApiResponse);
            }
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    }
    return { fetchNetworkRequest, response, error, loading };
}
