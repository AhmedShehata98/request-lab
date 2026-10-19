import { useMemo } from "react";
import JsonResponseViewer from "./JsonResponseViewer";
import "./json-editor.css"
import { ResponseContentKind, type ApiResponse } from "../../../types/response-type";
import { millisecondsToSeconds } from "../../../helpers";
import XmlResponseViewer from "./XmlResponseViewer";
import HtmlResponseViewer from "./HtmlResponseViewer";

export default function ResponseViewer(
    { response }: { response: ApiResponse }) {
    const { data, details } = response || {};

    console.log('response details', { data, details })

    const responseStatus = details.status ?? -1;
    const responseStatusText = details.statusText || (details.ok ? "Ok" : "");
    const responseTime = details.durationMs ?? -1;
    const responseSize = details.sizeBytes ?? -1;

    const responseStatusCodeElementColors = useMemo(() => {
        if (responseStatus >= 200 && responseStatus < 300) {
            return {
                textColor: "#4ADE80",
                backgroundColor: "rgba(74, 222, 128, 0.15)",
            };
        }
        if (responseStatus >= 300 && responseStatus < 400) {
            return {
                textColor: "#60A5FA",
                backgroundColor: "rgba(96, 165, 250, 0.15)",
            };
        }
        if (responseStatus >= 400 && responseStatus < 500) {
            return {
                textColor: "#FBBF24",
                backgroundColor: "rgba(251, 191, 36, 0.15)",
            };
        }
        if (responseStatus >= 500) {
            return {
                textColor: "#FB7185",
                backgroundColor: "rgba(251, 113, 133, 0.15)",
            };
        }
        return {
            textColor: "#AAB6CC",
            backgroundColor: "rgba(170, 182, 204, 0.1)",
        };
    }, [responseStatus]);


    return (
        <div className="w-full flex flex-col items-stretch justify-start px-4 mt-4">
            <header className="w-full bg-foreground-light border-b border-border px-4 py-2 rounded-t-sm flex items-center justify-start gap-4">
                {/* Response status label */}
                <span
                    style={{
                        display: responseStatus > 0 ? "flex" : "none",
                        color: responseStatusCodeElementColors.textColor,
                        backgroundColor: responseStatusCodeElementColors.backgroundColor,
                    }}
                    className="px-2 py-1 rounded-xs text-xs font-semibold font-mono"
                >
                    {responseStatus} {responseStatusText}
                </span>
                {/* Response time label */}
                <span
                    style={{ display: responseStatus > 0 ? "flex" : "none" }}
                    className="text-secondary-text bg-foreground-elevated px-2 py-1 rounded-xs text-xs font-mono"
                >
                    {millisecondsToSeconds(responseTime)} s
                </span>
                {/* Response size label */}
                <span
                    style={{ display: responseStatus > 0 ? "flex" : "none" }}
                    className="text-secondary-text bg-foreground-elevated px-2 py-1 rounded-xs text-xs font-mono"
                >
                    {responseSize} KB
                </span>
                {/* Actions */}
                <ul className="flex items-center justify-start">

                </ul>

            </header>
            <div className="w-full h-[420px] overflow-y-auto flex flex-col items-stretch justify-start">
                {(details.contentKind === ResponseContentKind.JSON || details.contentKind === ResponseContentKind.TEXT) && <JsonResponseViewer value={data} />}
                {details.contentKind === ResponseContentKind.XML && <XmlResponseViewer value={data} />}
                {details.contentKind === ResponseContentKind.HTML && <HtmlResponseViewer value={data} />}
            </div>
        </div>
    );
}
