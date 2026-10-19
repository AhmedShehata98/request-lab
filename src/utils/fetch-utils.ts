import { ResponseContentKind, ResponseStorageType, type ApiResponse } from "../types/response-type";
import type { RequestType } from "../types/request-type";

type ParsedBodyContent = {
    kind: ResponseContentKind;
    storageType: ResponseStorageType;
    value: unknown;
}
async function _parseBodyContent(response: Response) {
    const contentType = response.headers.get("content-type") ?? "";
    let content: ParsedBodyContent;

    const mediaType = contentType
        ?.split(";")[0]
        .trim()
        .toLowerCase();

    console.log('parse body content', {
        contentType,
        mediaType,
    })


    if (mediaType === "application/json" ||
        mediaType?.endsWith("+json")) {
        try {
            content = {
                kind: ResponseContentKind.JSON,
                storageType: ResponseStorageType.STRING,
                value: await response.json(),
            };
        } catch {
            content = {
                kind: ResponseContentKind.TEXT,
                storageType: ResponseStorageType.STRING,
                value: await response.text(),
            };
        }
    } else if (mediaType === "text/html") {
        content = {
            kind: ResponseContentKind.HTML,
            storageType: ResponseStorageType.STRING,
            value: await response.text(),
        };

    } else if (mediaType === "application/xml" ||
        mediaType === "text/xml" ||
        mediaType?.endsWith("+xml")) {
        content = {
            kind: ResponseContentKind.XML,
            storageType: ResponseStorageType.STRING,
            value: await response.text(),
        };
    } else if (mediaType?.startsWith("text/")) {
        content = {
            kind: ResponseContentKind.TEXT,
            storageType: ResponseStorageType.STRING,
            value: await response.text(),
        };
    } else {
        content = {
            kind: ResponseContentKind.UNKNOWN,
            storageType: ResponseStorageType.STRING,
            value: await response.text(),
        };
    }
    return content;
}

export async function executeRequest(data: RequestType): Promise<ApiResponse> {
    const start = performance.now();
    const urlInstance = new URL(data.url);

    console.log('request payload', data)
    console.log('request body', data.body)

    let requestHeaders: Headers | undefined;
    if (data.headers && data.headers.length > 0) {
        const headerMap = new Headers();
        for (const item of data.headers.filter(item => item.enabled)) {
            headerMap.set(item.key, item.value);
        }
        requestHeaders = headerMap;
    }

    let requestBody: BodyInit | undefined;
    if (data.body) {
        switch ((data.body).mode) {
            case "json":
                requestBody = (data.body).content;
                break;
            case "form-data":
                const formData = new FormData();
                for (const item of (data.body).params.filter(item => item.enabled)) {
                    formData.append(item.key, item.value);
                }
                requestBody = formData;
                break;
            case "x-www-form-urlencoded":
                const urlSearchParams = new URLSearchParams();
                for (const item of (data.body).params.filter(item => item.enabled)) {
                    urlSearchParams.set(item.key, item.value);
                }
                requestBody = urlSearchParams.toString();
                break;
            // case "binary":
            //     requestBody = (data.body).file?.storageKey;
            //     break;
            case "none":
                requestBody = undefined;
                break;
        }
    }

    if (data.params && data.params.length > 0) {
        const searchParams = new URLSearchParams();
        for (const item of data.params.filter(item => item.enabled)) {
            searchParams.set(item.key, item.value);
        }
        urlInstance.search = searchParams.toString();
    }



    const response = await fetch(urlInstance, {
        method: data.method,
        headers: requestHeaders,
        body: requestBody,
    });
    const durationMs = performance.now() - start;

    const headers = Object.fromEntries((response.headers as any).entries());
    const contentType = response.headers.get("content-type") ?? "";

    const parsedBodyContent = await _parseBodyContent(response);

    return {
        details: {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            url: response.url,
            redirected: response.redirected,
            headers,
            contentKind: parsedBodyContent.kind,
            storageType: parsedBodyContent.storageType,
            contentType,
            durationMs,
            sizeBytes: 0,
        },
        data: parsedBodyContent.value
    };
}
