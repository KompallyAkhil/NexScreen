"use client";

import { useState, useRef } from "react";
import { Upload, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FileUploadProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  icon?: React.ReactNode;
}

export function FileUpload({ label, onFileSelect, accept = ".pdf", icon }: FileUploadProps) {
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
      <label className="text-sm font-bold tracking-wide text-zinc-400 mb-3 block">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative group cursor-pointer rounded-3xl transition-all duration-500 p-8 flex flex-col items-center justify-center gap-4 min-h-[240px] overflow-hidden",
          isDragging 
            ? "border-2 border-indigo-500 bg-indigo-500/10 scale-[1.02] shadow-[0_0_40px_rgba(99,102,241,0.2)]" 
            : "border border-zinc-800/80 bg-zinc-950 hover:bg-zinc-900/80 hover:border-zinc-700 shadow-xl",
          file ? "border-emerald-500/30 bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]" : ""
        )}
      >
        {/* Animated dashed border effect using SVG for smoother rendering if needed, or stick to CSS */}
        {!file && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-3xl" style={{ border: '2px dashed rgba(255,255,255,0.05)' }} />
        )}

        {/* Glow orb inside the dropzone */}
        <div className={cn("absolute w-32 h-32 blur-[60px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-700", isDragging ? "bg-indigo-500/50" : file ? "bg-emerald-500/30" : "bg-transparent")} />

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
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="flex flex-col items-center text-center gap-4 z-10"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <p className="text-base font-bold text-zinc-100 truncate max-w-[220px]">
                  {file.name}
                </p>
                <p className="text-sm font-medium text-zinc-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); onFileSelect(null); }}
                className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 bg-zinc-900 border border-zinc-800 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-all flex items-center gap-2"
              >
                <X size={14} /> Remove File
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center text-center gap-4 z-10"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all duration-300 shadow-lg relative overflow-hidden group-hover:scale-110">
                {icon || <Upload size={28} />}
              </div>
              <div>
                <p className="text-base font-bold text-zinc-300 group-hover:text-white transition-colors tracking-tight">Click or drag PDF here</p>
                <p className="text-sm font-medium text-zinc-600 mt-2">Maximum file size: 10MB</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
