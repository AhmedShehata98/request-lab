import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsNodePlus } from "react-icons/bs";
import { MdOutlineAdd } from "react-icons/md";
import type { FormDataParam } from "../../../types/request-type";

type FormDataBodyEditorProps = {
  initialValue?: FormDataParam[];
  onChange: (value: FormDataParam[]) => void;
};

function createRow(): FormDataParam {
  return { id: crypto.randomUUID(), key: "", value: "", enabled: false, type: "text" };
}

export default function FormDataBodyEditor({ initialValue = [], onChange }: FormDataBodyEditorProps) {
  const [params, setParams] = useState<FormDataParam[]>(() =>
    initialValue.length ? initialValue.map((param) => ({ ...param })) : [createRow()]
  );

  function updateParams(update: (current: FormDataParam[]) => FormDataParam[]) {
    const next = update(params);
    setParams(next);
    onChange(next);
  }

  function addRow() {
    updateParams((current) => {
      const last = current[current.length - 1];
      if (last && (!last.key.trim() || !last.value.trim())) return current;
      return [...current, createRow()];
    });
  }

  function updateRow(id: string, patch: Partial<FormDataParam>) {
    updateParams((current) => current.map((param) => param.id === id ? { ...param, ...patch } : param));
  }

  return (
    <div className="w-full h-80 overflow-auto">
      <table className="custom-table">
        <thead>
          <tr className="custom-thead-tr">
            <th className="custom-th">
              <input
                type="checkbox"
                aria-label="Enable all form-data fields"
                checked={params.length > 0 && params.every((param) => param.enabled)}
                onChange={(event) => updateParams((current) => current.map((param) => ({ ...param, enabled: event.target.checked })))}
                className="custom-checkbox"
              />
            </th>
            <th className="custom-th">Key</th>
            <th className="custom-th">Value</th>
            <th className="custom-th">Type</th>
          </tr>
        </thead>
        <tbody>
          {params.map((param) => (
            <tr key={param.id} className="custom-tr">
              <td className="custom-td">
                <input
                  type="checkbox"
                  aria-label={`Enable ${param.key || "form-data field"}`}
                  checked={param.enabled}
                  onChange={(event) => updateRow(param.id, { enabled: event.target.checked })}
                  className="custom-checkbox"
                />
              </td>
              <td className="custom-td-pe">
                <input
                  value={param.key ?? ""}
                  onChange={(event) => updateRow(param.id, { key: event.target.value })}
                  placeholder="Enter Key"
                  aria-label="Form-data key"
                  className="custom-input"
                />
              </td>
              <td className="custom-td-pe">
                {param.type === "file" ? (
                  <input
                    type="file"
                    aria-label="Choose form-data file"
                    className="custom-input file:mr-3 file:rounded-xs file:border-0 file:bg-secondary file:px-3 file:py-1 file:text-background file:cursor-pointer"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      updateRow(param.id, {
                        value: file.name,
                        file: { name: file.name, mimeType: file.type || undefined, size: file.size },
                      });
                    }}
                  />
                ) : (
                  <input
                    value={param.value ?? ""}
                    onChange={(event) => updateRow(param.id, { value: event.target.value })}
                    placeholder="Enter Value"
                    aria-label="Form-data value"
                    className="custom-input"
                  />
                )}
              </td>
              <td className="custom-td-pe">
                <span className="flex items-center">
                  <select
                    value={param.type ?? "text"}
                    onChange={(event) => updateRow(param.id, { type: event.target.value as FormDataParam["type"] })}
                    aria-label="Form-data field type"
                    className="custom-input me-4 w-28"
                  >
                    <option value="text">Text</option>
                    <option value="file">File</option>
                  </select>
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-s-xs bg-secondary text-background enabled:cursor-pointer enabled:hover:bg-secondary-hover transition-colors px-1.5 py-1"
                    onClick={addRow}
                    title="Add form-data row"
                    aria-label="Add form-data row"
                  >
                    <BsNodePlus size={18} />
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-e-xs bg-error/90 text-background enabled:cursor-pointer enabled:hover:bg-error transition-colors px-1.5 py-1"
                    onClick={() => updateParams((current) => current.filter((item) => item.id !== param.id))}
                    title="Delete form-data row"
                    aria-label="Delete form-data row"
                  >
                    <AiOutlineDelete size={18} />
                  </button>
                </span>
              </td>
            </tr>
          ))}
          {!params.length && (
            <tr>
              <td colSpan={4} className="py-4 px-4 text-center text-secondary-text text-sm font-medium">
                No form-data fields added yet. Click below to add one.
                <button
                  type="button"
                  onClick={() => updateParams(() => [createRow()])}
                  className="flex items-center justify-center gap-2 cursor-pointer text-secondary hover:text-secondary-hover hover:underline justify-self-center mt-3 transition-colors"
                >
                  Add Field <MdOutlineAdd className="text-secondary" size={20} />
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
