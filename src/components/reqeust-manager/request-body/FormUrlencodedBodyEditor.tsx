import { AiOutlineDelete } from "react-icons/ai";
import { BsNodePlus } from "react-icons/bs";
import { MdOutlineAdd } from "react-icons/md";
import type { RequestBodyContent } from "../../../types/request-type";

type FormUrlencodedBodyEditorProps = {
  value: RequestBodyContent[];
  onChange: (value: RequestBodyContent[]) => void;
};

function createRow(): RequestBodyContent {
  return { id: crypto.randomUUID(), key: "", value: "", enabled: false };
}

export default function FormUrlencodedBodyEditor({ value, onChange }: FormUrlencodedBodyEditorProps) {
  function updateParams(update: (current: RequestBodyContent[]) => RequestBodyContent[]) {
    onChange(update(value));
  }

  function addRow() {
    updateParams((current) => {
      const last = current[current.length - 1];
      if (last && (!last.key.trim() || !last.value.trim())) return current;
      return [...current, createRow()];
    });
  }

  function updateRow(id: string, patch: Partial<RequestBodyContent>) {
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
                aria-label="Enable all form-urlencoded fields"
                checked={value.length > 0 && value.every((param) => param.enabled)}
                onChange={(event) => updateParams((current) => current.map((param) => ({ ...param, enabled: event.target.checked })))}
                className="custom-checkbox"
              />
            </th>
            <th className="custom-th">Key</th>
            <th className="custom-th">Value</th>
            <th className="custom-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {value.map((param) => (
            <tr key={param.id} className="custom-tr">
              <td className="custom-td">
                <input
                  type="checkbox"
                  aria-label={`Enable ${param.key || "form-urlencoded field"}`}
                  checked={param.enabled}
                  onChange={(event) => updateRow(param.id, { enabled: event.target.checked })}
                  className="custom-checkbox"
                />
              </td>
              <td className="custom-td-pe">
                <input
                  value={param.key}
                  onChange={(event) => updateRow(param.id, { key: event.target.value })}
                  placeholder="Enter Key"
                  aria-label="Form-urlencoded key"
                  className="custom-input"
                />
              </td>
              <td className="custom-td-pe">
                <input
                  value={param.value}
                  onChange={(event) => updateRow(param.id, { value: event.target.value })}
                  placeholder="Enter Value"
                  aria-label="Form-urlencoded value"
                  className="custom-input"
                />
              </td>
              <td className="custom-td-pe">
                <span className="flex items-center">
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-s-xs bg-secondary text-background enabled:cursor-pointer enabled:hover:bg-secondary-hover transition-colors px-1.5 py-1"
                    onClick={addRow}
                    title="Add form-urlencoded row"
                    aria-label="Add form-urlencoded row"
                  >
                    <BsNodePlus size={18} />
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center rounded-e-xs bg-error/90 text-background enabled:cursor-pointer enabled:hover:bg-error transition-colors px-1.5 py-1"
                    onClick={() => updateParams((current) => current.filter((item) => item.id !== param.id))}
                    title="Delete form-urlencoded row"
                    aria-label="Delete form-urlencoded row"
                  >
                    <AiOutlineDelete size={18} />
                  </button>
                </span>
              </td>
            </tr>
          ))}
          {!value.length && (
            <tr>
              <td colSpan={4} className="py-4 px-4 text-center text-secondary-text text-sm font-medium">
                No form-urlencoded fields added yet. Click below to add one.
                <button
                  type="button"
                  onClick={() => onChange([createRow()])}
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
