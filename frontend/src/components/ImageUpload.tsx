"use client";

import { useState } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  label?: string;
  defaultImage?: string;
}

export default function ImageUpload({ onUpload, label = "Upload Image", defaultImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(defaultImage || "");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const API_URL = "http://localhost:5000/api"; // Full URL or proxy path
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      // data.url returns /uploads/filename.ext
      const fullUrl = `http://localhost:5000${data.url}`;
      setPreview(fullUrl);
      onUpload(data.url); // Use relative URL or full URL depending on how it's stored. Storing relative is fine if frontend prepends backend URL, but let's just store the full URL for simplicity here! Wait, the prompt says "Keep implementation simple".
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {preview && (
        <div className="relative w-32 h-32 overflow-hidden rounded-md border border-gray-200">
          <img src={preview.startsWith('http') ? preview : `http://localhost:5000${preview}`} alt="Preview" className="object-cover w-full h-full" />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-indigo-50 file:text-indigo-700
          hover:file:bg-indigo-100"
      />
      {uploading && <p className="text-sm text-indigo-500">Uploading...</p>}
    </div>
  );
}
