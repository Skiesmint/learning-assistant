// 问题类型和流程配置
const questionFlow = {
  // 二次方程
  "quadratic_equation": {
    type: "二次方程",
    steps: ["识别系数", "选择方法", "具体解法", "验证答案"],
    flows: [
      {
        step: "选择方法",
        question: "这个方程你打算用什么方法解决？",
        triggers: ["factorization", "formula", "complete_square"],
        responses: {
          "factorization": {
            correct: "很好，因式分解是个不错的选择。你是如何判断可以使用因式分解的？",
            incorrect: "让我们先看看这个方程的特点：系数是什么？常数项是多少？",
            hint: "观察一下系数和常数项的特点，它们之间有什么关系？"
          },
          "formula": {
            correct: "公式法确实可行。不过在使用公式前，你觉得有更简单的方法吗？",
            incorrect: "在直接套用公式前，我们是否可以先观察方程的特点？",
            hint: "看看系数是否有特殊性质，这可能会帮助我们选择更简单的方法。"
          }
        }
      },
      {
        step: "因式分解",
        question: "你是如何找到这两个因式的？",
        triggers: ["multiply", "factors", "step_2"],
        responses: {
          correct: "很好！如果中间项系数变成+5，这些因式会如何变化？",
          incorrect: "让我们回顾一下：两个数的和应该等于中间项系数，积等于常数项。再试试？",
          hint: "找两个数，它们的积等于常数项，和等于中间项系数。"
        }
      }
    ]
  },

  // 一次方程
  "linear_equation": {
    type: "一次方程",
    steps: ["整理方程", "移项合并", "求解", "验证"],
    flows: [
      {
        step: "整理方程",
        question: "在开始解方程前，你觉得需要先做什么？",
        triggers: ["simplify", "combine", "step_1"],
        responses: {
          correct: "很好，整理方程是第一步。你会如何处理分数项？",
          incorrect: "让我们先把方程写得更清晰一些。看看有没有可以合并的项？",
          hint: "通常我们先把相似项放在一起，这样更容易看清方程的结构。"
        }
      }
    ]
  }
};

// 通用引导策略
const guidanceStrategies = {
  // 解题方法选择
  methodSelection: {
    prompts: [
      "这个方法为什么适合这道题？",
      "有没有其他可行的解法？",
      "如果条件变化，这个方法还适用吗？"
    ]
  },
  
  // 错误处理
  errorHandling: {
    prompts: [
      "让我们一起检查一下这一步",
      "你能解释一下你的思路吗？",
      "这个结果看起来合理吗？"
    ]
  },
  
  // 概念理解
  conceptCheck: {
    prompts: [
      "这个概念的核心是什么？",
      "能用你的话解释一下吗？",
      "可以举个例子说明吗？"
    ]
  }
};

module.exports = {
  questionFlow,
  guidanceStrategies
}; 