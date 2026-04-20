const { callAIAPI } = require('../../utils/api.js');

Page({
  data: {
    imagePath: '',
    diagnosisResult: null,
    solution: null,
    loading: false,
    canvasSize: { width: 300, height: 300 }
  },

  onLoad() {
    // 页面加载时的初始化逻辑
  },

  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          imagePath: res.tempFilePaths[0],
          diagnosisResult: null,
          solution: null
        });
        this.analyzeImage(res.tempFilePaths[0]);
      }
    });
  },

  analyzeImage(imagePath) {
    this.setData({ loading: true });

    // 模拟调用Deepseek API分析图片
    setTimeout(() => {
      this.setData({
        loading: false,
        diagnosisResult: {
          errorType: '概念理解错误',
          errorReason: '对函数单调性的定义理解不准确，导致判断错误',
          improvementSuggestion: '建议重新学习函数单调性的定义，多做相关练习题'
        },
        solution: {
          steps: [
            '首先分析函数的定义域',
            '求导并分析导数的符号',
            '根据导数符号判断函数的单调性',
            '结合定义域和单调性得出结论'
          ],
          finalAnswer: '函数在区间(-∞, -1)和(1, +∞)上单调递增，在区间(-1, 1)上单调递减',
          tips: '注意在求导后要分析导数的符号，这是判断函数单调性的关键步骤'
        }
      });
    }, 2000);
  },

  // 绘制知识图谱
  drawKnowledgeMap() {
    const ctx = wx.createCanvasContext('knowledgeMap');
    const { width, height } = this.data.canvasSize;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    // 获取知识点数据
    const { knowledgePoint, errorType, relatedKnowledge } = this.data.diagnosisResult;
    
    // 定义节点数据
    const nodes = [
      // 中心节点：主要知识点
      { id: 'main', text: knowledgePoint, x: centerX, y: centerY, type: 'main' },
      // 错误类型节点
      { id: 'error', text: errorType, x: centerX + radius * 0.5, y: centerY, type: 'error' },
      // 前置知识点节点
      ...relatedKnowledge.prerequisites.map((text, index) => ({
        id: `prereq${index}`,
        text,
        x: centerX - radius * 0.5,
        y: centerY - radius * 0.3 + (index * 60),
        type: 'prerequisite'
      })),
      // 关联知识点节点
      ...relatedKnowledge.related.map((text, index) => ({
        id: `related${index}`,
        text,
        x: centerX + radius * 0.4,
        y: centerY - radius * 0.4 + (index * 60),
        type: 'related'
      })),
      // 延伸知识点节点
      ...relatedKnowledge.extensions.map((text, index) => ({
        id: `extension${index}`,
        text,
        x: centerX - radius * 0.3,
        y: centerY + radius * 0.4 + (index * 60),
        type: 'extension'
      }))
    ];

    // 定义连线数据
    const edges = [
      // 中心节点到错误类型的连线
      { from: 'main', to: 'error', type: 'error' },
      // 中心节点到前置知识点的连线
      ...relatedKnowledge.prerequisites.map((_, index) => ({
        from: 'main',
        to: `prereq${index}`,
        type: 'prerequisite'
      })),
      // 中心节点到关联知识点的连线
      ...relatedKnowledge.related.map((_, index) => ({
        from: 'main',
        to: `related${index}`,
        type: 'related'
      })),
      // 中心节点到延伸知识点的连线
      ...relatedKnowledge.extensions.map((_, index) => ({
        from: 'main',
        to: `extension${index}`,
        type: 'extension'
      }))
    ];

    // 绘制连线
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      
      // 设置连线样式
      let color, width;
      switch (edge.type) {
        case 'error':
          color = '#FF5252';
          width = 2;
          break;
        case 'prerequisite':
          color = '#2196F3';
          width = 1;
          break;
        case 'related':
          color = '#4CAF50';
          width = 1;
          break;
        case 'extension':
          color = '#FFC107';
          width = 1;
          break;
      }
      
      ctx.setStrokeStyle(color);
      ctx.setLineWidth(width);
      ctx.stroke();
    });

    // 绘制节点
    nodes.forEach(node => {
      // 绘制节点背景
      ctx.beginPath();
      ctx.arc(node.x, node.y, 30, 0, 2 * Math.PI);
      
      // 设置节点颜色
      let color;
      switch (node.type) {
        case 'main':
          color = '#4CAF50';
          break;
        case 'error':
          color = '#FF5252';
          break;
        case 'prerequisite':
          color = '#2196F3';
          break;
        case 'related':
          color = '#4CAF50';
          break;
        case 'extension':
          color = '#FFC107';
          break;
      }
      
      ctx.setFillStyle(color);
      ctx.fill();
      
      // 绘制节点边框
      ctx.setStrokeStyle('#FFFFFF');
      ctx.setLineWidth(2);
      ctx.stroke();

      // 绘制节点文本
      ctx.setFillStyle('#FFFFFF');
      ctx.setFontSize(12);
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');
      ctx.fillText(node.text, node.x, node.y);
    });

    ctx.draw();
  },

  // 绘制雷达图
  drawRadarChart() {
    const ctx = wx.createCanvasContext('radarChart');
    const { width, height } = this.data.canvasSize;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;

    // 定义评估维度
    const dimensions = [
      { name: '概念理解', key: 'concept' },
      { name: '计算能力', key: 'calculation' },
      { name: '解题思路', key: 'thinking' },
      { name: '公式应用', key: 'formula' },
      { name: '步骤规范', key: 'standard' }
    ];

    // 获取AI分析数据
    const { dimensions: scores } = this.data.diagnosisResult;

    // 绘制背景网格
    ctx.setStrokeStyle('#E0E0E0');
    ctx.setLineWidth(1);
    for (let i = 1; i <= 5; i++) {
      const r = (radius * i) / 5;
      ctx.beginPath();
      for (let j = 0; j < 5; j++) {
        const angle = (j * 2 * Math.PI) / 5 - Math.PI / 2;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }

    // 绘制维度分割线
    ctx.setStrokeStyle('#999999');
    ctx.setLineWidth(1);
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // 绘制维度名称
    ctx.setFillStyle('#333333');
    ctx.setFontSize(14);
    ctx.setTextAlign('center');
    ctx.setTextBaseline('middle');
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = centerX + (radius + 20) * Math.cos(angle);
      const y = centerY + (radius + 20) * Math.sin(angle);
      ctx.fillText(dimensions[i].name, x, y);
    }

    // 绘制数据区域
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const score = scores[dimensions[i].key];
      const r = radius * score;
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.setFillStyle('rgba(76, 175, 80, 0.2)');
    ctx.fill();
    ctx.setStrokeStyle('#4CAF50');
    ctx.setLineWidth(2);
    ctx.stroke();

    // 绘制数据点
    ctx.setFillStyle('#4CAF50');
    for (let i = 0; i < 5; i++) {
      const score = scores[dimensions[i].key];
      const r = radius * score;
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }

    ctx.draw();
  }
}); 