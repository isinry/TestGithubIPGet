export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 处理 API 请求
    if (url.pathname === '/api/github-ip') {
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

    // 处理静态资源请求
    try {
      // 如果请求的是根路径，返回 index.html
      if (url.pathname === '/') {
        url.pathname = '/index.html';
      }

      // 使用 env.ASSETS 来获取静态资源
      const asset = await env.ASSETS.fetch(request);
      
      if (asset.status === 404) {
        return new Response('Not Found', { status: 404 });
      }

      // 设置缓存控制头
      const response = new Response(asset.body, asset);
      response.headers.set('Cache-Control', 'public, max-age=14400'); // 4小时缓存
      return response;
    } catch (error) {
      return new Response('Internal Server Error', { status: 500 });
    }
  }
}; 