
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter } from "@codemirror/lint";
import { oneDark } from "@codemirror/theme-one-dark";
import "./json-editor.css";

const extensions = [
    json(),
    linter(jsonParseLinter()),
];

type Validation =
    | { status: "empty" }
    | { status: "valid"; data: unknown }
    | { status: "invalid"; error: string };

function validateJson(value: string): Validation {
    if (!value.trim()) {
        return { status: "empty" };
    }

    try {
        return {
            status: "valid",
            data: JSON.parse(value),
        };
    } catch (error) {
        return {
            status: "invalid",
            error:
                error instanceof Error
                    ? error.message
                    : "Invalid JSON",
        };
    }
}

export default function JsonEditor({ value, onChange }: { value?: string, onChange: (value: string) => void }) {
    const [validation, setValidation] = useState<Validation>(
        () => validateJson(value ?? "")
    );

    function handleChange(nextValue: string) {
        onChange(nextValue);
        setValidation(validateJson(nextValue));
    }

    return (
        <section className="json-editor">
            <header className="json-editor__header">
                <div className="json-editor__file">
                    <span aria-hidden="true">{"{}"}</span>
                    <span>payload.json</span>
                </div>

                <span
                    className={`json-editor__status json-editor__status--${validation.status}`}
                    role="status"
                    aria-live="polite"
                >
                    {validation.status === "valid"
                        ? "✓ Valid JSON"
                        : validation.status === "invalid"
                            ? "✕ Invalid JSON"
                            : "Enter JSON"}
                </span>
            </header>

            <CodeMirror
                value={value}
                height="320px"
                theme={oneDark}
                extensions={extensions}
                onChange={handleChange}
                basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                    bracketMatching: true,
                    highlightActiveLine: true,
                    autocompletion: true,
                }}
                aria-label="JSON payload editor"
            />

            {validation.status === "invalid" && (
                <p className="json-editor__error">
                    {validation.error}
                </p>
            )}
        </section>
    );
}
