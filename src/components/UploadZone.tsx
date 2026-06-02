"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload, FileText, AlertCircle } from "lucide-react";

interface UploadZoneProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
}

export default function UploadZone({ onFileAccepted, disabled }: UploadZoneProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setError(null);
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors.some((e) => e.code === "file-invalid-type")) {
          setError("Only PDF files are accepted.");
        } else if (rejection.errors.some((e) => e.code === "too-many-files")) {
          setError("Please upload one PDF at a time.");
        } else {
          setError("File rejected. Please try again.");
        }
        return;
      }
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative group cursor-pointer rounded-2xl border-2 border-dashed
          transition-all duration-300 ease-out
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${isDragReject
            ? "border-red-400 bg-red-50"
            : isDragActive
              ? "border-red-500 bg-red-50/50 scale-[1.01]"
              : "border-stone-300 hover:border-red-400 bg-white hover:bg-red-50/30"
          }
        `}
        style={{ minHeight: "240px" }}
      >
        <input {...getInputProps()} id="pdf-upload-input" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          {/* Icon container */}
          <div
            className={`
              w-20 h-20 rounded-2xl flex items-center justify-center mb-6
              transition-all duration-300
              ${isDragActive
                ? "bg-red-100 scale-110"
                : "bg-stone-100 group-hover:bg-red-100 group-hover:scale-105"
              }
            `}
          >
            {isDragActive ? (
              <FileText className="w-10 h-10 text-red-500" strokeWidth={1.5} />
            ) : (
              <Upload
                className={`w-10 h-10 transition-colors duration-300 ${
                  isDragReject ? "text-red-400" : "text-stone-400 group-hover:text-red-500"
                }`}
                strokeWidth={1.5}
              />
            )}
          </div>

          {isDragActive ? (
            <div>
              <p className="text-xl font-semibold text-red-600 mb-1">Drop your PDF here</p>
              <p className="text-sm text-red-400">Release to upload</p>
            </div>
          ) : (
            <div>
              <p className="text-xl font-semibold text-stone-700 mb-2">
                Drag & drop your PDF here
              </p>
              <p className="text-sm text-stone-500 mb-4">or click to browse files</p>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors duration-200 shadow-sm">
                <Upload className="w-4 h-4" />
                Choose PDF
              </div>
              <p className="mt-4 text-xs text-stone-400">PDF files only · Max one file at a time</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
