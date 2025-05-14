import { NextResponse } from "next/server";
import axios from "axios";
import { generateCertificate } from "@/utils/certificate";

export async function POST(req) {
    try {
        const { userData, course } = await req.json();

        const pinataApiKey = process.env.PINATA_API_KEY;
        const pinataSecretKey = process.env.PINATA_SECRET;

        if (!userData || !course) {
            return NextResponse.json({
                success: false,
                message: "Missing name or course",
            });
        }

        const { buffer, certificateId } = await generateCertificate(userData, course);

        const formData = new FormData();
        formData.append("file", new Blob([buffer], { type: "image/png" }), "certificate.png");

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
        const ipfsLink = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

        return NextResponse.json({
            success: true,
            ipfsLink,
            certificateId
        });
    } catch (error) {
        console.error("IPFS Upload Failed:", error);
        return NextResponse.json({
            success: false,
            message: error.response?.data?.message || error.message,
        });
    }
}