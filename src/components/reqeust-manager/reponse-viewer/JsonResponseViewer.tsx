
import CodeMirror, { oneDark } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";

export default function JsonResponseViewer({ value }: { value: string }) {
    return (
        <CodeMirror
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            extensions={[javascript(), json()]}
            readOnly={true}
            editable={false}
            theme={oneDark}
        />
    );
}
