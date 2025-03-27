document.addEventListener('DOMContentLoaded', async () => {
    const loadingElement = document.getElementById('loading');
    const resultElement = document.getElementById('result');
    const ipDataElement = document.getElementById('ip-data');

    try {
        const response = await fetch('/api/github-ip');
        const data = await response.json();

        // 格式化数据显示
        const formattedData = JSON.stringify(data, null, 2);
        ipDataElement.textContent = formattedData;

        // 隐藏加载提示，显示结果
        loadingElement.style.display = 'none';
        resultElement.style.display = 'block';
    } catch (error) {
        loadingElement.textContent = 'Error loading GitHub IP information. Please try again later.';
        console.error('Error:', error);
    }
}); 