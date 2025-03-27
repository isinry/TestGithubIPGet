# Cloudflare IP Getter Worker

这是一个简单的 Cloudflare Worker，用于获取访问者的 IP 地址信息。

## 功能特点

- 获取访问者的真实 IP 地址
- 返回详细的请求头信息
- 返回 Cloudflare 提供的额外信息
- 支持 CORS
- 返回 JSON 格式的响应

## 部署步骤

1. 确保已安装 Wrangler CLI：
```bash
npm install -g wrangler
```

2. 登录到你的 Cloudflare 账户：
```bash
wrangler login
```

3. 部署 Worker：
```bash
wrangler deploy
```

## 使用方法

部署完成后，访问你的 Worker URL，将返回包含以下信息的 JSON 响应：
- IP 地址
- 时间戳
- 请求头信息
- Cloudflare 提供的额外信息

## 示例响应

```json
{
  "ip": "1.2.3.4",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "headers": {
    "cf-connecting-ip": "1.2.3.4",
    "user-agent": "Mozilla/5.0...",
    ...
  },
  "cf": {
    "ip": "1.2.3.4",
    "country": "US",
    "continent": "NA",
    ...
  }
}
``` 