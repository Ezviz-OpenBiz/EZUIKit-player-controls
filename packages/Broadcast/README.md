# @ezuikit/control-broadcast

云广播喊话控件：在播放器上弹出一个抽屉面板，查询并下发设备的默认语音，或现场录音后下发临时语音。

> **仅限浏览器环境。** 构造函数会直接访问 `document` 并创建 DOM，必须在客户端创建（SSR 框架里放到 `useEffect` / `onMounted` 等仅客户端执行的钩子中）。录音需要安全上下文（HTTPS 或 localhost）。

## 特性

- 📋 默认语音列表：打开面板时自动查询，超过一页自动翻页，加载完后回调给宿主
- 🔊 语音文件下发：点击语音项即下发
- 🎤 临时语音下发：录音 3 ~ 59 秒，输出 16kHz 单声道 WAV，结束后自动下发
- 🌊 录音提示：矢量波形动画 + 倒计时，不使用图片
- 🚫 麦克风错误细化：拒绝授权、无设备、被占用、非安全上下文等，带错误码与本地化提示
- 🔌 内置萤石开放平台接口，开箱即用；下发也可由宿主接管
- 📱 PC 点击切换 / 移动端按住说话
- 🌍 中英文

## 安装

```bash
pnpm add @ezuikit/control-broadcast
```

## 快速开始

```ts
import Broadcast from '@ezuikit/control-broadcast';
import '@ezuikit/control-broadcast/dist/style/style.css';

// 第一个参数是挂载容器（元素 ID、CSS 选择器或 HTMLElement，需为定位元素），第二个参数是配置
const broadcast = new Broadcast('player', {
  deviceSerial: 'BA5551167',
  channelNo: 1,
  accessToken: '<accessToken>',
  onVoiceListChange: (list) => console.log('语音列表', list.length),
  onApiResult: ({ api, success, code, msg }) => console.log(api, success, code, msg),
  onError: ({ type, code, msg }) => console.warn(type, code, msg),
});

broadcast.open = true; // 打开面板：没有语音列表时自动查询
broadcast.close(); // 关闭面板：录音中会取消本次录音
broadcast.destroy(); // 销毁：释放麦克风、取消请求、移除 DOM
```

UMD（依赖已打包进产物，全局变量为 `Broadcast`，只导出默认类）：

```html
<link rel="stylesheet" href="./style/style.css" />
<script src="./index.umd.js"></script>
<script>
  const broadcast = new Broadcast('player', { deviceSerial: '<serial>', accessToken: '<token>' });
  broadcast.open = true;
</script>
```

小权限模式传 `token`（`accessToken` 优先，小权限模式下不要传 `accessToken`）。语音列表查询属于非设备类接口，需要 `httpToken.url`：

```ts
new Broadcast('player', {
  deviceSerial: '<serial>',
  token: {
    deviceToken: { global: '<global>', video: '<video>' }, // 下发语音
    httpToken: { url: '<url>' }, // 查询语音列表；用设备类 token 会返回 10031
  },
});
```

## 架构

`Broadcast` 继承 `@ezuikit/control-drawer`（遮罩、面板、标题栏、开合动画、挂载与 `open` 访问器），自身只负责编排；界面、录音、接口分别拆在各模块中：


| 目录 / 文件                        | 职责                                                                 |
| ---------------------------------- | -------------------------------------------------------------------- |
| `src/Broadcast.ts`                 | 编排：继承 Drawer，组装各模块，对外 API 与回调                       |
| `src/constant.ts`                  | 全部常量：类名、录音参数、接口地址、翻页参数、波形数据、错误码映射等 |
| `src/errors.ts`                    | 错误转换：录音 / 麦克风错误 → `onError` 参数，接口错误 → 展示文案    |
| `src/microphone.ts`                | 获取麦克风与错误分类（`MicrophoneError`）                            |
| `src/ui/VoiceListView.ts`          | Tab、语音列表、加载 / 空 / 错误态，点击选中                          |
| `src/ui/TalkButton.ts`             | 录音按钮：移动端按住说话、PC 端点击切换                              |
| `src/ui/RecordingPrompt.ts`        | 录音提示浮层（自行实现）：波形 + 倒计时                              |
| `src/ui/wave.ts`                   | `Wave` 波形：矢量 path 逐帧动画，`open` / `close`                    |
| `src/ui/Tip.ts`                    | 底部轻提示（`@ezuikit/control-message` 实例）                        |
| `src/recorder/RecordController.ts` | 录音流程状态机，通过钩子驱动界面与回调                               |
| `src/recorder/VoiceRecorder.ts`    | 采集 PCM 并编码为 16kHz 单声道 WAV                                   |
| `src/services/index.ts`            | `BroadcastServices`：查询语音列表、语音文件下发、临时语音下发        |
| `src/services/VoiceListLoader.ts`  | 语音列表自动翻页（只采用最后一次加载）                               |

各流程（列表加载、下发、录音状态机、错误处理）的流程图与细节见 [GUIDE.md](./GUIDE.md)。

## API

### 构造函数

```ts
new Broadcast(container: string | HTMLElement, options: BroadcastOptions)
```

`container` 为挂载容器，PC 与移动端一致；非 body 容器需为定位元素（`position` 非 `static`）。字符串先按元素 ID、再按 CSS 选择器查找，都找不到时回退到 `document.body`（面板相对视口铺满）。

### 配置项 `BroadcastOptions`

| 参数                    | 类型                                                      | 默认                   | 说明                                                                                                       |
| ----------------------- | --------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------- |
| `deviceSerial`          | `string`                                                  | -                      | 设备序列号（必填）                                                                                         |
| `channelNo`             | `string \| number`                                        | `'1'`                  | 通道号                                                                                                     |
| `accessToken`           | `string`                                                  | -                      | 访问令牌                                                                                                   |
| `token`                 | `{ deviceToken: { global, video }, httpToken?: { url } }` | -                      | 小权限 token（`accessToken` 优先，未传时使用）：`deviceToken.video` 用于下发，`httpToken.url` 用于查询列表 |
| `env.domain`            | `string`                                                  | `https://open.ys7.com` | 接口域名                                                                                                   |
| `capacity.support_talk` | `string \| number \| null`                                | -                      | 设备能力集，1 或 3 表示支持云广播（控件不校验，供宿主判断是否展示入口）                                    |
| `direction`             | `'top' \| 'bottom' \| 'left' \| 'right'`                  | `'right'`              | 面板展开方向（非法值按 `right`）                                                                           |
| `language`              | `'zh' \| 'en'`                                            | `'zh'`                 | 语言；传入 `i18n` 时忽略                                                                                   |
| `i18n`                  | `I18n`（`@ezuikit/utils-i18n`）                           | -                      | 自定义多语言实例（如与播放器共用），控件以追加方式写入 `broadcast.*` 文案、不切换语言，见 GUIDE            |
| `isMobile`              | `boolean`                                                 | `false`                | 移动端交互：按住说话、松开结束（不影响挂载位置）                                                           |
| `voiceList`             | `VoiceItem[]`                                             | -                      | 初始语音列表；传入后打开面板不再自动查询（可调用 `loadVoiceList()` 刷新）                                  |
| `logger`                | `LoggerCls`                                               | -                      | `@ezuikit/utils-logger` 实例，缺省时内部创建；日志前缀 `[Broadcast]`                                       |
| `on*`                   | -                                                         | -                      | 回调，见下文                                                                                               |

`direction`、`language`、`i18n`、`isMobile`、`voiceList`、`logger` 只在构造时生效；token、域名、设备序列号、通道号与回调可用 `updateOptions` 更新，下次请求 / 触发时生效。

### 属性与方法

| 成员                                  | 说明                                                                                          |
| ------------------------------------- | --------------------------------------------------------------------------------------------- |
| `open`                                | 继承自 Drawer 的访问器：设为 `true` / `false` 打开 / 关闭面板，读取得到当前状态               |
| `voiceList`                           | 只读，当前语音列表（副本）                                                                    |
| `close()`                             | 关闭面板，等价于 `open = false`；录音中会取消本次录音                                         |
| `loadVoiceList()`                     | 重新查询语音列表（自动翻页），加载完后触发 `onVoiceListChange`；并发调用时只采用最后一次      |
| `startRecord(): Promise<boolean>`     | 开始录音，与点击 / 按住录音按钮相同；返回是否成功开始                                         |
| `stopRecord(): Promise<void>`         | 结束录音，与再次点击 / 松开录音按钮相同；获取麦克风期间调用会在启动完成后立即结束             |
| `requestMicrophonePermission()`       | 请求麦克风权限（获取后立即释放），返回 `Promise<boolean>`；失败时触发 `onError`，不展示轻提示 |
| `showSuccess(msg)` / `showError(msg)` | 底部轻提示（2 秒自动关闭，纯文本）；宿主接管下发后用它回填结果                                |
| `updateOptions(options)`              | 浅合并配置（见上文）                                                                          |
| `destroy()`                           | 销毁：关闭面板（打开时触发 `onClose`）、取消录音并释放麦克风、取消请求、移除 DOM；可重复调用  |
| `Broadcast.VERSION`                   | 版本号                                                                                        |

实例上还继承了 Drawer 的 `options`、`setTitle()`、`setContent()` 等成员；`setContent()` 会替换整块广播内容，不要调用。

### 回调

| 回调                     | 参数                                     | 触发时机                                                                                        |
| ------------------------ | ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `onOpen`                 | -                                        | 面板打开                                                                                        |
| `onClose`                | -                                        | 面板关闭：关闭按钮、遮罩、Esc、`close()` / `open = false`，以及打开状态下的 `destroy()`         |
| `onVoiceListChange`      | `VoiceItem[]`（副本）                    | 语音列表全部页加载完（含空列表；后续页失败时为已加载的部分）。首页失败、初始 `voiceList` 不触发 |
| `onApiResult`            | `{ api, success, code, msg, data }`      | 内置接口每次调用完成（成功或失败）；宿主接管的下发、销毁后到达的结果不触发                      |
| `onRequestSendVoice`     | `{ fileUrl, deviceSerial, channelNo }`   | 点击语音项。配置后由宿主下发，控件不再调用内置接口                                              |
| `onRequestSendVoiceOnce` | `{ voiceFile, deviceSerial, channelNo }` | 录音结束并得到有效录音。配置后由宿主下发，控件不再调用内置接口                                  |
| `onVoiceRecorded`        | 同 `onRequestSendVoiceOnce`              | 得到有效录音，紧挨在下发之前                                                                    |
| `onRecordStart`          | -                                        | 获取麦克风成功、开始采集                                                                        |
| `onRecordStop`           | -                                        | 结束录音并得到有效录音；取消录音时不触发                                                        |
| `onRecordComplete`       | `voiceFile: Blob`                        | 录音完成：正常结束，或达到最长时长自动停止采集并暂存                                            |
| `onError`                | `{ type, code, msg, error }`             | 录音出错：`type: 'permission'` 为获取麦克风失败，`type: 'record'` 为其它录音错误，详见 GUIDE    |

回调每次触发时读取最新配置；回调抛出的异常会被捕获并通过 `logger` 打印，不会中断控件流程。

### 导出

```ts
import Broadcast from '@ezuikit/control-broadcast';
import type { BroadcastOptions, BroadcastCallbacks, BroadcastErrorInfo, BroadcastErrorCode, MicrophoneErrorCode, BroadcastApiResult, VoiceItem, VoiceListResult, SendVoiceRequest, SendVoiceOnceRequest } from '@ezuikit/control-broadcast';
```

只有默认导出的 `Broadcast` 类是值，其余都是类型：CJS 产物为 `module.exports = Broadcast`，`require()` 直接得到类。UMD 产物的全局变量为 `Broadcast`。接口路径见 [GUIDE](./GUIDE.md#接口与-token)。

## 样式

```ts
import '@ezuikit/control-broadcast/dist/style/style.css'; // 已包含 Drawer 与 Message 的样式
```

类名统一前缀 `ebroadcast`（TS：`constant.ts` 的 `_BROADCAST_PREFIX_CLS_`；SCSS：`$broadcast-prefix-cls`）。面板根节点带 `ebroadcast-drawer`，可在其上覆盖 Drawer 的 `--edrawer-*` 变量。结构与定制见 [GUIDE.md](./GUIDE.md#界面与样式)。

## License

Copyright © Ezviz-OpenBiz
