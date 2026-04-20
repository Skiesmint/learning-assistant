const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// 确保图标目录存在
const iconDir = path.join(__dirname, '../assets/icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// 图标配置
const icons = [
  { name: '🔍', color: '#999999' },  // 智诊舱
  { name: '💭', color: '#999999' },  // 思维道场
  { name: '🧬', color: '#999999' },  // 进化图谱
  { name: '📈', color: '#999999' },  // 量变舱
  { name: '🔥', color: '#999999' }   // 错题熔炉
];

// 生成图标
icons.forEach(icon => {
  const canvas = createCanvas(81, 81);
  const ctx = canvas.getContext('2d');

  // 设置背景
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 81, 81);

  // 设置文本样式
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = icon.color;

  // 绘制emoji
  ctx.fillText(icon.name, 40, 40);

  // 保存为PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconDir, `${icon.name}.png`), buffer);
});

console.log('图标生成完成！'); 