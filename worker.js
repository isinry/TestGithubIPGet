export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 处理 API 请求（支持根路径和 /api/github-ip）
    if (url.pathname === '/' || url.pathname === '/api/github-ip') {
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
      console.log('API 请求: ', response);

      // Return JSON response
      return new Response(JSON.stringify(response, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // 对于其他请求，返回 404
    return new Response('Not Found', { 
      status: 404,
      statusText: 'Not Found',
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}; 