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
      console.log('API 请求: ', response);

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
      // 如果请求的是根路径，重定向到 index.html
      if (url.pathname === '/') {
        return Response.redirect(`${url.origin}/index.html`, 301);
      }

      // 从 env.ASSETS 获取静态资源
      const response = await env.ASSETS.fetch(request);

      // 如果资源不存在，返回 404
      if (!response.ok) {
        return new Response('Not Found', { 
          status: 404,
          statusText: 'Not Found',
          headers: {
            'Content-Type': 'text/plain'
          }
        });
      }

      // 设置缓存控制头
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'public, max-age=14400'); // 4小时缓存

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    } catch (error) {
      console.error('处理静态资源请求时出错:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        statusText: 'Internal Server Error',
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  }
}; 