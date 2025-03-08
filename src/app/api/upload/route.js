import { NextResponse } from "next/server";
import FormData from "form-data";
import axios from "axios";

export async function POST(req) {
    try {
        const data = await req.formData();
        const files = data.getAll("files");

        if (!files || files.length === 0) {
            return NextResponse.json({ success: false, message: "No files selected" });
        }

        const pinataApiKey = process.env.PINATA_API_KEY;
        const pinataSecretKey = process.env.PINATA_SECRET;

        const formData = new FormData();

        for (const file of files) {
            const arrayBuffer = await file.arrayBuffer(); // Convert to ArrayBuffer
            const buffer = Buffer.from(arrayBuffer); // Convert to Buffer
            formData.append("file", buffer, file.name); // Append buffer with filename
        }

        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretKey,
                "Content-Type": "multipart/form-data",
            },
        });

        const ipfsHash = response.data.IpfsHash;
        const ipfsLink = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

        return NextResponse.json({ success: true, ipfsLink });
    } catch (error) {
        console.error("IPFS Upload Failed:", error);
        return NextResponse.json({ success: false, message: "Upload Failed" });
    }
}
