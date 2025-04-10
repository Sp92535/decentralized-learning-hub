'use client';
import { useEffect, useState } from 'react';

export default function StreamViewer({ link }) {
    const [type, setType] = useState(null);

    useEffect(() => {
        async function fetchType() {
            const res = await fetch(`/api/course?url=${encodeURIComponent(link)}`, { method: 'HEAD' });
            const contentType = res.headers.get('content-type');
            setType(contentType);
        }

        if (link) fetchType();
    }, [link]);

    if (!link) return <div>No content link provided.</div>;
    if (!type) return <div>Loading...</div>;

    // Stream content based on the content type
    if (type.startsWith('video')) {
        return (
            <video
                src={`/api/course?url=${encodeURIComponent(link)}`}
                controls
                className="w-full h-auto max-h-[80vh]"
            />
        );
    } else if (type.startsWith('image')) {
        return (
            <img
                src={`/api/course?url=${encodeURIComponent(link)}`}
                alt="IPFS Content"
                className="w-full h-auto max-h-[80vh]"
            />
        );
    } else {
        return (
            <iframe
                src={`/api/course?url=${encodeURIComponent(link)}`}
                className="w-full h-[80vh] border rounded"
            />
        );
    }
}
