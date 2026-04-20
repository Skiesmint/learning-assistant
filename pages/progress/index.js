// pages/progress/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    currentYear: 2024,
    currentMonth: 3,
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    calendarDays: [],
    selectedDatePlan: null,
    achievements: [
      {
        id: 1,
        title: '连续5天战胜同类错误',
        description: '连续5天解决同一类型的错误',
        progress: 60,
        unlocked: false
      },
      {
        id: 2,
        title: '解题速度提升',
        description: '解题速度提升20%',
        progress: 80,
        unlocked: false
      },
      {
        id: 3,
        title: '知识图谱完成度',
        description: '完成所有知识点的学习',
        progress: 30,
        unlocked: false
      }
    ],
    abilityData: {
      speed: [],
      path: [],
      accuracy: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initCalendar();
    this.loadAbilityData();
    this.loadAchievements();
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

  // 初始化日历
  initCalendar: function() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    this.setData({
      currentYear: year,
      currentMonth: month
    });

    this.generateCalendarDays(year, month, day);
  },

  // 生成日历数据
  generateCalendarDays: function(year, month, today) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const days = [];
    
    // 填充上个月的日期
    const firstDayWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
    for (let i = firstDayWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        date: `${year}-${month-1}-${prevMonthLastDay - i}`,
        isCurrentMonth: false,
        hasPlan: false
      });
    }

    // 填充当前月的日期
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        day: i,
        date: `${year}-${month}-${i}`,
        isCurrentMonth: true,
        hasPlan: this.checkHasPlan(year, month, i),
        isToday: i === today
      });
    }

    // 填充下个月的日期
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        date: `${year}-${month+1}-${i}`,
        isCurrentMonth: false,
        hasPlan: false
      });
    }

    this.setData({ calendarDays: days });
  },

  // 检查日期是否有计划
  checkHasPlan: function(year, month, day) {
    // 模拟数据，实际应该从服务器获取
    const date = `${year}-${month}-${day}`;
    return Math.random() > 0.7;
  },

  // 加载能力数据
  loadAbilityData: function() {
    // 模拟数据，实际应该从服务器获取
    const data = {
      speed: Array.from({length: 7}, () => Math.floor(Math.random() * 30 + 70)),
      path: Array.from({length: 7}, () => Math.floor(Math.random() * 30 + 70)),
      accuracy: Array.from({length: 7}, () => Math.floor(Math.random() * 30 + 70))
    };

    this.setData({ abilityData: data });
    this.drawAbilityCurve();
  },

  // 绘制能力曲线
  drawAbilityCurve: function() {
    const ctx = wx.createCanvasContext('abilityCurve');
    const { speed, path, accuracy } = this.data.abilityData;
    const width = 600;
    const height = 400;
    const padding = 40;

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 绘制坐标轴
    ctx.beginPath();
    ctx.setLineWidth(2);
    ctx.setStrokeStyle('#ddd');
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // 绘制数据线
    const drawLine = (data, color) => {
      ctx.beginPath();
      ctx.setLineWidth(3);
      ctx.setStrokeStyle(color);
      data.forEach((value, index) => {
        const x = padding + (index * (width - 2 * padding)) / (data.length - 1);
        const y = height - padding - (value - 70) * (height - 2 * padding) / 30;
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    };

    drawLine(speed, '#FF9800');
    drawLine(path, '#4CAF50');
    drawLine(accuracy, '#2196F3');

    ctx.draw();
  },

  // 加载成就数据
  loadAchievements: function() {
    // 模拟数据，实际应该从服务器获取
    const achievements = this.data.achievements.map(achievement => ({
      ...achievement,
      unlocked: Math.random() > 0.5
    }));

    this.setData({ achievements });
  },

  // 切换月份
  prevMonth: function() {
    let { currentYear, currentMonth } = this.data;
    if (currentMonth === 1) {
      currentYear--;
      currentMonth = 12;
    } else {
      currentMonth--;
    }
    this.setData({ currentYear, currentMonth });
    this.generateCalendarDays(currentYear, currentMonth);
  },

  nextMonth: function() {
    let { currentYear, currentMonth } = this.data;
    if (currentMonth === 12) {
      currentYear++;
      currentMonth = 1;
    } else {
      currentMonth++;
    }
    this.setData({ currentYear, currentMonth });
    this.generateCalendarDays(currentYear, currentMonth);
  },

  // 选择日期
  selectDate: function(e) {
    const { date } = e.currentTarget.dataset;
    // 模拟数据，实际应该从服务器获取
    const plan = [
      {
        id: 1,
        time: '09:00',
        name: '函数概念复习',
        description: '复习函数的基本概念和性质',
        completed: false
      },
      {
        id: 2,
        time: '14:00',
        name: '导数练习',
        description: '完成5道导数计算题',
        completed: true
      }
    ];

    this.setData({ selectedDatePlan: plan });
  }
})