"use client";

import { useEffect, useState } from "react";
import { getApiUrl, resolveAssetUrl } from "@/lib/api";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  label?: string;
  defaultImage?: string;
}

export default function ImageUpload({ onUpload, label = "Upload Image", defaultImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(defaultImage || "");

  useEffect(() => {
    setPreview(defaultImage || "");
  }, [defaultImage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl("/upload"), {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || data?.error || "Upload failed");
      }

      const data = await res.json();
      const fullUrl = resolveAssetUrl(data.url || data.relativeUrl);
      setPreview(fullUrl);
      onUpload(fullUrl);
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(error instanceof Error ? error.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="label">{label}</label>
      {preview && (
        <div style={{ width: "128px", height: "128px", overflow: "hidden", borderRadius: "12px", border: "1px solid rgba(31,41,55,0.12)", background: "#EFE7D7" }}>
          <img src={resolveAssetUrl(preview)} alt="Preview" className="object-cover w-full h-full" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-[#5C6470]
          file:mr-4 file:py-2 file:px-4
          file:rounded-xl file:border-0
          file:text-sm file:font-semibold
          file:bg-[#EAF5FB] file:text-[#3F93C5]
          hover:file:bg-[#DCEFF8]"
      />
      {uploading && <p className="text-sm text-[#5DA8D6]">Uploading...</p>}
    </div>
  );
}
