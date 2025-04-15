import { issueCertificate } from "./course_marketplace";

export const uploadToIPFS = async (
  files,
  courseName,
  price,
  directoryName,
  fileRenames = {},
  description = "",
  category = "",
  language = "",
  tags = [],
  thumbnail = null
) => {
  try {
    const formData = new FormData();

    // ✅ Add all selected files to FormData with custom names if provided
    files.forEach((file) => {
      const originalPath = file.webkitRelativePath || file.name;
      let newPath = originalPath;

      // If we have a directory name change, update the path
      if (directoryName && file.webkitRelativePath) {
        const pathParts = file.webkitRelativePath.split("/");
        if (pathParts.length > 1) {
          pathParts[0] = directoryName;
          newPath = pathParts.join("/");
        }
      }

      // If we have a specific rename for this file, use it
      if (fileRenames[originalPath]) {
        if (file.webkitRelativePath) {
          // For files in directory
          const pathParts = newPath.split("/");
          const fileName = pathParts.pop();
          pathParts.push(fileRenames[originalPath]);
          newPath = pathParts.join("/");
        } else {
          // For root files
          newPath = fileRenames[originalPath];
        }
      }

      formData.append("file", file, newPath);
    });

    // ✅ Add thumbnail if provided
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    // ✅ Upload Files to Pinata (Directory Upload)
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!data.success) {
      return { success: false, message: data.message };
    }

    // Create file metadata that doesn't rely on HTML content
    const fileMetadata = files.map((file) => {
      const originalPath = file.webkitRelativePath || file.name;
      let displayPath = originalPath;

      // Apply directory rename
      if (directoryName && file.webkitRelativePath) {
        const pathParts = file.webkitRelativePath.split("/");
        if (pathParts.length > 1) {
          pathParts[0] = directoryName;
          displayPath = pathParts.join("/");
        }
      }

      // Apply file rename
      if (fileRenames[originalPath]) {
        if (file.webkitRelativePath) {
          // For files in directory
          const pathParts = displayPath.split("/");
          pathParts[pathParts.length - 1] = fileRenames[originalPath];
          displayPath = pathParts.join("/");
        } else {
          // For root files
          displayPath = fileRenames[originalPath];
        }
      }

      return {
        originalName: file.name,
        originalPath: file.webkitRelativePath || file.name,
        displayPath: displayPath,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      };
    });

    // ✅ Create Metadata JSON
    const jsonData = JSON.stringify({
      courseName: courseName,
      description: description,
      category: category,
      language: language,
      tags: tags,
      price: price,
      directoryHash: data.ipfsHash,
      directoryGatewayUrl: data.ipfsLink,
      thumbnailUrl: thumbnail ? data.thumbnailUrl : null,
      files: fileMetadata,
      createdAt: new Date().toISOString(),
    });

    const jsonBlob = new Blob([jsonData], { type: "application/json" });
    const jsonFile = new File([jsonBlob], "metadata.json");
    const jsonFormData = new FormData();
    jsonFormData.append("file", jsonFile);

    // ✅ Upload JSON Metadata to Pinata
    const jsonResponse = await fetch("/api/upload", {
      method: "POST",
      body: jsonFormData,
    });

    const jsonResult = await jsonResponse.json();
    if (!jsonResult.success) {
      return { success: false, message: jsonResult.message };
    }
    console.log(jsonResult);

    // Return the JSON CID/hash instead of a gateway URL
    return {
      success: true,
      ipfsLink: jsonResult.ipfsLink,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: "Upload failed: " + error.message };
  }
};

export const uploadCertificateToIPFS = async (name, course, courseId) => {
  try {
    const res = await fetch("/api/upload/certificate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, course }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Upload failed");
    }

    await issueCertificate(courseId, data.ipfsLink);

    return data
  } catch (err) {
    console.error("Certificate Upload Error:", err);
    return { success: false, message: err.message };
  }
};
