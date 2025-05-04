import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const data = await req.formData();
    const files = data.getAll("file");

    if (!files || files.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No files selected",
      });
    }

    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataSecretKey = process.env.PINATA_SECRET;

    const formData = new FormData();

    // Prepare files for upload
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: file.type });
      formData.append("file", blob, file.name);
    }

    // Handle optional metadata
    const name = data.get("name");
    const description = data.get("description");
    const category = data.get("category");
    const language = data.get("language");
    const tags = data.get("tags") ? data.get("tags").split(",") : [];
    const price = data.get("price");
    const directoryName = data.get("directoryName");
    const fileRenames = JSON.parse(data.get("fileRenames") || "{}");
    const image = data.get("image");

    // Create metadata for course content
    const fileMetadata = files.map((file) => {
      const originalPath = file.name;
      let displayPath = originalPath;

      // Apply directory rename logic if necessary
      if (directoryName) {
        const pathParts = originalPath.split("/");
        if (pathParts.length > 1) {
          pathParts[0] = directoryName;
          displayPath = pathParts.join("/");
        }
      }

      // Apply file renaming if provided
      if (fileRenames[originalPath]) {
        displayPath = fileRenames[originalPath];
      }

      return {
        originalName: file.name,
        originalPath: originalPath,
        displayPath: displayPath,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      };
    });

    // Create metadata JSON for the course
    const metadataJson = JSON.stringify({
      name: name,
      description: description,
      category: category,
      language: language,
      tags: tags,
      price: price,
      directoryName: directoryName,
      files: fileMetadata,
      createdAt: new Date().toISOString(),
    });

    // Add metadata to formData
    formData.append(
      "pinataMetadata",
      JSON.stringify({
        name: "Course Content",
        keyvalues: {
          metadata: metadataJson,
        },
      })
    );

    // Pinning options (cidVersion: 1)
    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", options);

    // Upload to Pinata
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretKey,
          "Content-Type": "multipart/form-data",
        },
        timeout: 120000,
      }
    );

    const ipfsHash = response.data.IpfsHash;
    const ipfsLink = `https://gateway.pinata.cloud/ipfs/${ipfsHash}/`;

    // Handle image upload if provided
    if (image) {
      const imageFormData = new FormData();
      imageFormData.append("file", image);

      // Upload image
      const imageResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        imageFormData,
        {
          headers: {
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretKey,
            "Content-Type": "multipart/form-data",
          },
          timeout: 120000,
        }
      );
      const imageHash = imageResponse.data.IpfsHash;
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageHash}/`;

      return NextResponse.json({
        success: true,
        ipfsLink,
        imageUrl,
      });
    }

    // Return success with IPFS link to course metadata
    return NextResponse.json({
      success: true,
      ipfsLink,
    });
  } catch (error) {
    console.error("IPFS Upload Failed:", error);
    return NextResponse.json({
      success: false,
      message:
        "Upload Failed: " + (error.response?.data?.message || error.message),
    });
  }
}
