import ReactCodeMirror, { oneDark } from '@uiw/react-codemirror'
import { xml } from '@codemirror/lang-xml'

function XmlResponseViewer({ value }: { value: string }) {
    return (
        <ReactCodeMirror
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            extensions={[xml()]}
            readOnly={true}
            editable={false}
            theme={oneDark}
        />
    )
}

export default XmlResponseViewer