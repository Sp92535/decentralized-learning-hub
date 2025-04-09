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

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: file.type });
      formData.append("file", blob, file.name);
    }

    // Add metadata to avoid HTML content restrictions
    const metadata = JSON.stringify({
      name: "Course Content",
      keyvalues: {
        contentType: "application/json",
        isHtml: "false",
      },
    });
    formData.append("pinataMetadata", metadata);

    // Add options to customize the pin
    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", options);

    // ✅ Upload to Pinata
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
