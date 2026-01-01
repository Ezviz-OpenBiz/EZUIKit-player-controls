## 时间轴控件

![Download](https://img.shields.io/npm/dm/@ezuikit/control-date-picker.svg) ![Version](https://img.shields.io/npm/v/@ezuikit/control-date-picker.svg) 
<!-- ![License](https://img.shields.io/npm/l/@ezuikit/control-date-picker.svg)  -->

## Usage

```bash
npm install @ezuikit/control-date-picker
# or
yarn add @ezuikit/control-date-picker
# or
pnpm add @ezuikit/control-date-picker
```

## demo

```ts
import '@ezuikit/control-date-picker/dist/style.css';
import { DatePicker, type DatePickerModeType } from '@ezuikit/control-date-picker';

const timeLine = new DatePicker(document.getElementById('container'), {
  isMobile: false,
  onChange: function (current) {
    console.log('onChange', current);
  },
  onCell: function (current) {
    console.log('onCell', current);
  },
  onOk: function (current, mode: DatePickerModeType) {
    console.log('onOk', current);
  },
  onClose: function (current, mode: DatePickerModeType) {
    console.log('onClose', current);
  },
});
```

### umd

```html
<!-- 引入 umd,  -->
<!-- node_modules/@ezuikit/control-date-picker/dist/style.css -->
<link rel="stylesheet" href="./style.css" />
<!-- node_modules/@ezuikit/control-date-picker/dist/index.umd.js-->
<script src="./index.umd.js"></script>
<div id="container"></div>
<script>
  const timeLine = new DatePicker.DatePicker(document.getElementById('container'), {
    isMobile: false,
    onChange: function (current) {
      console.log('onChange', current);
    },
    onCell: function (current) {
      console.log('onCell', current);
    },
    onOk: function (current, mode: DatePickerModeType) {
      console.log('onOk', current);
    },
    onClose: function (current, mode: DatePickerModeType) {
      console.log('onClose', current);
    },
  })

```
