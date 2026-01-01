## 时间轴控件

![Download](https://img.shields.io/npm/dm/@ezuikit/control-time-line.svg) ![Version](https://img.shields.io/npm/v/@ezuikit/control-time-line.svg) 
<!-- ![License](https://img.shields.io/npm/l/@ezuikit/control-time-line.svg)  -->

## Usage

```bash
npm install @ezuikit/control-time-line
# or
yarn add @ezuikit/control-time-line
# or
pnpm add @ezuikit/control-time-line
```

## demo

```ts
import '@ezuikit/control-time-line/dist/style.css';
import { TimeLine } from '@ezuikit/control-time-line';

const timeLine = new TimeLine(document.getElementById('container'), {
  width: 600,
  height: 40, //
  timeSections: [
    {
      startTime: 1757865600000,
      endTime: 1757951999000,
      type: 'ALARM',
      size: '',
    },
  ],
  timeWidth: 0, // [0-4]
  onChange: function (current) {
    console.log('onChange', current);
  },
  onDragStart: function (current) {
    console.log('onDragStart', current);
  },
  onDragging: function (current) {
    console.log('onDragging', current);
  },
  onDragEnd: function (current) {
    console.log('onDragEnd', current);
  },
});
```

### umd

```html
<!-- 引入 umd,  -->
<!-- node_modules/@ezuikit/control-time-line/dist/style.css -->
<link rel="stylesheet" href="./style.css" />
<!-- node_modules/@ezuikit/control-time-line/dist/index.umd.js-->
<script src="./index.umd.js"></script>
<div id="container"></div>
<script>
  const timeLine = new window.TimeLine(document.getElementById('container'), {
    width: 600,
    height: 40, //
    timeSections: [
      {
        startTime: 1757865600000,
        endTime: 1757951999000,
        type: 'ALARM',
        size: '',
      },
    ],
    timeWidth: 0, // [0-4]
    onChange: function (current) {
      console.log('onChange', current);
    },
    onDragStart: function (current) {
      console.log('onDragStart', current);
    },
    onDragging: function (current) {
      console.log('onDragging', current);
    },
    onDragEnd: function (current) {
      console.log('onDragEnd', current);
    },
  })

```