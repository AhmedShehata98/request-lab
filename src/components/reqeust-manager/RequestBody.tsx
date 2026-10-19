import JsonEditor from "./json-editor/json-editor";
import type { BodyType } from "../../types/request-type";
import { useState } from "react";
import FormDataBodyEditor from "./request-body/FormDataBodyEditor";
import FormUrlencodedBodyEditor from "./request-body/FormUrlencodedBodyEditor";
import BinaryBodyEditor from "./request-body/BinaryBodyEditor";
import { LuCircleAlert } from "react-icons/lu";

export default function RequestBody({ initialValue, onChange }: { initialValue: BodyType, onChange: (value: BodyType) => void }) {
    const [bodyType, setBodyType] = useState<BodyType["mode"]>(initialValue?.mode ?? "none");

    function handleBodyTypeChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const mode = evt.target.dataset.mode as BodyType["mode"];
        if (!mode) return;
        setBodyType(mode);
        const newBody = { ...initialValue, mode } as BodyType;
        onChange(newBody);
    }
    function handleBodyContentChange(content:any) {
        const newBody = { ...initialValue, content ,mode:bodyType} as BodyType;
        onChange(newBody);
    }
    return (
        <div className="w-full h-[350px] flex flex-col items-start justify-start">
            <ul className="w-full flex items-center justify-start px-4 py-2 gap-4 bg-foreground-elevated">
                <li className="flex items-center justify-start gap-1 cursor-pointer">
                    <input type="radio" data-mode="none" name="body-type" id="none-editor" checked={bodyType === "none"} onChange={handleBodyTypeChange} />
                    <label htmlFor="none-editor" className="text-primary-text uppercase text-xs font-bold cursor-pointer">none</label>
                </li>
                <li className="flex items-center justify-start gap-1 cursor-pointer">
                    <input type="radio" data-mode="json" name="body-type" id="json-editor" checked={bodyType === "json"} onChange={handleBodyTypeChange} />
                    <label htmlFor="json-editor" className="text-primary-text uppercase text-xs font-bold cursor-pointer">JSON</label>
                </li>
                <li className="flex items-center justify-start gap-1 cursor-pointer">
                    <input type="radio" data-mode="form-data" name="body-type" id="form-data-editor" checked={bodyType === "form-data"} onChange={handleBodyTypeChange} />
                    <label htmlFor="form-data-editor" className="text-primary-text uppercase text-xs font-bold cursor-pointer">form-data</label>
                </li>
                <li className="flex items-center justify-start gap-1 cursor-pointer">
                    <input type="radio" data-mode="x-www-form-urlencoded" name="body-type" id="x-www-form-urlencoded-editor" checked={bodyType === "x-www-form-urlencoded"} onChange={handleBodyTypeChange} />
                    <label htmlFor="x-www-form-urlencoded-editor" className="text-primary-text uppercase text-xs font-bold cursor-pointer">form-urlencoded</label>
                </li>
                <li className="flex items-center justify-start gap-1 cursor-pointer">
                    <input type="radio" data-mode="binary" name="body-type" id="binary-editor" checked={bodyType === "binary"} onChange={handleBodyTypeChange} />
                    <label htmlFor="binary-editor" className="text-primary-text uppercase text-xs font-bold cursor-pointer">binary</label>
                </li>
            </ul>
            <div className="w-full h-full">
              {bodyType === "none" && <div className="w-full h-full flex flex-col gap-4 items-center justify-center bg-background-elevated">
                    <LuCircleAlert className="text-primary-text w-10 h-10" />
                    <p className="text-primary-text uppercase text-xs font-bold">there is no body for this request</p>
                </div>}
              {bodyType === "json" && <JsonEditor  onChange={handleBodyContentChange} />}
              {bodyType === "form-data" && <FormDataBodyEditor onChange={handleBodyContentChange} />}
              {bodyType === "x-www-form-urlencoded" && <FormUrlencodedBodyEditor onChange={handleBodyContentChange} />}
              {bodyType === "binary" && <BinaryBodyEditor onChange={handleBodyContentChange} />}
            </div>
        </div>
    );
}