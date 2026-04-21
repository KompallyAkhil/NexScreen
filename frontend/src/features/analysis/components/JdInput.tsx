"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Upload, X, CheckCircle2, FileText, Eye, AlignLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Tab = "pdf" | "text";

interface JdInputProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  defaultFile?: File | null;
}

export function JdInput({ label, onFileSelect, defaultFile }: JdInputProps) {
  const [tab, setTab] = useState<Tab>("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [jdText, setJdText] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Sync when parent injects a default file (e.g. sample files)
  useEffect(() => {
    if (defaultFile && defaultFile !== file) {
      setFile(defaultFile);
      onFileSelect(defaultFile);
      setTab("pdf");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFile]);

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

  const handleTextChange = (text: string) => {
    setJdText(text);
    if (text.trim()) {
      const blob = new Blob([text], { type: "text/plain" });
      const textFile = new File([blob], "job_description.txt", { type: "text/plain" });
      onFileSelect(textFile);
    } else {
      onFileSelect(null);
    }
  };

  const switchTab = (newTab: Tab) => {
    setTab(newTab);
    // Clear the other input when switching tabs
    if (newTab === "pdf") {
      setJdText("");
      onFileSelect(file); // restore pdf if any
    } else {
      setFile(null);
      onFileSelect(jdText.trim() ? new File([new Blob([jdText], { type: "text/plain" })], "job_description.txt", { type: "text/plain" }) : null);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between h-8 mb-2">
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--muted)" }}
        >
          {label}
        </p>
        <div
          className="flex items-center gap-0.5 p-0.5 rounded-lg"
          style={{ background: "var(--border-subtle)", border: "1px solid var(--border)" }}
        >
          <TabButton
            active={tab === "pdf"}
            onClick={() => switchTab("pdf")}
            icon={<FileText size={11} />}
            label="PDF"
          />
          <TabButton
            active={tab === "text"}
            onClick={() => switchTab("text")}
            icon={<AlignLeft size={11} />}
            label="Text"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "pdf" ? (
          <motion.div
            key="pdf-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {/* PDF Drop Zone */}
            <div
              onClick={() => { if (!file) inputRef.current?.click(); }}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
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
                accept=".pdf"
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
                      <p className="text-sm font-semibold truncate max-w-[200px]" style={{ color: "var(--foreground)" }}>
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
                        style={{ background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.borderColor = "#fca5a5"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
                      >
                        <X size={12} />
                        Remove
                      </button>
                      <button
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                        style={{ background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}
                        onClick={(e) => { e.stopPropagation(); setShowPreview(true); }}
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
                        background: isDragging ? "var(--accent-muted)" : "var(--border-subtle)",
                        color: isDragging ? "var(--accent)" : "var(--muted)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <Upload size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
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
          </motion.div>
        ) : (
          <motion.div
            key="text-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="relative"
          >
            <textarea
              value={jdText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Paste the job description here…&#10;&#10;e.g. We are looking for a Senior Software Engineer with 5+ years of experience in React, Node.js, and cloud infrastructure..."
              className="w-full rounded-xl resize-none text-sm leading-relaxed outline-none transition-all duration-200 p-4"
              style={{
                minHeight: "180px",
                background: "var(--surface)",
                color: "var(--foreground)",
                border: `1.5px solid ${jdText.trim() ? "#86efac" : "var(--border)"}`,
                boxShadow: "var(--shadow-sm)",
                caretColor: "var(--accent)",
              }}
              onFocus={(e) => {
                if (!jdText.trim()) e.currentTarget.style.borderColor = "var(--accent)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = jdText.trim() ? "#86efac" : "var(--border)";
              }}
            />
            {jdText.trim() && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-3 right-3 flex items-center gap-1.5"
              >
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium"
                  style={{ background: "var(--success-light)", color: "var(--success)", border: "1px solid #86efac" }}
                >
                  <CheckCircle2 size={11} />
                  {jdText.length} chars
                </div>
                <button
                  onClick={() => handleTextChange("")}
                  className="p-1 rounded-md transition-all duration-150"
                  style={{ background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--danger)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; }}
                  title="Clear text"
                >
                  <X size={12} />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Preview Dialog */}
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
              <object data={previewUrl} type="application/pdf" width="100%" height="100%" className="rounded-lg">
                <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                  <FileText size={48} className="text-muted mb-4" />
                  <p className="text-lg font-medium">Unable to preview PDF</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your browser doesn&apos;t support PDF previews.
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

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-150"
      style={{
        background: active ? "var(--surface)" : "transparent",
        color: active ? "var(--accent)" : "var(--muted)",
        boxShadow: active ? "var(--shadow-sm) " : "none",
        border: active ? "1px rounded-sm solid var(--border)" : "1px solid transparent",
      }}
    >
      {icon}
      {label}
    </button>
  );
}
