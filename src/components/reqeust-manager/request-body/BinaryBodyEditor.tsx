
import { useEffect, useRef, useState } from "react";
import {
  FiArchive,
  FiCode,
  FiFile,
  FiFileText,
  FiImage,
  FiMusic,
  FiTrash2,
  FiUpload,
  FiVideo,
} from "react-icons/fi";
import type { ChangeEvent, DragEvent, KeyboardEvent } from "react";
import type { FileReference } from "../../../types/request-type";

type BinaryBodyEditorProps = {
  initialValue?: FileReference;
  onChange: (value: FileReference | undefined) => void;
};

function getFileIcon(file: FileReference) {
  const mimeType = file.mimeType?.toLowerCase() ?? "";
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (mimeType.startsWith("image/")) return FiImage;
  if (mimeType.startsWith("video/")) return FiVideo;
  if (mimeType.startsWith("audio/")) return FiMusic;

  if (["zip", "gz", "rar", "7z", "tar"].includes(extension)) {
    return FiArchive;
  }

  if (
    ["js", "ts", "tsx", "jsx", "json", "html", "css", "xml", "yml", "yaml"].includes(
      extension
    )
  ) {
    return FiCode;
  }

  if (["txt", "md", "csv", "pdf", "doc", "docx"].includes(extension)) {
    return FiFileText;
  }

  return FiFile;
}

function formatFileSize(size?: number) {
  if (size === undefined || !Number.isFinite(size) || size < 0) {
    return "Size unavailable";
  }

  if (size < 1024) return `${size} B`;
  if (size < 1024 ** 2) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 ** 3) return `${(size / 1024 ** 2).toFixed(1)} MB`;

  return `${(size / 1024 ** 3).toFixed(2)} GB`;
}

function getFileReference(file: File): FileReference {
  return {
    name: file.name,
    mimeType: file.type || undefined,
    size: file.size,
  };
}

async function getFilePayload(file: File): Promise<FileReference> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return {
    ...getFileReference(file),
    dataBase64: btoa(binary),
  };
}

export default function BinaryBodyEditor({
  initialValue,
  onChange,
}: BinaryBodyEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [isDragging, setIsDragging] = useState(false);

  // Metadata may be restored from a saved request, but it is not
  // the original File and cannot be sent as a binary payload.
  const fileInfo = selectedFile
    ? getFileReference(selectedFile)
    : initialValue;

  const isImage = Boolean(fileInfo?.mimeType?.startsWith("image/"));
  const FileIcon = fileInfo ? getFileIcon(fileInfo) : FiFile;

  useEffect(() => {
    if (!selectedFile?.type.startsWith("image/")) {
      setPreviewUrl(undefined);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  async function selectFile(file?: File) {
    if (!file) return;

    setSelectedFile(file);
    onChange(await getFilePayload(file));
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    await selectFile(event.target.files?.[0]);

    // Allow selecting the same file again after removal/replacement.
    event.target.value = "";
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    await selectFile(file);
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    // Avoid flickering when moving between children of the drop zone.
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsDragging(false);
    }
  }

  function handleDropZoneKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  }

  function clearFile() {
    setSelectedFile(undefined);
    onChange(undefined);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div
      className="flex h-full min-h-0 w-full flex-col overflow-auto bg-background-secondary p-4"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        onChange={handleFileChange}
        aria-label="Choose binary request body file"
        tabIndex={-1}
      />

      {fileInfo ? (
        <section
          aria-label="Selected binary body"
          className="flex w-full items-center gap-3 rounded-xs border border-border bg-foreground-light p-3"
        >
          {isImage && previewUrl ? (
            <img
              src={previewUrl}
              width={48}
              height={48}
              alt={`Preview of ${fileInfo.name}`}
              className="shrink-0 me-4 rounded-xs border border-border bg-background object-cover"
            />
          ) : (
            <span className="size-12 me-4 flex shrink-0 items-center justify-center rounded-xs bg-foreground-elevated text-secondary">
              <FileIcon aria-hidden="true" className="h-5 w-5" />
            </span>
          )}

          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm font-semibold text-primary-text"
              title={fileInfo.name}
            >
              {fileInfo.name}
            </p>

            <p className="mt-0.5 truncate text-xs text-secondary-text">
              {fileInfo.mimeType || "Unknown type"}
              <span aria-hidden="true"> · </span>
              {formatFileSize(fileInfo.size)}
            </p>

            {!selectedFile && (
              <p className="mt-1 text-xs text-muted-text">
                File metadata restored. Select the file again to send its
                contents.
              </p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-8 items-center gap-1.5 rounded-xs px-2 text-xs font-semibold text-secondary hover:bg-foreground-elevated hover:text-secondary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <FiUpload aria-hidden="true" />
              Replace
            </button>

            <button
              type="button"
              onClick={clearFile}
              aria-label="Remove selected file"
              title="Remove file"
              className="flex h-8 w-8 items-center justify-center rounded-xs text-secondary-text hover:bg-error/10 hover:text-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <FiTrash2 aria-hidden="true" />
            </button>
          </div>
        </section>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={handleDropZoneKeyDown}
          className={[
            "flex min-h-48 flex-1 flex-col items-center justify-center gap-3 rounded-xs border border-dashed p-6 text-center outline-none transition-colors",
            "focus-visible:ring-2 focus-visible:ring-offset-2",
            isDragging
              ? "border-accent bg-foreground-elevated"
              : "border-border hover:border-secondary",
          ].join(" ")}
        >
          <span className="flex size-16 items-center justify-center rounded-xs bg-foreground-elevated text-secondary-text">
            <FiUpload aria-hidden="true" className="h-7 w-7" />
          </span>

          <p className="text-sm font-semibold text-primary-text">
            {isDragging ? "Drop file to attach" : "Select a file"}
          </p>

          <p className="text-xs text-secondary-text mb-6">
            Drag and drop a file here, or browse your computer.
          </p>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              inputRef.current?.click();
            }}
            className="rounded-xs bg-secondary px-4 py-2 text-xs font-semibold text-background hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Browse files
          </button>
        </div>
      )}
    </div>
  );
}
