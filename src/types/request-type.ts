export type RequestType = {
    id?: string;
    name?: string | null;
    method: string;
    url: string;
    description?: string | null;
    params?: ParamType[] | null;
    headers?: HeaderType[] | null;
    body?: BodyType | null;
    auth?: Record<string, unknown> | null;
};

export type ParamType = {
    key: string;
    value: string;
    enabled: boolean;
    id: string;
}

export type HeaderType = {
    key: string;
    value: string;
    enabled: boolean;
    id: string;
}

export type BodyType =
    | {
        mode: "none";
    }
    | {
        mode: "json";
        content: string;
    }
    // | 
    // {
    //     mode: "text";
    //     content: string;
    //     contentType: string;
    // }
    | {
        mode: "x-www-form-urlencoded";
        params: RequestBodyContent[];
    }
    | {
        mode: "form-data";
        params: FormDataParam[];
    }
    | {
        mode: "binary";
        file?: FileReference;
    };

export interface RequestBodyContent {
    id: string;
    key: string;
    value: string;
    enabled: boolean;
    description?: string;
}

export interface FormDataParam extends RequestBodyContent {
    type: "text" | "file";
    file?: FileReference;
}

export interface FileReference {
    name: string;
    mimeType?: string;
    size?: number;
    /** Base64-encoded contents, included so the body can cross extension messaging. */
    dataBase64?: string;
    // Optional storage reference for files persisted outside the request payload.
    storageKey?: string;
}
