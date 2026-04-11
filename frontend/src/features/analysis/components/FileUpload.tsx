"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Upload, X, CheckCircle2, FileText, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [showPreview, setShowPreview] = useState(false);
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

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
        onClick={() => {
          if (!file) inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className="relative rounded-xl transition-all duration-200 min-h-[180px] flex flex-col items-center justify-center gap-3 p-6"
        style={{
          cursor: file ? "default" : "pointer",
          background: file
            ? "var(--success-light)"
            : isDragging
              ? "var(--accent-light)"
              : "var(--surface)",
          border: `1.5px dashed ${
            file ? "#86efac" : isDragging ? "var(--accent)" : "var(--border)"
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
              <div className="flex gap-2">
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
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                  style={{
                    background: "var(--surface)",
                    color: "var(--muted)",
                    border: "1px solid var(--border)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPreview(true);
                  }}
                >
                  <Eye size={12} />
                  Preview
                </button>
              </div>
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
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--muted-light)" }}
                >
                  PDF only
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl min-w-2xl h-[90vh] flex flex-col p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="text-accent" size={24} />
              {file?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full bg-muted/30 rounded-lg overflow-hidden border border-border">
            {previewUrl && (
              <object
                data={previewUrl}
                type="application/pdf"
                width="100%"
                height="100%"
                className="rounded-lg"
              >
                <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                  <FileText size={48} className="text-muted mb-4" />
                  <p className="text-lg font-medium">Unable to preview PDF</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your browser doesn't support PDF previews. Please download
                    the file to view it.
                  </p>
                </div>
              </object>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
