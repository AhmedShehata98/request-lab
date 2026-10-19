import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsNodePlus } from "react-icons/bs";
import { MdOutlineAdd } from "react-icons/md";
import type { HeaderType } from "../../types/request-type";


export default function RequestHeaders(data: { initialValue: HeaderType[] | null }) {
    const [headers, setHeaders] = useState<HeaderType[]>(
        data.initialValue
            ? data.initialValue.map(p => ({ ...p, id: crypto.randomUUID(), enabled: true }))
            : [{ key: "", value: "", enabled: false, id: crypto.randomUUID() }]
    );


    function addNewHeaderRowHandler() {
        const newRow: HeaderType = {
            key: "",
            value: "",
            enabled: false,
            id: crypto.randomUUID()
        }

        setHeaders(prev => {
            if (prev.length && (!prev[prev.length - 1].key?.trim() || !prev[prev.length - 1].value?.trim())) {
                return prev;
            }
            return [...prev, newRow];
        });
    }

    function deleteHeaderRowHandler(id: string) {
        setHeaders(prev => prev.filter(p => p.id !== id));
    }

    function toggleAllHandler(event: React.ChangeEvent<HTMLInputElement>) {
        setHeaders(prev => prev.map(p => ({ ...p, enabled: event.target.checked })));
    }

    function updateHeaderHandler(data: HeaderType, event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, type, checked } = event.target;
        if (type === 'checkbox') {
            setHeaders(prev => prev.map(p => p.id === data.id ? { ...p, enabled: checked } : p));
        } else if (name === 'key' || name === 'value') {
            setHeaders(prev => prev.map(p => p.id === data.id ? { ...p, [name]: value } : p));
        }
    }

    return (
        <div className="w-full h-[340px] overflow-auto">
            <table className="custom-table">
                <thead>
                    <tr className="custom-thead-tr">
                        <th className="custom-th">
                            <input
                                type="checkbox"
                                checked={headers.length > 0 && headers.every(p => p.enabled)}
                                onChange={toggleAllHandler}
                                className="custom-checkbox"
                                name="check-all"
                                id="check-all"
                            />
                        </th>
                        <th className="custom-th">Key</th>
                        <th className="custom-th">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {headers.map(param => (
                        <tr key={param.id} className="custom-tr">
                            <td className="custom-td">
                                <input
                                    type="checkbox"
                                    checked={param.enabled}
                                    name="enabled"
                                    onChange={(e) => updateHeaderHandler(param, e)}
                                    className="custom-checkbox"
                                />
                            </td>
                            <td className="custom-td-pe">
                                <input
                                    type="text"
                                    name="key"
                                    value={param.key ?? ""}
                                    onChange={(e) => updateHeaderHandler(param, e)}
                                    placeholder="Enter Key"
                                    className="custom-input"
                                />
                            </td>
                            <td className="custom-td-pe">
                                <span className="flex items-center gap-2 justify-start w-full">
                                    <input
                                        type="text"
                                        name="value"
                                        value={param.value ?? ""}
                                        onChange={(e) => updateHeaderHandler(param, e)}
                                        placeholder="Enter Value"
                                        className="custom-input"
                                    />
                                    <span className="flex items-center justify-center">
                                        <button
                                            type="button"
                                            className="flex items-center justify-center rounded-s-xs bg-secondary text-background font-semibold enabled:cursor-pointer enabled:hover:bg-secondary-hover disabled:bg-secondary-dark/30 disabled:text-muted-text disabled:cursor-not-allowed disabled:hover:bg-secondary-dark/30 transition-colors w-10 h-8"
                                            onClick={() => addNewHeaderRowHandler()}
                                            title="Add header row"
                                        >
                                            <BsNodePlus size={18} />
                                        </button>
                                        <button
                                            type="button"
                                            className="flex items-center justify-center rounded-e-xs bg-error/90 text-background font-semibold enabled:cursor-pointer enabled:hover:bg-error disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-error/90 transition-colors w-10 h-8"
                                            onClick={() => deleteHeaderRowHandler(param.id)}
                                            title="Delete header row"
                                        >
                                            <AiOutlineDelete size={18} />
                                        </button>
                                    </span>
                                </span>
                            </td>
                        </tr>
                    ))}
                    {!headers.length && (
                        <tr>
                            <td colSpan={3} className="py-4 px-4 text-center text-secondary-text text-sm font-medium">
                                No headers added yet. Click on the "Add Header" button to add a new header.
                                <button
                                    type="button"
                                    onClick={() => addNewHeaderRowHandler()}
                                    className="flex items-center justify-center gap-2 cursor-pointer text-secondary hover:text-secondary-hover hover:underline justify-self-center mt-3 transition-colors"
                                >
                                    Add Header
                                    <MdOutlineAdd className="text-secondary" size={20} />
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

