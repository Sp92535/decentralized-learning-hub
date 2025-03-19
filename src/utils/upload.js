export const uploadToIPFS = async (files) => {
  try {
    const formData = new FormData();

    // ✅ Add all selected files to FormData
    files.forEach((file) => {
      formData.append("file", file, file.webkitRelativePath || file.name);
    });

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
    const fileMetadata = files.map((file) => ({
      name: file.name,
      path: file.webkitRelativePath,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    }));

    // ✅ Create Metadata JSON
    const jsonData = JSON.stringify({
      courseName: document.querySelector('input[placeholder="Course Name"]')
        .value,
      price: document.querySelector('input[placeholder="Price (ETH)"]').value,
      directoryHash: data.ipfsHash,
      directoryGatewayUrl: data.ipfsLink,
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

    // Return the JSON CID/hash instead of a gateway URL
    return {
      success: true,
      ipfsLink: `ipfs://${jsonResult.ipfsHash}`,
      gatewayLink: `https://gateway.pinata.cloud/ipfs/${jsonResult.ipfsHash}`,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, message: "Upload failed: " + error.message };
  }
};
