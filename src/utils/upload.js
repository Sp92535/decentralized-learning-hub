export const uploadToIPFS = async (files) => {
    try {
        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Upload error:", error);
        return { success: false, message: "Upload failed" };
    }
};
