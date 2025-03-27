export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 处理 API 请求（支持根路径和 /api/github-ip）
    if (url.pathname === '/' || url.pathname === '/index.html' || url.pathname === '/api/github-ip') {
      // Get the client's IP address and log all possible IP sources
      const cfConnectingIP = request.headers.get('CF-Connecting-IP');
      const xForwardedFor = request.headers.get('X-Forwarded-For');
      const xRealIP = request.headers.get('X-Real-IP');
      const cfIP = request.cf?.ip;

      console.log('IP Sources:', {
        'CF-Connecting-IP': cfConnectingIP,
        'X-Forwarded-For': xForwardedFor,
        'X-Real-IP': xRealIP,
        'CF.ip': cfIP
      });

      // 优先使用 CF-Connecting-IP
      const clientIP = cfConnectingIP || xForwardedFor || xRealIP || cfIP || 'Unknown';
      console.log('Selected IP:', clientIP);

      try {
        // 获取 IP 详细信息
        const ipInfoURL = `https://ipinfo.io/${clientIP}/json`;
        console.log('Requesting IP info from:', ipInfoURL);
        
        const ipInfoResponse = await fetch(ipInfoURL);
        const ipInfo = await ipInfoResponse.json();
        console.log('IP Info Response:', ipInfo);

        // 创建包含所有信息的响应对象
        const response = {
          ...ipInfo,
          debug: {
            originalIP: clientIP,
            headers: {
              'CF-Connecting-IP': cfConnectingIP,
              'X-Forwarded-For': xForwardedFor,
              'X-Real-IP': xRealIP
            },
            cf: request.cf || {}
          }
        };

        const responseBody = JSON.stringify(response, null, 2);
        console.log('Final Response:', responseBody);

        // Return JSON response
        return new Response(responseBody, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        console.error('获取 IP 信息时出错:', error);
        return new Response(JSON.stringify({
          error: 'Failed to fetch IP information',
          message: error.message,
          debug: {
            originalIP: clientIP,
            headers: {
              'CF-Connecting-IP': cfConnectingIP,
              'X-Forwarded-For': xForwardedFor,
              'X-Real-IP': xRealIP
            },
            cf: request.cf || {}
          },
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