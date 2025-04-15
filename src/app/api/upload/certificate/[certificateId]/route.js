// app/api/proxy/route.js

export async function GET(req) {
    const { searchParams } = new URL(req.url); // Extract query parameters
    const url = searchParams.get('url'); // Get the 'url' parameter

    if (!url) {
        return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400 });
    }

    try {
        // Decode the URL before passing to fetch
        const decodedUrl = decodeURIComponent(url);

        // Fetch the content from the decoded URL
        const response = await fetch(decodedUrl);

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Failed to fetch the content' }), { status: response.status });
        }

        // Stream the content to the client
        const contentType = response.headers.get('content-type');
        const headers = new Headers();
        headers.set('Content-Type', contentType);

        return new Response(response.body, { status: 200, headers });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to fetch content' }), { status: 500 });
    }
}
