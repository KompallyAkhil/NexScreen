"use client";

import { useState, useRef } from "react";
import { Upload, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  accept?: string;
}

export function FileUpload({
  label,
  onFileSelect,
  accept = ".pdf",
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      onFileSelect(f);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="w-full">
      <p
        className="text-xs font-semibold uppercase tracking-wider mb-2"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </p>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className="relative cursor-pointer rounded-xl transition-all duration-200 min-h-[180px] flex flex-col items-center justify-center gap-3 p-6"
        style={{
          background: file
            ? "var(--success-light)"
            : isDragging
              ? "var(--accent-light)"
              : "var(--surface)",
          border: `1.5px dashed ${
            file
              ? "#86efac"
              : isDragging
                ? "var(--accent)"
                : "var(--border)"
          }`,
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <input
          type="file"
          ref={inputRef}
          hidden
          accept={accept}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "var(--success-muted)" }}
              >
                <CheckCircle2 size={22} style={{ color: "var(--success)" }} />
              </div>
              <div>
                <p
                  className="text-sm font-semibold truncate max-w-[200px]"
                  style={{ color: "var(--foreground)" }}
                >
                  {file.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  onFileSelect(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                style={{
                  background: "var(--surface)",
                  color: "var(--muted)",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--danger)";
                  e.currentTarget.style.borderColor = "#fca5a5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--muted)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                <X size={12} />
                Remove
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-200"
                style={{
                  background: isDragging
                    ? "var(--accent-muted)"
                    : "var(--border-subtle)",
                  color: isDragging ? "var(--accent)" : "var(--muted)",
                  border: "1px solid var(--border)",
                }}
              >
                <Upload size={18} />
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  {isDragging ? "Drop to upload" : "Click or drag file here"}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--muted-light)" }}>
                  PDF only
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
