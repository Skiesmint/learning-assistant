Page({
  data: {
    loading: true,
    totalCount: 0,
    reviewedCount: 0,
    masteredCount: 0,
    masteryRate: 0,
    errorList: [],
    showFilterPopup: false,
    filter: {
      status: 'all',
      type: 'all'
    }
  },

  onLoad: function() {
    this.loadErrorData();
  },

  // 加载错题数据
  loadErrorData: function() {
    this.setData({ loading: true });
    
    // 模拟加载数据
    setTimeout(() => {
      const mockData = {
        totalCount: 25,
        reviewedCount: 18,
        masteredCount: 12,
        errorList: [
          {
            id: 1,
            title: '函数最值问题',
            type: '函数',
            status: 'unreviewed',
            statusText: '未复习',
            date: '2024-03-15',
            reviewCount: 0,
            lastReview: '无'
          },
          {
            id: 2,
            title: '几何证明题',
            type: '几何',
            status: 'reviewed',
            statusText: '已复习',
            date: '2024-03-14',
            reviewCount: 2,
            lastReview: '2024-03-16'
          },
          {
            id: 3,
            title: '代数方程',
            type: '代数',
            status: 'mastered',
            statusText: '已掌握',
            date: '2024-03-13',
            reviewCount: 3,
            lastReview: '2024-03-17'
          }
        ]
      };

      const masteryRate = Math.round((mockData.masteredCount / mockData.totalCount) * 100);

      this.setData({
        ...mockData,
        masteryRate,
        loading: false
      });
    }, 1000);
  },

  // 显示筛选弹窗
  showFilter: function() {
    this.setData({
      showFilterPopup: true
    });
  },

  // 隐藏筛选弹窗
  hideFilter: function() {
    this.setData({
      showFilterPopup: false
    });
  },

  // 设置筛选条件
  setFilter: function(e) {
    const { type, value } = e.currentTarget.dataset;
    this.setData({
      [`filter.${type}`]: value
    });
  },

  // 重置筛选条件
  resetFilter: function() {
    this.setData({
      filter: {
        status: 'all',
        type: 'all'
      }
    });
  },

  // 应用筛选条件
  applyFilter: function() {
    this.hideFilter();
    this.loadErrorData();
  },

  // 查看错题详情
  viewErrorDetail: function(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/error/detail/index?id=${id}`
    });
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    this.loadErrorData();
    wx.stopPullDownRefresh();
  },

  // 上拉加载更多
  onReachBottom: function() {
    // 实现加载更多逻辑
  }
}); 