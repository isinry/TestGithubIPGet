// 创建一个日志工具对象
const Logger = {
    info: (message, data = null) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] INFO: ${message}`, data ? data : '');
    },
    error: (message, error = null) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] ERROR: ${message}`, error ? error : '');
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    Logger.info('页面加载完成，开始初始化');
    const loadingElement = document.getElementById('loading');
    const resultElement = document.getElementById('result');
    const ipDataElement = document.getElementById('ip-data');

    try {
        Logger.info('开始请求 GitHub IP 信息');
        const response = await fetch('/api/github-ip');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        Logger.info('成功获取响应', { status: response.status });
        const data = await response.json();
        Logger.info('成功解析数据', data);

        // 格式化数据显示
        const formattedData = JSON.stringify(data, null, 2);
        ipDataElement.textContent = formattedData;
        Logger.info('数据已格式化并显示在页面上');

        // 隐藏加载提示，显示结果
        loadingElement.style.display = 'none';
        resultElement.style.display = 'block';
        Logger.info('UI 更新完成');
    } catch (error) {
        Logger.error('获取或处理数据时出错', error);
        loadingElement.textContent = 'Error loading GitHub IP information. Please try again later.';
    }
}); 