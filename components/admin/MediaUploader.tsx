"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
  accept?: string;
  label: string;
  hint?: string;
  type?: "image" | "video" | "any";
};

export default function MediaUploader({
  value,
  onChange,
  accept = "image/*",
  label,
  hint,
  type = "image",
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "فشل الرفع");
      }

      onChange(data.url);
      setFileName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل الرفع");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="label-field">{label}</label>

      {!value ? (
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 cursor-pointer transition-all ${
            uploading
              ? "border-cyan/50 bg-cyan/5"
              : error
              ? "border-red-500/50 bg-red-500/5"
              : "border-white/20 bg-white/5 hover:border-cyan/50 hover:bg-cyan/5"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 size={28} className="text-cyan animate-spin" />
              <p className="text-cyan text-sm font-semibold">جاري الرفع...</p>
            </>
          ) : (
            <>
              <Upload size={28} className="text-cyan" />
              <p className="text-white font-semibold text-sm">
                اضغط لاختيار ملف
              </p>
              {hint && <p className="text-xs text-white/40">{hint}</p>}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Preview */}
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-navy">
            {type === "video" ? (
              <video
                src={value}
                controls
                className="w-full max-h-64 object-contain"
              />
            ) : (
              <img
                src={value}
                alt="Preview"
                className="w-full max-h-64 object-contain"
              />
            )}

            {/* زر الحذف */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 left-2 p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* اسم الملف */}
          {fileName && (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/5 p-3">
              <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
              <p className="text-xs text-white/70 truncate">{fileName}</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 mt-2">
          <AlertCircle size={14} className="text-red-400" />
          <p className="text-red-400 text-xs">{error}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}