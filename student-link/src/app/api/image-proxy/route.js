// Proxy route to serve S3 images and avoid CORS issues
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get('url');
        
        if (!imageUrl) {
            return new Response('Missing image URL', { status: 400 });
        }
        
        // Validate that it's from your S3 bucket
        if (!imageUrl.includes('student-link-files.s3.amazonaws.com')) {
            return new Response('Invalid image URL', { status: 400 });
        }
        
        console.log('Proxying image request:', imageUrl);
        
        // Fetch the image from S3
        const response = await fetch(imageUrl);
        
        console.log('S3 response status:', response.status);
        console.log('S3 response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            console.error('Failed to fetch image from S3:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('S3 error response:', errorText);
            return new Response(`Failed to fetch image: ${response.status} ${response.statusText} - ${errorText}`, { 
                status: response.status,
                headers: {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }
        
        // Get the image data
        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        
        // Return the image with proper headers
        return new Response(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
        
    } catch (error) {
        console.error('Image proxy error:', error);
        return new Response('Internal server error', { status: 500 });
    }
}
