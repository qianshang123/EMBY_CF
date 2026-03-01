const myConfig = {
  target: 'https://emos.best',
  enableCors: true,
  // 请修改为您自己的信息
  proxyId: '*****,    // 您的用户ID
  proxyName: '@*****',     // 您的称号
  // 图片缓存设置（秒）
  imageCacheMaxAge: 86400   // 24小时缓存
};

// 国家代码到中文名称的映射
const countryNames = {
  'CN': '中国',
  'US': '美国',
  'JP': '日本',
  'HK': '香港',
  'TW': '台湾',
  'SG': '新加坡',
  'KR': '韩国',
  'DE': '德国',
  'GB': '英国',
  'CA': '加拿大',
  'AU': '澳大利亚',
  'RU': '俄罗斯',
  'IN': '印度',
  'FR': '法国',
  'IT': '意大利',
  'ES': '西班牙',
  'BR': '巴西',
  'TH': '泰国',
  'MY': '马来西亚',
  'ID': '印度尼西亚',
  'PH': '菲律宾',
  'VN': '越南',
  'MM': '缅甸',
  'KH': '柬埔寨',
  'LA': '老挝',
  'BD': '孟加拉国',
  'NP': '尼泊尔',
  'PK': '巴基斯坦',
  'AF': '阿富汗',
  'IR': '伊朗',
  'IQ': '伊拉克',
  'SA': '沙特阿拉伯',
  'AE': '阿拉伯联合酋长国',
  'TR': '土耳其',
  'IL': '以色列',
  'EG': '埃及',
  'ZA': '南非',
  'NG': '尼日利亚',
  'KE': '肯尼亚',
  'ET': '埃塞俄比亚',
  'MA': '摩洛哥',
  'DZ': '阿尔及利亚',
  'TN': '突尼斯',
  'LY': '利比亚',
  'SD': '苏丹',
  'SO': '索马里',
  'YE': '也门',
  'OM': '阿曼',
  'QA': '卡塔尔',
  'KW': '科威特',
  'BH': '巴林',
  'JO': '约旦',
  'LB': '黎巴嫩',
  'SY': '叙利亚',
  'PS': '巴勒斯坦',
  'CY': '塞浦路斯'
};

// 国家代码转换函数
function getCountryName(code) {
  return countryNames[code] || code;
}

// 手动重定向域名列表（直连）
const MANUAL_REDIRECT_DOMAINS = [
  // SharePoint 域名
  'sharepoint.cn',
  'sharepoint.com',
  // EMOS 存储域名
  'emosstore.sbs'
];

// 从CF-Ray头部提取节点代码
function getCFNodeFromRay(cfRay) {
  if (!cfRay || cfRay === '未知') return '未知';
  try {
    const parts = cfRay.split('-');
    return parts.length > 1 ? parts[1] : '未知';
  } catch (e) {
    return '未知';
  }
}

// 检查是否是图片请求（用于缓存）
function isImageRequest(pathname) {
  return pathname && pathname.match(/^\/emby\/Items\/.+\/Images\//);
}

// 解析User-Agent获取设备类型
function getDeviceType(userAgent) {
  if (!userAgent) return '未知';
  
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return '移动设备';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return '平板设备';
  } else if (ua.includes('tv') || ua.includes('smart-tv') || ua.includes('appletv')) {
    return '电视/机顶盒';
  } else if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) {
    return '爬虫/Bot';
  } else {
    return '桌面设备';
  }
}

// 获取浏览器信息
function getBrowserInfo(userAgent) {
  if (!userAgent) return '未知';
  
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('chrome') && !ua.includes('edg')) {
    return 'Chrome';
  } else if (ua.includes('firefox')) {
    return 'Firefox';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    return 'Safari';
  } else if (ua.includes('edg')) {
    return 'Microsoft Edge';
  } else if (ua.includes('opera') || ua.includes('opr')) {
    return 'Opera';
  } else if (ua.includes('trident') || ua.includes('msie')) {
    return 'Internet Explorer';
  } else {
    return '其他浏览器';
  }
}

// 获取操作系统信息
function getOSInfo(userAgent) {
  if (!userAgent) return '未知';
  
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('windows')) {
    return 'Windows';
  } else if (ua.includes('mac os') || ua.includes('macos')) {
    return 'macOS';
  } else if (ua.includes('linux') && !ua.includes('android')) {
    return 'Linux';
  } else if (ua.includes('android')) {
    return 'Android';
  } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
    return 'iOS/iPadOS';
  } else {
    return '其他系统';
  }
}

// 生成延迟检测页面（中国大陆用户访问时）
function generateLatencyPage(ip, country, cfRay, cfNode, userAgent, latency) {
  const deviceType = getDeviceType(userAgent);
  const browser = getBrowserInfo(userAgent);
  const os = getOSInfo(userAgent);
  const countryName = getCountryName(country);
  const now = new Date();
  
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EMBY反代延迟检测 - fd.dirige.de5.net</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Microsoft YaHei', 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .container {
            background-color: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .header h1 {
            color: #333;
            font-size: 28px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        
        .header h1::before {
            content: "⚡";
        }
        
        .header p {
            color: #666;
            font-size: 16px;
        }
        
        .latency-card {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .latency-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
            animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        .latency-value {
            font-size: 64px;
            font-weight: bold;
            margin: 20px 0;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .latency-label {
            font-size: 18px;
            opacity: 0.9;
        }
        
        .latency-status {
            display: inline-block;
            padding: 8px 16px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            margin-top: 10px;
            font-size: 14px;
            backdrop-filter: blur(5px);
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .info-item {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 15px;
            border-left: 4px solid #4facfe;
        }
        
        .info-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-value {
            font-size: 16px;
            color: #333;
            font-weight: 500;
            word-break: break-word;
        }
        
        .device-info {
            background-color: #f0f7ff;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
        }
        
        .device-info h3 {
            color: #333;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .device-info h3::before {
            content: "💻";
        }
        
        .device-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
        }
        
        .device-item {
            display: flex;
            flex-direction: column;
        }
        
        .device-label {
            font-size: 12px;
            color: #666;
            margin-bottom: 3px;
        }
        
        .device-value {
            font-size: 14px;
            color: #333;
            font-weight: 500;
        }
        
        .actions {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        .btn {
            flex: 1;
            min-width: 150px;
            padding: 14px 20px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            text-align: center;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        .btn-secondary {
            background-color: white;
            color: #667eea;
            border: 2px solid #667eea;
        }
        
        .btn-secondary:hover {
            background-color: #f8f9fa;
            transform: translateY(-2px);
        }
        
        .footer {
            margin-top: 30px;
            text-align: center;
            color: #666;
            font-size: 13px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        
        .latency-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .latency-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #4caf50;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .ping-line {
            height: 3px;
            background: linear-gradient(90deg, transparent, #4caf50, transparent);
            margin: 10px 0;
            position: relative;
            overflow: hidden;
        }
        
        .ping-line::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, white, transparent);
            animation: ping 3s infinite;
        }
        
        @keyframes ping {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .refresh-btn {
            background-color: transparent;
            border: none;
            color: #667eea;
            cursor: pointer;
            font-size: 14px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            margin-top: 10px;
        }
        
        .refresh-btn:hover {
            color: #764ba2;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 25px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
            }
            
            .latency-value {
                font-size: 48px;
            }
            
            .btn {
                min-width: 100%;
            }
            
            .actions {
                flex-direction: column;
            }
        }
        
        @media (max-width: 480px) {
            .container {
                padding: 20px;
            }
            
            .latency-value {
                font-size: 36px;
            }
            
            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>EMBY反代延迟检测</h1>
            <p>实时测量您连接到EMBY服务器的网络延迟</p>
        </div>
        
        <div class="latency-card">
            <div class="latency-indicator">
                <div class="latency-dot"></div>
                <span class="latency-label">实时延迟</span>
            </div>
            
            <div class="ping-line"></div>
            
            <div class="latency-value">${latency}ms</div>
            
            <div class="latency-status">
                ${latency < 100 ? '极佳' : latency < 200 ? '良好' : latency < 300 ? '一般' : '较差'}连接质量
            </div>
        </div>
        
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">IP地址</div>
                <div class="info-value" id="ip-address">${ip}</div>
            </div>
            
            <div class="info-item">
                <div class="info-label">所在地区</div>
                <div class="info-value">${countryName} (${country})</div>
            </div>
            
            <div class="info-item">
                <div class="info-label">CF节点</div>
                <div class="info-value">${cfNode}</div>
            </div>
            
            <div class="info-item">
                <div class="info-label">设备类型</div>
                <div class="info-value">${deviceType}</div>
            </div>
        </div>
        
        <div class="device-info">
            <h3>设备信息</h3>
            <div class="device-details">
                <div class="device-item">
                    <div class="device-label">浏览器</div>
                    <div class="device-value">${browser}</div>
                </div>
                
                <div class="device-item">
                    <div class="device-label">操作系统</div>
                    <div class="device-value">${os}</div>
                </div>
                
                <div class="device-item">
                    <div class="device-label">CF-Ray</div>
                    <div class="device-value">${cfRay}</div>
                </div>
                
                <div class="device-item">
                    <div class="device-label">检测时间</div>
                    <div class="device-value">${now.toLocaleString('zh-CN')}</div>
                </div>
            </div>
        </div>
        
        <div class="actions">
            <a href="/emby" class="btn btn-primary">
                <span>🎬</span>
                访问EMBY服务
            </a>
            <a href="https://fd.dirige.de5.net/" target="_blank" class="btn btn-secondary">
                <span>🌐</span>
                通用反代服务
            </a>
            <button class="btn btn-secondary" onclick="testLatency()">
                <span>🔄</span>
                重新测试延迟
            </button>
        </div>
        
        <div class="footer">
            <p>© ${now.getFullYear()} emos.dirige.de5.net | EMBY反代服务</p>
            <p style="margin-top: 10px;">交流反馈群组: <a href="https://t.me/Dirige_Proxy" target="_blank" style="color: #667eea; text-decoration: none;">https://t.me/Dirige_Proxy</a></p>
            <button class="refresh-btn" onclick="window.location.reload()">
                <span>↻</span>
                刷新页面
            </button>
        </div>
    </div>
    
    <script>
        // 延迟测试函数
        async function testLatency() {
            const startTime = performance.now();
            const latencyCard = document.querySelector('.latency-card');
            const latencyValue = document.querySelector('.latency-value');
            const latencyStatus = document.querySelector('.latency-status');
            
            // 显示测试中状态
            latencyValue.textContent = '测试中...';
            latencyValue.style.color = '#ff9800';
            latencyCard.style.background = 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)';
            
            try {
                // 创建一个测试请求
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);
                
                // 使用一个轻量级的测试端点
                const response = await fetch('/emby/system/info/public', {
                    method: 'HEAD',
                    signal: controller.signal,
                    cache: 'no-store'
                });
                
                clearTimeout(timeoutId);
                const endTime = performance.now();
                const latency = Math.round(endTime - startTime);
                
                // 更新延迟显示
                latencyValue.textContent = latency + 'ms';
                latencyValue.style.color = 'white';
                
                // 根据延迟设置颜色和状态
                let gradient = '';
                let status = '';
                
                if (latency < 100) {
                    gradient = 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)';
                    status = '极佳连接质量';
                } else if (latency < 200) {
                    gradient = 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)';
                    status = '良好连接质量';
                } else if (latency < 300) {
                    gradient = 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)';
                    status = '一般连接质量';
                } else {
                    gradient = 'linear-gradient(135deg, #f44336 0%, #ff9800 100%)';
                    status = '较差连接质量';
                }
                
                latencyCard.style.background = gradient;
                latencyStatus.textContent = status;
                
            } catch (error) {
                // 测试失败
                latencyValue.textContent = '超时';
                latencyValue.style.color = '#f44336';
                latencyCard.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
                latencyStatus.textContent = '连接失败';
                
                console.error('延迟测试失败:', error);
            }
        }
        
        // 页面加载时自动测试一次延迟
        document.addEventListener('DOMContentLoaded', function() {
            // 可以取消注释下面这行来启用自动测试
            // setTimeout(testLatency, 100);
        });
        
        // 添加键盘快捷键
        document.addEventListener('keydown', function(e) {
            if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                window.location.reload();
            }
            if (e.key === 't' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                testLatency();
            }
            if (e.key === 'F5') {
                e.preventDefault();
                window.location.reload();
            }
        });
        
        // 5分钟自动刷新
        setTimeout(function() {
            window.location.reload();
        }, 5 * 60 * 1000);
    </script>
</body>
</html>`;
}

// 非中国大陆IP访问的页面
function generateBlockedPage(ip, country, cfRay, cfNode) {
  const countryName = getCountryName(country);
  const displayCountry = country === '未知' ? '未知' : `${countryName} (${country})`;
  
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>访问受限 - emos.dirige.de5.net</title>
    <style>
        body {
            font-family: 'Microsoft YaHei', 'Segoe UI', Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 2px 15px rgba(0,0,0,0.1);
            border-left: 5px solid #f44336;
        }
        h1 {
            color: #f44336;
            margin-top: 0;
            border-bottom: 2px solid #eee;
            padding-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        h1::before {
            content: "🚫";
        }
        .info-box {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 20px;
            margin: 25px 0;
        }
        .info-item {
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
        }
        .info-label {
            font-weight: bold;
            color: #555;
            width: 120px;
            flex-shrink: 0;
        }
        .info-value {
            color: #222;
            font-family: 'Consolas', 'Monaco', monospace;
            word-break: break-all;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 25px 0;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        .warning::before {
            content: "⚠️";
            font-size: 1.2em;
        }
        .solution {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 20px;
            border-radius: 5px;
            margin: 25px 0;
        }
        .proxy-info {
            background-color: #e6f7ff;
            border: 1px solid #91d5ff;
            color: #0050b3;
            padding: 20px;
            border-radius: 5px;
            margin: 25px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
            text-align: center;
        }
        .copy-btn {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            margin-left: 10px;
        }
        .copy-btn:hover {
            background-color: #0056b3;
        }
        .success-message {
            color: #28a745;
            font-size: 12px;
            margin-left: 10px;
            display: none;
        }
        ol, ul {
            padding-left: 20px;
        }
        li {
            margin: 8px 0;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        code {
            background-color: #f1f1f1;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Consolas', monospace;
            font-size: 14px;
        }
        pre {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 15px;
            overflow-x: auto;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>访问受限</h1>
        
        <div class="warning">
            <div>
                <strong>注意：</strong>当前服务器仅允许中国大陆地区直连访问，检测到您的网络环境不符合访问条件。
            </div>
        </div>
        
        <div class="info-box">
            <h3>📊 您的连接信息：</h3>
            <div class="info-item">
                <span class="info-label">IP地址：</span>
                <span class="info-value" id="ip-address">${ip}</span>
                <button class="copy-btn" onclick="copyToClipboard('${ip}')">复制</button>
                <span class="success-message" id="ip-copied">已复制</span>
            </div>
            <div class="info-item">
                <span class="info-label">地区：</span>
                <span class="info-value">${displayCountry}</span>
            </div>
            <div class="info-item">
                <span class="info-label">CF节点：</span>
                <span class="info-value">${cfNode}</span>
            </div>
            <div class="info-item">
                <span class="info-label">代理状态：</span>
                <span class="info-value">liuerao</span>
            </div>
        </div>
        
        <div class="solution">
            <h3>✅ 解决方案：</h3>
            <p>请按照以下步骤操作后重试：</p>
            <ol>
                <li>关闭代理/VPN软件（如果正在使用）</li>
                <li>将域名 <strong id="domain-name">emos.dirige.de5.net</strong> 添加到您的直连规则中
                    <button class="copy-btn" onclick="copyToClipboard('emos.dirige.de5.net')">复制</button>
                    <span class="success-message" id="domain-copied">已复制</span>
                </li>
                <li>清空浏览器缓存后重新访问</li>
            </ol>
        </div>
        
        <div class="proxy-info">
            <h3>🌐 通用反代服务：</h3>
            <p>我们还提供通用反代服务：</p>
            <ul>
                <li><strong>通用反代地址：</strong> https://fd.dirige.de5.net</li>
            </ul>
            <p><strong>使用说明：</strong></p>
            <ol>
                <li>通用反代支持代理任意网站</li>
                <li>使用方法：访问 <code>https://https://fd.dirige.de5.net/?url=目标网址</code></li>
                <li>例如：<code>https://https://fd.dirige.de5.net/?url=https://example.com</code></li>
                <li>支持GET和POST请求</li>
                <li>同样仅限中国大陆用户使用</li>
            </ol>
            <p><strong>API接口示例：</strong></p>
            <pre>// JavaScript Fetch API 示例
fetch('https://https://fd.dirige.de5.net/?url=https://api.example.com/data', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => console.log(data));</pre>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} emos.dirige.de5.net | 仅限中国大陆用户访问</p>
            <p style="margin-top: 10px;">交流反馈群组: <a href="https://t.me/Dirige_Proxy" target="_blank" style="color: #007bff; text-decoration: none;">https://t.me/Dirige_Proxy</a></p>
        </div>
    </div>
    
    <script>
        // 复制文本到剪贴板
        function copyToClipboard(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            
            // 显示成功消息
            let messageId = '';
            if (text.includes('255432')) messageId = 'domain-copied';
            else if (text.includes(':')) messageId = 'ip-copied';
            
            const successMessage = document.getElementById(messageId);
            if (successMessage) {
                successMessage.style.display = 'inline';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 2000);
            }
        }
        
        // 自动复制域名到剪贴板
        document.addEventListener('DOMContentLoaded', function() {
            // 可选：自动复制域名到剪贴板
            // copyToClipboard('emos.dirige.de5.net');
        });
    </script>
</body>
</html>`;
}

// 测量延迟到目标服务器
async function measureLatency() {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // 使用一个简单的请求来测量延迟
    const response = await fetch(myConfig.target + '/emby/system/info/public', {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'EMBY-Proxy-Latency-Check/1.0'
      }
    });
    
    clearTimeout(timeoutId);
    const endTime = Date.now();
    return endTime - startTime;
  } catch (error) {
    console.error('延迟测量失败:', error);
    return 999; // 返回一个较大的延迟值表示失败
  }
}

export default {
  async fetch(req, env, ctx) {
    try {
      // 获取连接信息
      const country = req.headers.get('cf-ipcountry') || '未知';
      const isChina = country === 'CN';
      const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || '未知';
      const cfRay = req.headers.get('cf-ray') || '未知';
      const cfNode = getCFNodeFromRay(cfRay);
      const userAgent = req.headers.get('User-Agent') || '未知';
      const url = new URL(req.url);
      
      // 检查是否是根路径访问
      const isRootPath = url.pathname === '/' || url.pathname === '';
      
      // 如果不是中国大陆IP，显示拦截页面
      if (!isChina) {
        const html = generateBlockedPage(ip, country, cfRay, cfNode);
        return new Response(html, {
          status: 403,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });
      }
      
      // 如果是中国大陆IP且访问根路径，显示延迟检测页面
      if (isChina && isRootPath) {
        // 测量延迟
        const latency = await measureLatency();
        
        const html = generateLatencyPage(ip, country, cfRay, cfNode, userAgent, latency);
        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache, must-revalidate'
          }
        });
      }
      
      // 否则，继续正常的反向代理逻辑
      const u = new URL(req.url);
      const t = new URL(myConfig.target);
      
      // 确保路径以 /emby 开头（如果请求的路径不是以/emby开头）
      let pathname = u.pathname;
      if (!pathname.startsWith('/emby')) {
        pathname = '/emby' + (pathname === '/' ? '' : pathname);
      }
      
      // 构建目标URL
      u.protocol = t.protocol;
      u.hostname = t.hostname;
      u.port = t.port;
      u.pathname = pathname;
      
      // 对 /emby/Sessions/Playing/Progress 接口进行节流处理
      if (pathname.endsWith('/Sessions/Playing/Progress')) {
          // 这里可以实现更复杂的节流逻辑
          // 例如使用 KV 存储记录请求时间，限制频率
      }
      
      // 构建请求头
      const h = new Headers(req.headers);
      h.set('Host', t.hostname);
      
      // 设置必要头部
      h.set('EMOS-PROXY-ID', myConfig.proxyId);
      h.set('EMOS-PROXY-NAME', myConfig.proxyName);
      h.set('X-Forwarded-For', ip);
      
      // 传递 Range 头部（支持 206 状态码）
      if (req.headers.get('Range')) {
          h.set('Range', req.headers.get('Range'));
      }
      
      // 处理Referer和Origin
      if (h.has('Referer')) {
        const refererUrl = new URL(req.headers.get('Referer'));
        refererUrl.hostname = t.hostname;
        refererUrl.port = t.port;
        if (!refererUrl.pathname.startsWith('/emby')) {
          refererUrl.pathname = '/emby' + (refererUrl.pathname === '/' ? '' : refererUrl.pathname);
        }
        h.set('Referer', refererUrl.toString());
      }
      
      if (h.has('Origin')) {
        const originUrl = new URL(req.headers.get('Origin'));
        originUrl.hostname = t.hostname;
        originUrl.port = t.port;
        h.set('Origin', originUrl.toString());
      }
      
      // 检查是否是需要直连的域名
      let shouldDirectConnect = false;
      for (const domain of MANUAL_REDIRECT_DOMAINS) {
        if (u.hostname.endsWith(domain)) {
          shouldDirectConnect = true;
          break;
        }
      }
      
      const r = new Request(u.toString(), {
        method: req.method,
        headers: h,
        body: req.body,
        redirect: shouldDirectConnect ? 'follow' : 'follow'
      });
      
      const res = await fetch(r);
      
      // 处理响应头
      const rh = new Headers(res.headers);
      
      // 设置CORS
      if (myConfig.enableCors) {
        rh.set('Access-Control-Allow-Origin', '*');
        rh.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        rh.set('Access-Control-Allow-Headers', '*');
      }
      
      // 为图片请求设置缓存
      if (isImageRequest(pathname)) {
        rh.set('Cache-Control', `public, max-age=${myConfig.imageCacheMaxAge}`);
      } else if (pathname === '/emby/System/Ping') {
        // 缓存 Ping 请求 5分钟
        rh.set('Cache-Control', 'public, max-age=300');
      }
      
      // 处理206状态码（视频流）
      if (res.status === 206) {
        return new Response(res.body, {
          status: 206,
          statusText: res.statusText,
          headers: rh
        });
      }
      
      return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers: rh
      });
    } catch (err) {
      // 返回简化的错误页面
      return new Response(`服务暂时不可用：${err.message}`, { 
        status: 502,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache'
        }
      });
    }
  }
};