"use client";
import { useEffect, useState } from "react";

export default function StreamViewer({ link }) {
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchType() {
      const res = await fetch(`/api/course?url=${encodeURIComponent(link)}`, {
        method: "HEAD",
      });
      const contentType = res.headers.get("content-type");
      setType(contentType);
      setLoading(false);
    }

    if (link) fetchType();
  }, [link]);

  if (!link)
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-4xl mb-3 text-gray-300">🔗</div>
        <div className="text-gray-500">No content link provided.</div>
      </div>
    );

  if (!type || loading)
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-gray-50 rounded-lg">
        <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4"></div>
        <div className="text-blue-600 font-medium">Loading content...</div>
      </div>
    );

  // Stream content based on the content type
  if (type.startsWith("video")) {
    return (
      <div className="rounded-lg overflow-hidden shadow-lg bg-black">
        <video
          src={`/api/course?url=${encodeURIComponent(link)}`}
          controls
          className="w-full h-auto max-h-[80vh]"
        />
      </div>
    );
  } else if (type.startsWith("image")) {
    return (
      <div className="flex justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
        <img
          src={`/api/course?url=${encodeURIComponent(link)}`}
          alt="IPFS Content"
          className="max-w-full h-auto max-h-[80vh] rounded-md shadow-md object-contain"
        />
      </div>
    );
  } else {
    return (
      <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
        <iframe
          src={`/api/course?url=${encodeURIComponent(link)}`}
          className="w-full h-[80vh] border rounded"
          title="Course Content"
          loading="lazy"
          allowFullScreen
        />
      </div>
    );
  }
}
