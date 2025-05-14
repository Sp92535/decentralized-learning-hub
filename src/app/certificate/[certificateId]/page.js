"use client";

import { getCertificateURLbyId } from "@/utils/certificate";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CertificatePage() {
    const params = useParams();
    const certificateId = params?.certificateId;

    const [certificateURL, setCertificateURL] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchCertificate() {
            if (!certificateId) return;

            try {
                const { certificateURL } = await getCertificateURLbyId(certificateId);

                if (!certificateURL) {
                    setError("Certificate not found");
                    return;
                }

                setCertificateURL(certificateURL);
            } catch (err) {
                console.error(err);
                setError("Error fetching certificate");
            }
        }

        fetchCertificate();
    }, [certificateId]);

    if (error) {
        return <div style={{ textAlign: "center", marginTop: "2rem" }}>{error}</div>;
    }

    if (!certificateURL) {
        return <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading certificate...</div>;
    }

    return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
            <h1>Certificate ID: {certificateId}</h1>
            <img
                src={certificateURL}
                alt={`Certificate ${certificateId}`}
                style={{ maxWidth: "100%", height: "auto", border: "1px solid #ccc" }}
            />
        </div>
    );
}
