import { HelmetOptions } from 'helmet';

export const helmetConfig: HelmetOptions = {
  // 防止点击劫持
  frameguard: {
    action: 'deny'
  },
  // 内容安全策略
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],  // 只允许从同源加载资源
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],  // 允许内联脚本和eval
      styleSrc: ["'self'", "'unsafe-inline'"],  // 允许内联样式
      imgSrc: ["'self'", 'data:', 'https:'],  // 允许从https和data URI加载图片
      connectSrc: ["'self'"],  // 限制连接（XHR、WebSocket等）
      fontSrc: ["'self'", 'https:', 'data:'],  // 允许从https和data URI加载字体
      objectSrc: ["'none'"],  // 禁止所有插件（object/embed/applet）
      mediaSrc: ["'self'"],  // 限制音视频来源
      frameAncestors: ["'none'"],  // 禁止被嵌入iframe
    }
  },
  // XSS 防护
  xssFilter: true,
  // 禁用 X-Powered-By header
  hidePoweredBy: true,
  // HSTS 配置
  strictTransportSecurity: {
    maxAge: 31536000,  // 一年
    includeSubDomains: true,
    preload: true
  },
  // 禁止嗅探 MIME 类型
  noSniff: true,
  // 引用策略
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  },
  // DNS 预获取控制
  dnsPrefetchControl: {
    allow: false
  },
  // 允许跨域
  crossOriginResourcePolicy: { 
    policy: 'same-site' 
  },
  // 跨域嵌入策略
  crossOriginEmbedderPolicy: false,
  // 跨域打开策略
  crossOriginOpenerPolicy: {
    policy: 'same-origin'
  }
}; 