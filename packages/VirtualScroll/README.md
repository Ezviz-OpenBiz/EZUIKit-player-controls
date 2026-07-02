## VirtualScroll 虚拟滚动

高性能虚拟滚动列表，仅渲染可视区域（含缓冲）内的行，配合 DOM 复用池支撑十万级数据流畅滚动，并提供 `scrollToIndex` 等定位 API。

行高支持三种模式：

- **固定高度**（`itemHeight: number`）：所有行等高，O(1) 定位，性能最佳，可支撑十万级数据；
- **已知不固定高度**（`itemHeight: (index, item) => number`）：按索引返回精确高度，前缀和定位，无需测量；
- **动态测量**（`dynamicHeight: true`）：内容高度不固定且无法预先计算时，库在渲染后测量真实 DOM 高度，自动校正总高与定位，并做滚动锚定避免跳动。

## Usage

```bash
npm install @ezuikit/control-virtual-scroll
# or
pnpm add @ezuikit/control-virtual-scroll
```

## demo

```ts
import '@ezuikit/control-virtual-scroll/dist/style/style.css';
import VirtualScroll from '@ezuikit/control-virtual-scroll';

const vs = new VirtualScroll(document.getElementById('list'), {
  total: 100000,
  itemHeight: 74,
  buffer: 8,
  renderItem: (index) => `
    <div class="row">用户 ${index} · #${index.toLocaleString()}</div>
  `,
});

// 定位
vs.scrollToIndex(5000);

// 事件
vs.on(VirtualScroll.EVENTS.render, (range) => console.log(range));
```

### 使用数据源（泛型）

```ts
interface User { id: number; name: string; }
const data: User[] = [...];

const vs = new VirtualScroll<User>(document.getElementById('list'), {
  data,
  itemHeight: 56,
  renderItem: (index, item) => `<div class="row">${item?.name}</div>`,
});

vs.setData(nextData); // 数据更新
```

### 不固定高度

```ts
// 1) 已知高度：itemHeight 传函数（无需测量，性能好）
const vs1 = new VirtualScroll<Row>(el, {
  data,
  itemHeight: (index, item) => (item?.expanded ? 120 : 56),
  renderItem: (index, item) => renderRow(item),
});

// 2) 动态测量：内容高度无法预先计算时开启 dynamicHeight
const vs2 = new VirtualScroll<Row>(el, {
  data,
  dynamicHeight: true,
  estimatedItemHeight: 80, // 未测量项的预估高度，越接近真实值滚动条越稳定
  renderItem: (index, item) => renderRow(item), // 高度由内容自然撑开
});
```

### umd

```html
<link rel="stylesheet" href="./style/style.css" />
<script src="./index.umd.js"></script>
<script>
  var vs = new VirtualScroll(document.getElementById('list'), {
    total: 100000,
    itemHeight: 74,
    renderItem: function (i) {
      return '<div class="row">#' + i + '</div>';
    },
  });
  vs.scrollToIndex(1000);
</script>
```

---

## 一、设计目标

- 仅渲染视口可见行，DOM 数量与数据规模无关（恒定 ≈ 可视行数 + 2×buffer）。
- 支持十万级数据，滚动不卡顿、内存稳定。
- 提供命令式定位 API（`scrollToIndex` / `scrollToTop` / `scrollToBottom`）。
- 数据/容器尺寸变化自适应。
- 渲染内容完全交给使用方（`renderItem`），库不约束业务样式。

## 二、架构与 DOM 结构

库在传入的容器（滚动区）内构建如下结构（类名前缀 `evscroll`，由库自动创建/销毁）：

```
container(.evscroll-wrapper)          // 滚动容器：overflow-y:auto, position:relative
  └─ .evscroll-content                // 占位层：height = total × itemHeight（撑出滚动条）
       └─ .evscroll-viewport          // 绝对定位容器
            └─ .evscroll-item × N      // 行：absolute, top = index × itemHeight, height = itemHeight
```

- 占位层 `content` 用真实总高度撑出原生滚动条，保证滚动条比例正确。
- 每个可见行用 `position:absolute; top:index*itemHeight` 精确定位，无需依赖文档流。
- 关键布局样式由库以内联样式写入，**即使不引入 CSS 也能工作**；`style.css` 仅提供滚动条与基础类钩子。

## 三、核心算法（可视区间计算）

滚动/尺寸变化时（经 `requestAnimationFrame` 节流）计算渲染区间：

```
scrollTop  = wrapper.scrollTop
rawStart   = floor(scrollTop / itemHeight)
start      = max(0, rawStart - buffer)
capacity   = ceil(containerHeight / itemHeight)      // 视口可容纳行数
rawEnd     = rawStart + capacity - 1
end        = min(total - 1, rawEnd + buffer)
```

区间 `[start, end]` 未变化则跳过（`force` 时强制重渲染，如数据/尺寸变化）。

> 不固定高度模式下，以每项高度的**前缀和**作为偏移表：`scrollTop` 经二分查找定位起始项，行 `top = prefix[index]`，占位层高度 = `prefix[total]`。动态测量模式在渲染后读取各行 `offsetHeight`，与记录不一致时校正高度、重建前缀和并重新定位，同时锚定 `scrollTop` 避免视觉跳动。

## 四、DOM 复用池

- `_active: Map<index, HTMLElement>`：当前在视口中的行。
- `_pool: HTMLElement[]`：移出视口的空闲行节点。
- 区间变化时：超出 `[start, end]` 的行 `display:none` 入池；区间内缺失的行优先从池中取节点复用（`renderItem` 重填内容），不足再新建。

由此 DOM 节点总数恒定在「可视行数 + 2×buffer」量级，与 `total` 无关 —— 这是相对 `1.html` 原型（按 index 缓存全部 DOM）的关键改进。

## 五、生命周期与流程

```
new VirtualScroll(container, options)
  ├─ deepmerge 合并默认项（数组以覆盖方式合并，避免 data 被拼接）
  ├─ 解析容器，设置 overflow/position，创建 content/viewport
  ├─ 绑定 scroll（passive）+ ResizeObserver（降级 window.resize）
  ├─ 同步占位层高度
  └─ 首次计算并渲染

scroll / resize → rAF 节流 → _compute() → 区间变化 → _updateRange()（复用池增删）→ emit render

destroy() → 解绑事件、断开 ResizeObserver、清空 active/pool、移除自建 DOM、removeAllListeners
```

## 六、API

### 配置项 VirtualScrollOptions&lt;T&gt;

| 选项                  | 类型                                     | 默认值  | 说明                                                          |
| --------------------- | ---------------------------------------- | ------- | ------------------------------------------------------------- |
| `container`           | `string \| HTMLElement`                  | —       | 滚动容器（也可由构造函数第一参传入）                          |
| `data`                | `T[]`                                    | —       | 数据源；提供后 total 取 `data.length`                         |
| `total`               | `number`                                 | —       | 总条数（不提供 data 时使用）                                  |
| `itemHeight`          | `number \| ((index, item) => number)`    | `40`    | 行高：数字为固定高度；函数为已知不固定高度                    |
| `dynamicHeight`       | `boolean`                                | `false` | 动态测量行高（内容高度不固定且无法预先计算时开启）            |
| `estimatedItemHeight` | `number`                                 | —       | 动态模式下未测量项的预估高度（缺省取 itemHeight 数字值或 40） |
| `buffer`              | `number`                                 | `5`     | 视口上下额外渲染的缓冲条数                                    |
| `smooth`              | `boolean`                                | `true`  | `scrollToIndex` 默认是否平滑滚动                              |
| `renderItem`          | `(index, item) => string \| HTMLElement` | —       | **必填**，渲染行内容                                          |
| `onRender`            | `(range) => void`                        | —       | 渲染区间变化回调                                              |
| `onScroll`            | `(scrollTop) => void`                    | —       | 滚动回调                                                      |

### 方法

| 方法                                               | 说明                                         |
| -------------------------------------------------- | -------------------------------------------- |
| `scrollToIndex(index, smooth?)`                    | 滚动到指定索引（顶部对齐），越界返回 `false` |
| `scrollToTop(smooth?)` / `scrollToBottom(smooth?)` | 滚动到首/末项                                |
| `getTotalCount()`                                  | 总条数                                       |
| `getCurrentRange()`                                | 当前渲染区间 `{ startIndex, endIndex }`      |
| `setData(data)`                                    | 更新数据源并重渲染                           |
| `setTotal(total)`                                  | 更新总条数并重渲染                           |
| `refresh()`                                        | 强制重算重渲染（数据/高度变化后）            |
| `updateOptions(options)`                           | 更新配置                                     |
| `on(event, cb)` / `off(event, cb)`                 | 事件监听/取消                                |
| `destroy()`                                        | 销毁                                         |

### 事件 VirtualScroll.EVENTS

| 事件          | 说明         | 回调参数                   |
| ------------- | ------------ | -------------------------- |
| `render`      | 渲染区间变化 | `{ startIndex, endIndex }` |
| `scroll`      | 滚动         | `scrollTop: number`        |
| `reachTop`    | 渲染到顶部   | —                          |
| `reachBottom` | 渲染到底部   | —                          |

## 七、性能与兼容性

- 滚动事件 `passive` + `requestAnimationFrame` 节流，避免布局抖动。
- DOM 复用池使节点数恒定，内存不随数据规模增长。
- `ResizeObserver` 自适应容器高度，不支持时降级 `window.resize`。
- `scrollToIndex` 优先使用 `scrollTo({ behavior })`，不支持时回退 `scrollTop` 赋值。
- 兼容 Chrome / Edge / Firefox / Safari 等主流浏览器。

## 八、约束

- 固定高度模式性能最佳，可支撑十万级数据；不固定高度（函数/动态测量）依赖前缀和（O(n) 重建、O(log n) 定位），适合中大型列表。
- 动态测量在「渲染时」校正行高；若某行在渲染后才异步变高（如图片加载后自动撑高），需要再次触发测量（如对可视行使用 `ResizeObserver`），当前版本不内置该能力。
