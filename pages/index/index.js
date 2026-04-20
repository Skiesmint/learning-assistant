// index.js
const { testAPI } = require('../../utils/api.js');

Page({
  data: {
    modules: [
      {
        id: 'diagnosis',
        title: '智诊舱',
        desc: '错题解析与归因',
        icon: '🔍'
      },
      {
        id: 'thinking',
        title: '思维道场',
        desc: '引导式思维训练',
        icon: '💭'
      },
      {
        id: 'knowledge',
        title: '进化图谱',
        desc: '知识网络管理',
        icon: '🧬'
      },
      {
        id: 'progress',
        title: '量变舱',
        desc: '学习进步追踪',
        icon: '📈'
      },
      {
        id: 'error',
        title: '错题熔炉',
        desc: '错题强化训练',
        icon: '🔥'
      }
    ]
  },
  
  onLoad() {
    // 测试API是否可用
    testAPI().then(isAvailable => {
      if (!isAvailable) {
        wx.showModal({
          title: '提示',
          content: 'AI服务暂时不可用，请检查网络连接或稍后再试',
          showCancel: false
        });
      }
    });

    wx.setNavigationBarTitle({
      title: '智引Study'
    });
  },
  
  navigateToModule(e) {
    const { id } = e.currentTarget.dataset;
    const routes = {
      diagnosis: '/pages/diagnosis/index',
      thinking: '/pages/thinking/index',
      knowledge: '/pages/knowledge/index',
      progress: '/pages/progress/index',
      error: '/pages/error/index'
    };
    
    wx.reLaunch({
      url: routes[id]
    });
  }
})
