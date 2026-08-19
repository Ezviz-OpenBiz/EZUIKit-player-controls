## 片段进度条控件

![Download](https://img.shields.io/npm/dm/@ezuikit/control-segment-progress.svg) ![Version](https://img.shields.io/npm/v/@ezuikit/control-segment-progress.svg)

播放区间（片段分享）场景下的进度条控件，展示当前播放位置在区间内的相对进度，支持多片段高亮与拖动 seek。

## Usage

```bash
npm install @ezuikit/control-segment-progress
# or
yarn add @ezuikit/control-segment-progress
# or
pnpm add @ezuikit/control-segment-progress
```

```ts
import '@ezuikit/control-segment-progress/dist/style';
import { SegmentProgress } from '@ezuikit/control-segment-progress';

const progress = new SegmentProgress(document.getElementById('container'), {
  beginMs: 1787106900000, // 区间起点（毫秒时间戳）
  endMs: 1787107500000, // 区间终点（毫秒时间戳）
  segments: [
    { startTime: 1787106900000, endTime: 1787107078000 },
    { startTime: 1787107328000, endTime: 1787107500000 },
  ],
  onChange: (ms) => {
    console.log('seek to', ms);
  },
});

// 更新当前播放位置
progress.update(1787107000000);
```

### UMD

```html
<link rel="stylesheet" href="./style/style.css" />
<script src="./index.umd.js"></script>
<div id="container"></div>
<script>
  const progress = new window.SegmentProgress(document.getElementById('container'), {
    beginMs: 1787106900000,
    endMs: 1787107500000,
    segments: [
      { startTime: 1787106900000, endTime: 1787107078000 },
      { startTime: 1787107328000, endTime: 1787107500000 },
    ],
    onChange: function (ms) {
      console.log('seek to', ms);
    },
  });
</script>
```
