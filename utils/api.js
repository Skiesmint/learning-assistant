const APP_KEY = 'df59d20ca26e4f67abbfbb0464d05d5d';
const MODEL_ID = '9dc913a037774fc0b248376905c85da5';
const API_URL = 'https://wishub-x1.ctyun.cn/v1/chat/completions';

// 生成时间戳和签名
const generateAuthInfo = () => {
  const timestamp = Date.now();
  // 这里应该添加签名生成逻辑，但天翼云的文档中没有明确说明签名算法
  // 暂时返回基本信息
  return {
    timestamp,
    nonce: Math.random().toString(36).substr(2, 15)
  };
};

const callAIAPI = async (prompt, imageBase64 = null) => {
  try {
    let messages = [];
    
    if (imageBase64) {
      messages = [
        {
          role: "system",
          content: "你是一个专业的学习助手，可以帮助分析图片中的问题并给出详细解答。"
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image",
              data: imageBase64
            }
          ]
        }
      ];
    } else {
      messages = [
        {
          role: "system",
          content: "你是一个专业的学习助手，可以帮助解答各种学习问题。"
        },
        {
          role: "user",
          content: prompt
        }
      ];
    }

    const requestData = {
      model: MODEL_ID,
      messages: messages,
      temperature: 0.7,
      top_p: 0.95,
      top_k: 20,
      max_tokens: 2000,
      stream: false
    };

    const authInfo = generateAuthInfo();

    console.log('发送请求数据：', {
      url: API_URL,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APP_KEY}`,
        'X-Timestamp': authInfo.timestamp,
        'X-Nonce': authInfo.nonce
      },
      data: requestData
    });

    return new Promise((resolve, reject) => {
      wx.request({
        url: API_URL,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${APP_KEY}`,
          'X-Timestamp': authInfo.timestamp,
          'X-Nonce': authInfo.nonce
        },
        data: requestData,
        success: (res) => {
          console.log('API响应：', res);
          if (res.statusCode === 200 && res.data) {
            if (res.data.code === 0) {
              resolve(res.data);
            } else {
              console.error('API业务错误：', res.data);
              const errorMsg = res.data.error ? 
                `${res.data.error.message} (${res.data.error.code})` : 
                (res.data.msg || '请求失败');
              reject(new Error(errorMsg));
            }
          } else {
            console.error('API响应错误：', res);
            let errorMsg = '请求失败';
            if (res.data && res.data.error) {
              errorMsg = `${res.data.error.message} (${res.data.error.code})`;
            } else if (res.statusCode === 403) {
              errorMsg = 'API密钥无效或已过期';
            }
            reject(new Error(errorMsg));
          }
        },
        fail: (error) => {
          console.error('请求失败：', error);
          if (error.errMsg.includes('fail url not in domain list')) {
            reject(new Error('请在开发工具中勾选"不校验合法域名"选项'));
          } else if (error.errMsg.includes('ERR_NAME_NOT_RESOLVED')) {
            reject(new Error('网络连接失败，请检查网络设置'));
          } else {
            reject(error);
          }
        }
      });
    });
  } catch (error) {
    console.error('API调用错误：', error);
    throw error;
  }
};

// 测试API是否可用
const testAPI = async () => {
  try {
    const response = await callAIAPI('你好，请用中文做个简短的自我介绍');
    console.log('API测试成功：', response);
    if (response.code === 0) {
      return true;
    } else {
      throw new Error(response.msg || '未知错误');
    }
  } catch (error) {
    console.error('API测试失败：', error);
    wx.showModal({
      title: '提示',
      content: `API连接失败：${error.message}\n\n可能的原因：\n1. API密钥无效或已过期\n2. 网络连接问题\n3. 服务器响应错误\n\n请检查API配置或联系管理员。`,
      showCancel: false
    });
    return false;
  }
};

module.exports = {
  callAIAPI,
  testAPI
}; 