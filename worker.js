export default {
  async fetch(request, env, ctx) {
    // 添加格式化时间的辅助函数
    const formatTime = () => {
      const d = new Date();
      d.setHours(d.getHours() + 8); // 转换为北京时间 (UTC+8)
      return d.toISOString().replace('Z', '+08:00');
    };

    const url = new URL(request.url);

    // 处理 API 请求（支持根路径和 /api/github-ip）
    if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '/api/github-ip') {
      // Get the client's IP address
      const clientIP = request.headers.get('CF-Connecting-IP') || 
                      request.headers.get('X-Forwarded-For') || 
                      request.headers.get('X-Real-IP') ||
                      request.cf?.ip || 
                      'Unknown';

      try {
        // 获取 IP 详细信息
        const ipInfoResponse = await fetch(`https://ipinfo.io/${clientIP}/json`);
        const ipInfo = await ipInfoResponse.json();

        // 获取请求头信息
        const headers = {};
        for (const [key, value] of request.headers.entries()) {
          headers[key] = value;
        }

        // 获取访问来源信息
        const sourceInfo = {
          referer: request.headers.get('Referer') || 'Direct',
          userAgent: request.headers.get('User-Agent') || 'Unknown',
          origin: request.headers.get('Origin') || 'Unknown',
          country: request.cf?.country || 'Unknown',
          city: request.cf?.city || 'Unknown',
          continent: request.cf?.continent || 'Unknown',
          timezone: request.cf?.timezone || 'Unknown'
        };

        // Create response object with IP information and headers
        const response = {
          ...ipInfo,
          request_headers: headers,
          source_info: sourceInfo
        };
        const responseBody = JSON.stringify(response, null, 2);
        console.log(`[${formatTime()}] API 请求: `, responseBody);

        // Return JSON response
        return new Response(responseBody, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        console.error(`[${formatTime()}] 获取 IP 信息时出错:`, error);
        return new Response(JSON.stringify({
          error: 'Failed to fetch IP information',
          message: error.message,
          timestamp: new Date().toISOString()
        }, null, 2), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
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