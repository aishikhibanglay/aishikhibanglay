import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { Upload, X, Loader2, CheckCircle } from "lucide-react";

interface ImageUploaderProps {
  onUploaded: (url: string) => void;
  onClose: () => void;
}

export function ImageUploader({ onUploaded, onClose }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("শুধুমাত্র ছবি ফাইল আপলোড করা যাবে");
        return;
      }

      setUploading(true);
      setError(null);

      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);

      try {
        const url = await api.uploadImage(file);
        setSuccess(true);
        setTimeout(() => {
          onUploaded(url);
          onClose();
        }, 800);
      } catch (err) {
        setError(err instanceof Error ? err.message : "আপলোড ব্যর্থ হয়েছে");
        setUploading(false);
      }
    },
    [onUploaded, onClose]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">ছবি আপলোড করুন</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {preview ? (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-4 ${
              dragging ? "border-cyan-400 bg-cyan-400/10" : "border-gray-600 hover:border-gray-500"
            }`}
          >
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-300 mb-1">ছবি এখানে টেনে আনুন</p>
            <p className="text-gray-500 text-sm">অথবা</p>
            <label className="mt-3 inline-block cursor-pointer">
              <span className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                ফাইল বেছে নিন
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
            </label>
            <p className="text-gray-500 text-xs mt-3">JPG, PNG, GIF, WebP সাপোর্টেড</p>
          </div>
        )}

        {uploading && !success && (
          <div className="flex items-center gap-2 text-cyan-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">আপলোড হচ্ছে...</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">সফলভাবে আপলোড হয়েছে!</span>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm bg-red-400/10 rounded-lg p-3">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
