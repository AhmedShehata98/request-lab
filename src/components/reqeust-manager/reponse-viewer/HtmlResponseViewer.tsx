import { html } from "@codemirror/lang-html";
import ReactCodeMirror, { oneDark } from "@uiw/react-codemirror";

export default function HtmlResponseViewer({ value }: { value: string }) {
    return (
        <ReactCodeMirror
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            extensions={[html()]}
            readOnly={true}
            editable={false}
            theme={oneDark}
        />
    )
}