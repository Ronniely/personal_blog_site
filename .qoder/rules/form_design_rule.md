---
trigger: manual
---
# 表单设计规则

## 设计原则

1. **简洁性** - 表单应尽可能简单，只包含必要的字段
2. **一致性** - 保持表单样式和交互的一致性
3. **可预测性** - 用户应能预知表单的行为和结果
4. **容错性** - 允许用户犯错并提供纠正机制

## 布局规则

1. **垂直排列** - 表单字段应垂直排列，便于阅读
2. **分组相关字段** - 使用fieldset或视觉分组相关字段
3. **适当的间距** - 字段间保持足够的间距避免拥挤
4. **标签对齐** - 标签应左对齐或顶部对齐

## 表单元素规范

### 输入框
<input type="text" class="form-input" placeholder="请输入姓名">

### 下拉选择
<select class="form-select">
  <option value="">请选择</option>
  <option value="option1">选项1</option>
</select>

### 复选框
<label class="checkbox-label">
  <input type="checkbox" class="form-checkbox">
  <span class="checkmark"></span>
  同意条款
</label>

### 单选按钮
<label class="radio-label">
  <input type="radio" name="gender" class="form-radio">
  <span class="radiomark"></span>
  男
</label>

## 交互规则

1. **焦点管理** - 自动聚焦到第一个输入字段
2. **实时反馈** - 提供即时的输入反馈
3. **键盘导航** - 支持Tab键在字段间切换
4. **提交按钮状态** - 根据表单状态启用/禁用提交按钮

## 验证规则

1. **实时验证** - 在用户输入时进行验证
2. **清晰错误提示** - 错误信息应具体且易于理解
3. **多语言支持** - 错误信息应支持多语言

// 验证示例
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

## 响应式设计

1. **自适应布局** - 在不同设备上自动调整布局
2. **触摸友好** - 确保在移动设备上的可点击区域足够大
3. **媒体查询** - 使用CSS媒体查询适配不同屏幕尺寸

@media (max-width: 768px) {
  .form-container {
    padding: 10px;
  }
  
  .form-input {
    width: 100%;
  }
}

## 无障碍访问

1. **语义化HTML** - 使用正确的HTML标签
2. **ARIA属性** - 为复杂组件添加ARIA属性
3. **颜色对比度** - 确保文本与背景有足够的对比度

<label for="username">用户名</label>
<input 
  type="text" 
  id="username" 
  aria-describedby="username-help"
  aria-invalid="false"
>
<div id="username-help" class="help-text">
  用户名至少6个字符
</div>

## 性能优化

1. **懒加载** - 对于长表单，考虑分步加载
2. **防抖处理** - 对于实时验证，使用防抖减少计算
3. **最小化重绘** - 减少不必要的DOM操作

// 防抖函数示例
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};
