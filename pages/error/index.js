// pages/error/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    originalQuestion: '已知函数f(x) = x² + 2x + 1，求f(x)的导数。',
    errorAnalysis: '在求导过程中，没有正确应用幂函数的导数公式。应该先对x²求导，再对2x求导，最后对常数项求导。',
    transformedQuestions: [
      {
        id: 1,
        type: '数字变形',
        content: '已知函数f(x) = x³ + 3x + 2，求f(x)的导数。'
      },
      {
        id: 2,
        type: '逆向提问',
        content: '已知函数f(x)的导数为2x + 2，且f(0) = 1，求f(x)。'
      },
      {
        id: 3,
        type: '条件置换',
        content: '已知函数f(x) = ax² + bx + c，其中a、b、c为常数，求f(x)的导数。'
      }
    ],
    interferenceQuestion: '已知函数f(x) = x² + 2x + 1，求f(x)的导数。',
    interferenceOptions: [
      {
        id: 1,
        label: 'A',
        content: 'f\'(x) = 2x + 2',
        isCorrect: true
      },
      {
        id: 2,
        label: 'B',
        content: 'f\'(x) = x² + 2',
        isWrong: true
      },
      {
        id: 3,
        label: 'C',
        content: 'f\'(x) = 2x + 1',
        isWrong: true
      },
      {
        id: 4,
        label: 'D',
        content: 'f\'(x) = x + 2',
        isWrong: true
      }
    ],
    showFeedback: false,
    feedbackContent: '',
    wrongSolution: [
      '直接对x²求导得到2x',
      '对2x求导得到2',
      '对1求导得到0',
      '所以f\'(x) = 2x + 2 + 0 = 2x + 2'
    ],
    correctSolution: [
      '对x²求导得到2x',
      '对2x求导得到2',
      '对常数项1求导得到0',
      '所以f\'(x) = 2x + 2'
    ],
    analysisPoints: [
      {
        icon: '1',
        content: '错误解法中多写了一个+0，这是不必要的步骤'
      },
      {
        icon: '2',
        content: '正确解法更加简洁，直接写出最终结果'
      },
      {
        icon: '3',
        content: '两种解法在求导的基本步骤上是相同的，只是表达方式不同'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadErrorData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 加载错题数据
  loadErrorData: function() {
    this.setData({ loading: true });
    // 模拟数据加载
    setTimeout(() => {
      this.setData({ loading: false });
    }, 1000);
  },

  // 解题
  solveQuestion: function(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/error/solve/index?id=${id}`
    });
  },

  // 显示提示
  showHint: function(e) {
    const { id } = e.currentTarget.dataset;
    const question = this.data.transformedQuestions.find(q => q.id === id);
    wx.showModal({
      title: '解题提示',
      content: this.getHintByType(question.type),
      showCancel: false
    });
  },

  // 根据题型获取提示
  getHintByType: function(type) {
    const hints = {
      '数字变形': '注意观察数字的变化，但解题思路保持不变',
      '逆向提问': '从导数反推原函数时，需要加上常数项',
      '条件置换': '将具体数字替换为字母后，求导规则仍然适用'
    };
    return hints[type] || '请仔细分析题目条件，运用相应的求导公式';
  },

  // 选择选项
  selectOption: function(e) {
    const { id } = e.currentTarget.dataset;
    const options = this.data.interferenceOptions.map(option => ({
      ...option,
      selected: option.id === id
    }));

    this.setData({ interferenceOptions: options });

    const selectedOption = options.find(option => option.id === id);
    if (selectedOption.isCorrect) {
      this.showCorrectFeedback();
    } else {
      this.showWrongFeedback();
    }
  },

  // 显示正确反馈
  showCorrectFeedback: function() {
    this.setData({
      showFeedback: true,
      feedbackContent: '回答正确！你成功避免了干扰选项，准确应用了求导公式。'
    });
  },

  // 显示错误反馈
  showWrongFeedback: function() {
    this.setData({
      showFeedback: true,
      feedbackContent: '回答错误。请仔细检查求导过程，确保正确应用了求导公式。'
    });
  },

  // 下一题
  nextQuestion: function() {
    this.setData({
      showFeedback: false,
      interferenceOptions: this.data.interferenceOptions.map(option => ({
        ...option,
        selected: false,
        isCorrect: false,
        isWrong: false
      }))
    });
    this.loadNextQuestion();
  },

  // 加载下一题
  loadNextQuestion: function() {
    // 模拟加载下一题
    this.setData({ loading: true });
    setTimeout(() => {
      this.setData({
        loading: false,
        interferenceQuestion: '已知函数f(x) = x³ + 3x + 2，求f(x)的导数。',
        interferenceOptions: [
          {
            id: 1,
            label: 'A',
            content: 'f\'(x) = 3x² + 3',
            isCorrect: true
          },
          {
            id: 2,
            label: 'B',
            content: 'f\'(x) = x² + 3',
            isWrong: true
          },
          {
            id: 3,
            label: 'C',
            content: 'f\'(x) = 3x + 3',
            isWrong: true
          },
          {
            id: 4,
            label: 'D',
            content: 'f\'(x) = x³ + 3',
            isWrong: true
          }
        ]
      });
    }, 1000);
  },

  // 复习
  reviewQuestion: function() {
    wx.navigateTo({
      url: '/pages/error/review/index'
    });
  }
})