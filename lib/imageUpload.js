import { API_BASE_URL } from "./api";

/** Extract first image file from a paste or drop event */
export function getImageFromDataTransfer(dataTransfer) {
  if (!dataTransfer) return null;

  const files = dataTransfer.files;
  if (files?.length) {
    const img = Array.from(files).find((f) => f.type.startsWith("image/"));
    if (img) return img;
  }

  const items = dataTransfer.items;
  if (items) {
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (item.kind === "file" && item.type.startsWith("image/")) {
        return item.getAsFile();
      }
    }
  }

  return null;
}

export function getImageFromPasteEvent(e) {
  return getImageFromDataTransfer(e.clipboardData);
}

export function validateImageFile(file, maxMb = 5) {
  if (!file) return "No file selected";
  if (!file.type.startsWith("image/")) return "Only image files are allowed";
  if (file.size > maxMb * 1024 * 1024) return `Image must be under ${maxMb}MB`;
  return null;
}

export function filePreviewUrl(file) {
  if (!file) return null;
  
  // Use FileReader to create a data URL instead of blob URL
  // This avoids Next.js trying to fetch blob URLs as routes
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export async function uploadImageFile(file, folder = "general") {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  const baseUrl = API_BASE_URL || (typeof window !== "undefined" ? window.location.origin : '');
  const uploadUrl = `${baseUrl}/api/uploads`;

  console.log('Uploading image to:', uploadUrl, 'Folder:', folder);

  const res = await fetch(
    uploadUrl,
    {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    },
  );

  const data = await res.json();
  console.log('Upload response:', data);
  
  if (!res.ok) {
    console.error('Upload failed:', data);
    throw new Error(data.message || "Upload failed");
  }
  return data.url;
}
