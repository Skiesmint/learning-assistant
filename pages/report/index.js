// pages/report/index.js
const { callAIAPI } = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    subjects: ['语文', '数学', '英语', '物理', '化学', '生物', '政治', '历史', '地理'],
    subjectIndex: -1,
    score: '',
    rank: '',
    totalStudents: '',
    showReport: false,
    scoreRate: 0,
    rankRate: 0,
    analysis: '',
    isLoading: false,
    scoreHistory: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 从本地存储加载历史成绩数据
    const scoreHistory = wx.getStorageSync('scoreHistory') || [];
    this.setData({ scoreHistory });
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

  onDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  onSubjectChange(e) {
    this.setData({
      subjectIndex: parseInt(e.detail.value)
    });
  },

  onScoreInput(e) {
    this.setData({
      score: e.detail.value
    });
  },

  onRankInput(e) {
    this.setData({
      rank: e.detail.value
    });
  },

  onTotalStudentsInput(e) {
    this.setData({
      totalStudents: e.detail.value
    });
  },

  validateInput() {
    if (!this.data.date) {
      wx.showToast({
        title: '请选择考试日期',
        icon: 'none'
      });
      return false;
    }
    if (this.data.subjectIndex < 0) {
      wx.showToast({
        title: '请选择考试科目',
        icon: 'none'
      });
      return false;
    }
    if (!this.data.score || isNaN(this.data.score) || this.data.score < 0 || this.data.score > 100) {
      wx.showToast({
        title: '请输入有效的分数',
        icon: 'none'
      });
      return false;
    }
    if (!this.data.rank || isNaN(this.data.rank) || this.data.rank < 1) {
      wx.showToast({
        title: '请输入有效的排名',
        icon: 'none'
      });
      return false;
    }
    if (!this.data.totalStudents || isNaN(this.data.totalStudents) || this.data.totalStudents < 1) {
      wx.showToast({
        title: '请输入有效的总人数',
        icon: 'none'
      });
      return false;
    }
    if (parseInt(this.data.rank) > parseInt(this.data.totalStudents)) {
      wx.showToast({
        title: '排名不能大于总人数',
        icon: 'none'
      });
      return false;
    }
    return true;
  },

  async generateReport() {
    if (!this.validateInput()) return;

    this.setData({ isLoading: true });

    try {
      // 计算得分率和排名百分比
      const scoreRate = (parseFloat(this.data.score)).toFixed(1);
      const rankRate = ((1 - this.data.rank / this.data.totalStudents) * 100).toFixed(1);

      // 保存成绩记录
      const newRecord = {
        date: this.data.date,
        subject: this.data.subjects[this.data.subjectIndex],
        score: parseFloat(this.data.score),
        rank: parseInt(this.data.rank),
        totalStudents: parseInt(this.data.totalStudents)
      };

      const scoreHistory = [...this.data.scoreHistory, newRecord];
      wx.setStorageSync('scoreHistory', scoreHistory);

      // 生成AI分析
      const prompt = `请根据以下考试数据生成一份详细的分析报告：
科目：${newRecord.subject}
得分：${newRecord.score}分
排名：${newRecord.rank}/${newRecord.totalStudents}
请从以下几个方面分析：
1. 成绩表现评价
2. 存在的问题
3. 改进建议
请用简明扼要的语言描述。`;

      const response = await callAIAPI(prompt);
      const analysis = response.choices[0].message.content;

      this.setData({
        scoreRate,
        rankRate,
        analysis,
        showReport: true,
        scoreHistory,
        isLoading: false
      });

      // 绘制成绩趋势图
      this.drawScoreChart();

    } catch (error) {
      console.error('生成报告失败：', error);
      wx.showToast({
        title: '生成报告失败，请重试',
        icon: 'none'
      });
      this.setData({ isLoading: false });
    }
  },

  drawScoreChart() {
    const ctx = wx.createCanvasContext('scoreChart');
    const canvasWidth = 300;
    const canvasHeight = 200;
    const padding = 20;
    const chartWidth = canvasWidth - 2 * padding;
    const chartHeight = canvasHeight - 2 * padding;

    // 获取当前科目的历史成绩数据
    const currentSubject = this.data.subjects[this.data.subjectIndex];
    const subjectHistory = this.data.scoreHistory
      .filter(record => record.subject === currentSubject)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (subjectHistory.length === 0) {
      // 如果没有历史数据，显示提示文字
      ctx.setFontSize(14);
      ctx.setFillStyle('#999');
      ctx.fillText('暂无历史成绩数据', canvasWidth / 2 - 50, canvasHeight / 2);
      ctx.draw();
      return;
    }

    // 计算坐标轴范围
    const minScore = Math.min(...subjectHistory.map(record => record.score));
    const maxScore = Math.max(...subjectHistory.map(record => record.score));
    const scoreRange = maxScore - minScore;
    const yMin = Math.floor(minScore - scoreRange * 0.1);
    const yMax = Math.ceil(maxScore + scoreRange * 0.1);

    // 绘制坐标轴
    ctx.setLineWidth(1);
    ctx.setStrokeStyle('#ddd');
    ctx.beginPath();
    // X轴
    ctx.moveTo(padding, canvasHeight - padding);
    ctx.lineTo(canvasWidth - padding, canvasHeight - padding);
    // Y轴
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvasHeight - padding);
    ctx.stroke();

    // 绘制刻度
    ctx.setFontSize(10);
    ctx.setFillStyle('#666');
    // X轴刻度（日期）
    subjectHistory.forEach((record, index) => {
      const x = padding + (index * chartWidth) / (subjectHistory.length - 1);
      const date = new Date(record.date);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      ctx.fillText(dateStr, x - 10, canvasHeight - padding + 15);
    });

    // Y轴刻度（分数）
    const yStep = (yMax - yMin) / 4;
    for (let i = 0; i <= 4; i++) {
      const y = canvasHeight - padding - (i * chartHeight) / 4;
      const score = yMin + i * yStep;
      ctx.fillText(score.toFixed(0), 5, y + 4);
    }

    // 绘制折线
    ctx.setLineWidth(2);
    ctx.setStrokeStyle('#07c160');
    ctx.beginPath();
    subjectHistory.forEach((record, index) => {
      const x = padding + (index * chartWidth) / (subjectHistory.length - 1);
      const y = canvasHeight - padding - 
        ((record.score - yMin) * chartHeight) / (yMax - yMin);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // 绘制数据点
      ctx.setFillStyle('#07c160');
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
    ctx.stroke();

    // 绘制当前成绩点
    const currentScore = parseFloat(this.data.score);
    const currentX = canvasWidth - padding;
    const currentY = canvasHeight - padding - 
      ((currentScore - yMin) * chartHeight) / (yMax - yMin);
    
    ctx.setFillStyle('#ff6b6b');
    ctx.beginPath();
    ctx.arc(currentX, currentY, 4, 0, 2 * Math.PI);
    ctx.fill();

    ctx.draw();
  }
})