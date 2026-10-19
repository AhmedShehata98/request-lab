export const ResponseContentKind = {
    JSON: "json",
    HTML: "html",
    TEXT: "text",
    XML: "xml",
    BINARY: "binary",
    UNKNOWN: "unknown",
} as const;

export const ResponseStorageType = {
    STRING: "string",
    ARRAY_BUFFER: "arraybuffer",
    BLOB: "blob",
    NULL: "null",
}

export type ResponseContentKind =
    (typeof ResponseContentKind)[keyof typeof ResponseContentKind];

export type ResponseStorageType =
    (typeof ResponseStorageType)[keyof typeof ResponseStorageType];

export interface ApiResponseDetails {
    status: number;
    statusText: string;
    ok: boolean;
    url: string;
    redirected: boolean;
    headers: Record<string, string>;
    contentType: string | null;
    contentKind: ResponseContentKind;
    storageType: ResponseStorageType;
    durationMs: number;
    sizeBytes?: number;
}

export interface ApiResponse {
    details: ApiResponseDetails;
    data: any;
}