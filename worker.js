export default {
  async fetch(request, env, ctx) {
    // Get the client's IP address
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                    request.headers.get('X-Forwarded-For') || 
                    request.headers.get('X-Real-IP') ||
                    request.cf?.ip || 
                    'Unknown';

    // Create response object with IP information
    const response = {
      ip: clientIP,
      timestamp: new Date().toISOString(),
      headers: Object.fromEntries(request.headers),
      cf: request.cf || {}
    };

    // Return JSON response
    return new Response(JSON.stringify(response, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}; 