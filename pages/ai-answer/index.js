const { callAIAPI } = require('../../utils/api.js');

Page({
  data: {
    tempImagePath: '',
    question: '',
    answer: '',
    isLoading: false
  },

  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('选择图片成功：', res.tempFilePaths[0]);
        this.setData({
          tempImagePath: res.tempFilePaths[0]
        });
      },
      fail: (error) => {
        console.error('选择图片失败：', error);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  onQuestionInput(e) {
    this.setData({
      question: e.detail.value
    });
  },

  async submitQuestion() {
    if (!this.data.tempImagePath && !this.data.question) {
      wx.showToast({
        title: '请上传图片或输入问题',
        icon: 'none'
      });
      return;
    }

    this.setData({ isLoading: true });

    try {
      let imageBase64 = '';
      if (this.data.tempImagePath) {
        try {
          const fileManager = wx.getFileSystemManager();
          imageBase64 = fileManager.readFileSync(this.data.tempImagePath, 'base64');
          console.log('图片转base64成功');
        } catch (error) {
          console.error('图片转base64失败：', error);
          wx.showToast({
            title: '图片处理失败',
            icon: 'none'
          });
          this.setData({ isLoading: false });
          return;
        }
      }

      const prompt = this.data.question || '请分析这张图片并给出详细解答';
      console.log('开始调用API');
      const response = await callAIAPI(prompt, imageBase64);
      console.log('API调用成功：', response);

      if (response.code === 0 && response.choices && response.choices.length > 0) {
        const answer = response.choices[0].message.content;
        console.log('获取到的回答：', answer);
        this.setData({
          answer: answer,
          isLoading: false
        });
      } else {
        console.error('API返回数据格式不正确：', response);
        throw new Error('获取答案失败，请重试');
      }
    } catch (error) {
      console.error('获取答案失败：', error);
      wx.showToast({
        title: error.message || '获取答案失败，请重试',
        icon: 'none',
        duration: 2000
      });
      this.setData({ isLoading: false });
    }
  }
}); 