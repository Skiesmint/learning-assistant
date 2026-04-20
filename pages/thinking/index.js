// pages/thinking/index.js
const { callAIAPI } = require('../../utils/api.js');

Page({
  data: {
    dialogues: [],           // 对话历史
    userInput: '',          // 用户输入
    isLoading: false,       // 加载状态
    scrollToMessage: ''     // 滚动位置
  },

  onLoad() {
    // 添加欢迎消息
    this.addDialogue({
      type: 'ai',
      content: '你好！通过追问的艺术，我会帮助你深入理解问题的本质。让我们开始这段思维的探索吧！',
      time: this.getCurrentTime()
    });
  },

  // 处理用户输入
  onInput(e) {
    this.setData({ userInput: e.detail.value });
  },

  // 发送消息
  async sendMessage() {
    const content = this.data.userInput.trim();
    if (!content) return;

    // 添加用户消息
    this.addDialogue({
      type: 'user',
      content,
      time: this.getCurrentTime()
    });

    this.setData({ 
      userInput: '',
      isLoading: true 
    });

    try {
      // 构建对话历史
      const history = this.formatDialogueHistory();
      
      // 构建提示词
      const prompt = `请你现在化身为苏格拉底，用你标志性的追问艺术来引导学生思考。

核心原则：
1. 始终保持追问
   - 每次只问一个关键问题
   - 必须等待学生完全理解并正确回答后才能进入下一个问题
   - 用连续的追问帮助学生打通思维的任督二脉

2. 问题设计
   - 问题要直指核心
   - 由表及里，层层深入
   - 让学生自己发现关键知识点

3. 回答处理
   - 如果学生答对：给予肯定，并立即提出下一个更深层的问题
   - 如果学生答错：不直接指出错误，而是通过更具体的追问让学生自己发现问题
   - 如果学生困惑：用更小的问题来分解当前的难点

4. 引导策略
   - 永远不要直接给出答案
   - 通过问题引导学生自己得出结论
   - 让每个问题都建立在前一个问题的基础上
   - 确保学生真正理解而不是简单记忆

5. 对话风格
   - 像苏格拉底一样充满智慧和耐心
   - 用问题而不是陈述来引导思考
   - 鼓励学生质疑和思考每一个步骤

当前对话历史：
${history}

请用中文回复。记住：每次只问一个最关键的问题，必须等待学生完全理解并正确回答后，才能继续下一个追问。你的目标是通过连续的追问，帮助学生真正理解问题的本质。`;

      // 调用AI接口
      const response = await callAIAPI(prompt);
      
      // 添加AI回复
      this.addDialogue({
        type: 'ai',
        content: response.choices[0].message.content,
        time: this.getCurrentTime()
      });

    } catch (error) {
      console.error('AI响应错误：', error);
      this.addDialogue({
        type: 'ai',
        content: '抱歉，我遇到了一些问题。请重试。',
        time: this.getCurrentTime()
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  // 添加对话
  addDialogue(dialogue) {
    const dialogues = this.data.dialogues;
    dialogues.push(dialogue);
    this.setData({ 
      dialogues,
      scrollToMessage: `msg-${dialogues.length - 1}`
    });
  },

  // 获取当前时间
  getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  },

  // 格式化对话历史
  formatDialogueHistory() {
    return this.data.dialogues
      .map(msg => `${msg.type === 'user' ? '学生' : 'AI'}：${msg.content}`)
      .join('\n');
  }
});