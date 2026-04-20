Page({
  data: {
    loading: true,
    question: {
      content: '',
      type: ''
    },
    analysis: {
      errorType: '',
      errorReason: '',
      knowledgePoints: ''
    },
    solution: {
      steps: [],
      result: ''
    },
    reviewHistory: []
  },

  onLoad: function(options) {
    // 获取错题ID
    const id = options.id;
    this.loadErrorDetail(id);
  },

  // 加载错题详情
  loadErrorDetail: function(id) {
    this.setData({ loading: true });
    
    // 模拟加载数据
    setTimeout(() => {
      const mockData = {
        question: {
          content: '已知函数f(x) = x² + 2x + 1，求f(x)的最小值。',
          type: '函数'
        },
        analysis: {
          errorType: '计算错误',
          errorReason: '在配方法过程中，没有正确处理常数项',
          knowledgePoints: '二次函数、配方法、最值问题'
        },
        solution: {
          steps: [
            '1. 将函数化为标准形式：f(x) = (x + 1)²',
            '2. 由于(x + 1)² ≥ 0，当x = -1时取等号',
            '3. 因此f(x)的最小值为0'
          ],
          result: 'f(x)的最小值为0'
        },
        reviewHistory: [
          {
            date: '2024-03-17',
            status: 'correct',
            statusText: '正确',
            note: '通过配方法成功求解，掌握了二次函数最值的求解方法',
            mistakes: []
          },
          {
            date: '2024-03-16',
            status: 'wrong',
            statusText: '错误',
            note: '配方法使用不当，导致结果错误',
            mistakes: [
              '没有正确处理常数项',
              '配方法步骤不完整'
            ]
          }
        ]
      };

      this.setData({
        ...mockData,
        loading: false
      });
    }, 1000);
  },

  // 开始复习
  startReview: function() {
    wx.navigateTo({
      url: `/pages/error/solve/index?id=${this.data.question.id}`
    });
  },

  // 添加笔记
  addNote: function() {
    wx.showModal({
      title: '添加笔记',
      placeholderText: '请输入你的复习笔记',
      editable: true,
      success: (res) => {
        if (res.confirm && res.content) {
          // 保存笔记
          this.saveNote(res.content);
        }
      }
    });
  },

  // 保存笔记
  saveNote: function(content) {
    wx.showLoading({
      title: '保存中...'
    });
    
    // 模拟保存过程
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
      
      // 更新复习记录
      const newReview = {
        date: new Date().toISOString().split('T')[0],
        status: 'correct',
        statusText: '正确',
        note: content,
        mistakes: []
      };
      
      this.setData({
        reviewHistory: [newReview, ...this.data.reviewHistory]
      });
    }, 1000);
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.loadErrorDetail(this.data.question.id);
    wx.stopPullDownRefresh();
  }
}); 