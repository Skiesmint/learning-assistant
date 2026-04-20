// pages/knowledge/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    knowledgeGraph: {
      nodes: [],
      edges: []
    },
    knowledgePatches: [],
    forgetPredictions: [],
    scale: 1,
    offset: { x: 0, y: 0 },
    selectedNode: null,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    practiceProgress: {},
    currentPractice: null,
    showAnswer: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadKnowledgeData();
    this.loadPracticeProgress();
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

  // 加载知识数据
  loadKnowledgeData: function() {
    this.setData({ loading: true });
    
    // 模拟加载数据
    setTimeout(() => {
      // 模拟知识图谱数据
      const graphData = {
        nodes: [
          { id: 1, name: '函数', status: 'mastered', x: 300, y: 300 },
          { id: 2, name: '导数', status: 'learning', x: 400, y: 200 },
          { id: 3, name: '积分', status: 'weak', x: 200, y: 400 },
          { id: 4, name: '极限', status: 'forgetting', x: 300, y: 500 }
        ],
        edges: [
          { from: 1, to: 2, type: 'prerequisite' },
          { from: 2, to: 3, type: 'related' },
          { from: 3, to: 4, type: 'extension' }
        ]
      };

      // 模拟知识补丁包数据
      const patches = [
        {
          id: 1,
          title: '导数基础概念',
          status: 'new',
          concept: '导数是函数在某一点的变化率，表示函数在该点的瞬时变化速度。',
          practices: [
            {
              id: 1,
              title: '导数的定义',
              content: '根据导数的定义，计算函数f(x)=x²在x=2处的导数。',
              answer: 'f\'(2) = lim(h→0) [(2+h)² - 2²]/h = 4'
            }
          ]
        }
      ];

      // 模拟遗忘预警数据
      const predictions = [
        {
          id: 1,
          title: '极限概念',
          desc: '预计3天后遗忘概率达到30%',
          lastReview: '2024-03-15'
        }
      ];

      this.setData({
        knowledgeGraph: graphData,
        knowledgePatches: patches,
        forgetPredictions: predictions,
        loading: false
      });

      this.drawKnowledgeGraph();
    }, 1000);
  },

  // 绘制知识图谱
  drawKnowledgeGraph: function() {
    const ctx = wx.createCanvasContext('knowledgeGraph');
    const { nodes, edges, scale, offset } = this.data.knowledgeGraph;
    const canvasWidth = 600;
    const canvasHeight = 600;

    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 应用变换
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    // 绘制边
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.setStrokeStyle('#ddd');
      ctx.stroke();
    });

    // 绘制节点
    nodes.forEach(node => {
      // 绘制节点背景
      ctx.beginPath();
      ctx.arc(node.x, node.y, 40, 0, 2 * Math.PI);
      ctx.setFillStyle(this.getNodeColor(node.status));
      ctx.fill();

      // 绘制节点文字
      ctx.setFillStyle('#fff');
      ctx.setFontSize(24);
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');
      ctx.fillText(node.name, node.x, node.y);
    });

    ctx.draw();
  },

  // 获取节点颜色
  getNodeColor: function(status) {
    const colors = {
      mastered: '#4CAF50',
      learning: '#2196F3',
      weak: '#FFC107',
      forgetting: '#FF5252'
    };
    return colors[status] || '#999';
  },

  // 加载练习进度
  loadPracticeProgress: function() {
    // 从本地存储获取练习进度
    const progress = wx.getStorageSync('practiceProgress') || {};
    this.setData({ practiceProgress: progress });
  },

  // 保存练习进度
  savePracticeProgress: function() {
    wx.setStorageSync('practiceProgress', this.data.practiceProgress);
  },

  // 开始练习
  startPractice: function(e) {
    const { patchId, practiceId } = e.currentTarget.dataset;
    const patch = this.data.knowledgePatches.find(p => p.id === patchId);
    const practice = patch.practices.find(p => p.id === practiceId);

    this.setData({
      currentPractice: {
        ...practice,
        patchId,
        difficulty: this.getDifficultyLevel(patch)
      },
      showAnswer: false
    });

    // 记录开始时间
    this.setData({
      'practiceProgress[`${patchId}_${practiceId}`].startTime': new Date().getTime()
    });
  },

  // 获取难度等级
  getDifficultyLevel: function(patch) {
    const difficultyMap = {
      new: '入门',
      reviewing: '巩固',
      completed: '提升'
    };
    return difficultyMap[patch.status] || '入门';
  },

  // 提交答案
  submitAnswer: function(e) {
    const { answer } = e.detail.value;
    const { currentPractice } = this.data;
    const { patchId, id: practiceId } = currentPractice;

    // 验证答案
    const isCorrect = this.checkAnswer(answer, currentPractice.answer);

    // 更新进度
    const progressKey = `${patchId}_${practiceId}`;
    const progress = {
      ...this.data.practiceProgress[progressKey],
      attempts: (this.data.practiceProgress[progressKey]?.attempts || 0) + 1,
      lastAttempt: new Date().getTime(),
      isCorrect
    };

    this.setData({
      [`practiceProgress.${progressKey}`]: progress
    });

    // 显示结果
    wx.showModal({
      title: isCorrect ? '回答正确！' : '继续加油！',
      content: isCorrect ? '你已经掌握了这个知识点' : '建议查看答案并重新练习',
      showCancel: false,
      success: () => {
        if (isCorrect) {
          this.updatePatchStatus(patchId);
        }
      }
    });

    this.savePracticeProgress();
  },

  // 检查答案
  checkAnswer: function(userAnswer, correctAnswer) {
    // 简单的答案匹配，实际应用中可能需要更复杂的匹配算法
    return userAnswer.trim() === correctAnswer.trim();
  },

  // 更新补丁包状态
  updatePatchStatus: function(patchId) {
    const patches = this.data.knowledgePatches.map(patch => {
      if (patch.id === patchId) {
        const progress = this.data.practiceProgress;
        const allPracticesCompleted = patch.practices.every(practice => 
          progress[`${patchId}_${practice.id}`]?.isCorrect
        );

        if (allPracticesCompleted) {
          return { ...patch, status: 'completed' };
        } else if (patch.status === 'new') {
          return { ...patch, status: 'reviewing' };
        }
      }
      return patch;
    });

    this.setData({ knowledgePatches: patches });
  },

  // 查看答案
  viewAnswer: function(e) {
    const { patchId, practiceId } = e.currentTarget.dataset;
    const patch = this.data.knowledgePatches.find(p => p.id === patchId);
    const practice = patch.practices.find(p => p.id === practiceId);

    this.setData({
      currentPractice: {
        ...practice,
        patchId
      },
      showAnswer: true
    });
  },

  // 获取练习进度
  getPracticeProgress: function(patchId, practiceId) {
    return this.data.practiceProgress[`${patchId}_${practiceId}`] || {
      attempts: 0,
      isCorrect: false
    };
  },

  // 复习遗忘知识点
  reviewForgotten: function(e) {
    const { predictionId } = e.currentTarget.dataset;
    wx.showToast({
      title: '开始复习',
      icon: 'none'
    });
  },

  // 处理节点点击
  handleNodeTap: function(e) {
    const { x, y } = e.detail;
    const { nodes } = this.data.knowledgeGraph;
    const { scale, offset } = this.data;

    // 转换点击坐标
    const transformedX = (x - offset.x) / scale;
    const transformedY = (y - offset.y) / scale;

    // 查找被点击的节点
    const clickedNode = nodes.find(node => {
      const dx = node.x - transformedX;
      const dy = node.y - transformedY;
      return Math.sqrt(dx * dx + dy * dy) <= 40;
    });

    if (clickedNode) {
      this.setData({ selectedNode: clickedNode });
      this.showNodeDetail(clickedNode);
    }
  },

  // 显示节点详情
  showNodeDetail: function(node) {
    wx.showModal({
      title: node.name,
      content: `状态：${this.getStatusText(node.status)}\n相关知识点：${this.getRelatedNodes(node.id)}`,
      showCancel: false
    });
  },

  // 获取状态文本
  getStatusText: function(status) {
    const statusMap = {
      mastered: '已掌握',
      learning: '学习中',
      weak: '薄弱',
      forgetting: '待复习'
    };
    return statusMap[status] || status;
  },

  // 获取相关节点
  getRelatedNodes: function(nodeId) {
    const { edges, nodes } = this.data.knowledgeGraph;
    const relatedEdges = edges.filter(edge => edge.from === nodeId || edge.to === nodeId);
    const relatedNodeIds = relatedEdges.map(edge => edge.from === nodeId ? edge.to : edge.from);
    return relatedNodeIds.map(id => nodes.find(n => n.id === id).name).join('、');
  },

  // 处理拖拽开始
  handleTouchStart: function(e) {
    const touch = e.touches[0];
    this.setData({
      isDragging: true,
      dragStart: { x: touch.x, y: touch.y }
    });
  },

  // 处理拖拽移动
  handleTouchMove: function(e) {
    if (!this.data.isDragging) return;

    const touch = e.touches[0];
    const { dragStart, offset } = this.data;
    
    const newOffset = {
      x: offset.x + (touch.x - dragStart.x),
      y: offset.y + (touch.y - dragStart.y)
    };

    this.setData({
      offset: newOffset,
      dragStart: { x: touch.x, y: touch.y }
    });

    this.drawKnowledgeGraph();
  },

  // 处理拖拽结束
  handleTouchEnd: function() {
    this.setData({ isDragging: false });
  },

  // 处理缩放
  handleScale: function(e) {
    const { scale } = e.detail;
    this.setData({
      'knowledgeGraph.scale': scale
    });
    this.drawKnowledgeGraph();
  }
})