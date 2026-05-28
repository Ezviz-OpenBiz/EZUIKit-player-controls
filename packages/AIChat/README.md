# @ezuikit/control-aichat

AI视频搜索对话控制模块

## 功能特性

- 💬 AI对话交互界面
- 🔍 视频搜索结果展示
- 📊 数据统计总结展示
- 🎯 重点事件展示
- 🎬 视频列表浏览
- 🌍 国际化支持（中英文）
- 🔌 纯 UI 组件，数据由上层传入
- 📱 支持移动端和桌面端

## 架构说明

AIChat 模块是一个**纯 UI 组件**，采用事件驱动架构：

1. AIChat 触发用户交互事件（`messageSent`、`quickAction`、`videoPlay`、`upgrade` 等）
2. 上层（ezopen）监听这些事件 / 配置回调，调用实际的 AI 接口
3. 上层通过 AIChat 提供的方法传入数据（`showSearchResult`、`showSummary` 等）
4. AIChat 更新 UI 显示

**数据流向：**

```
                ┌─ messageSent ──→ 调用 chat/completions 接口
                │     ↑
用户操作 → AIChat ─┼─ quickAction ──→ 调用对应业务方法
                │
                └─ upgrade ───────→ onUpgradeService 回调（未开通场景）
                                          ↓
                                上层接口返回数据 → showXxx() → AIChat 更新 UI
```

按业务状态切换 UI：

```
isAICloudEnabled = true   →  正常对话 / 推荐 / 视频列表
isAICloudEnabled = false  →  权益升级页（DOM 表 + 点击升级按钮）
```

## 安装

```bash
pnpm install @ezuikit/control-aichat
```

## CSS 引入

样式被独立 emit 到 `dist/style/style.css`，**必须显式引入一次**，否则 UI 没有任何样式。

```ts
// 方式 A：ESM 中通过 side-effect 引入（推荐）
import '@ezuikit/control-aichat/dist/style/style.css';

// 方式 B：HTML 中 link
// <link rel="stylesheet" href="./node_modules/@ezuikit/control-aichat/dist/style/style.css" />
```

> 通过 `EZUIKitPlayer` 主 SDK 间接使用时，主 SDK 已经把这份 CSS 烘焙进 `style.css`，无需重复引入。

## 使用

### 基础使用

```typescript
import AIChat from '@ezuikit/control-aichat';
import '@ezuikit/control-aichat/dist/style/style.css';

const aiChat = new AIChat({
  container: '#ai-chat-container',
  language: 'zh',
  isMobile: false,
  // AI 云存储是否已开通；false 时打开升级页
  isAICloudEnabled: true,
  // 升级页"立即升级"按钮回调（仅 isAICloudEnabled=false 时有意义）
  onUpgradeService: () => {
    console.log('用户点了升级');
  },
  suggestedQueries: ['帮我搜宝宝出现的录像', '帮我搜爸爸的录像', '帮我查一下宝宝摔倒的视频'],
});

// 打开 AI 对话界面
aiChat.open();

// 监听用户发送消息
aiChat.on('messageSent', (data) => {
  console.log('用户消息', data.message);

  // 调用你的 AI 接口
  callYourAIAPI(data.message).then((result) => {
    // 将结果传回 AIChat
    aiChat.addAIMessage(result.text, result.data);
  });
});

// 监听快捷操作
aiChat.on('quickAction', (data) => {
  console.log('快捷操作', data.type);

  if (data.type === 'summary') {
    // 获取总结数据
    getSummaryData().then((summary) => {
      aiChat.showSummary(summary);
    });
  }
});

// 销毁
aiChat.destroy();
```

### AI 云存储未开通（升级页）

```typescript
const aiChat = new AIChat({
  container: '#ai-chat-container',
  isAICloudEnabled: false,            // 触发升级页
  onUpgradeService: () => {
    // 跳转或弹付费弹窗
    window.open('https://your-upgrade-page', '_blank');
  },
});
aiChat.open();

// 也可以监听事件（与 onUpgradeService 同步触发，二选一即可）
aiChat.on('upgrade', (data) => {
  console.log('升级事件', data);
});
```

> 通过 `EZUIKitPlayer` 主 SDK 集成时，`onUpgradeService` 必须配在 `params.onUpgradeService`（ezopen 的 `_initAIChat()` 从 `this.params.onUpgradeService` 读取，不会从实例属性读取）。

### 快捷操作 actionList（含二级菜单）

接口返回的 `actionList` 支持 `children` 字段，含 children 的项会渲染为带"▾"的下拉按钮，点击弹出 popover：

```typescript
import type { ActionItem } from '@ezuikit/control-aichat';

const actionList: ActionItem[] = [
  {
    sequenceNo: 1,
    actionType: 'searchRecording',
    actionName: '找录像',
    messageContent: '请帮我找出今天有人出现的录像',
    children: [
      { sequenceNo: 1, actionType: 'searchRecording', actionName: '找人', messageContent: '请帮我找出今天有人出现的录像', children: null },
      { sequenceNo: 2, actionType: 'searchRecording', actionName: '找车', messageContent: '请帮我找出今天有车出现的录像', children: null },
    ],
  },
];

aiChat.updateActionList(actionList);
```

> 内置"相关度"按钮（actionType=`builtinRelevance`）固定追加在最右，子项为"低 / 中 / 高"，默认值"高"（`level: 3`）。选中后**不会发消息**，只切 level 状态并改写父按钮文案，下次发送 chat/completions 时通过 `relevanceLevel` 参数传给后端。

### 与上层集成（ezopen）

上层需要监听 AIChat 的事件并传入数据：

```javascript
// 创建 AIChat 实例
const aiChat = new AIChat({
  container: '#ai-chat-container',
  language: 'zh',
  isMobile: false,
  suggestedQueries: ['帮我搜宝宝出现的录像', '帮我搜爸爸的录像', '帮我查一下宝宝摔倒的视频'],
});

// 监听用户消息
aiChat.on('messageSent', async (data) => {
  console.log('用户消息:', data.message);

  // 显示加载状态
  aiChat.showLoading();

  try {
    // 调用你的 AI 搜索接口
    const result = await player.searchVideo({
      query: data.message,
      deviceSerial: 'your-device-serial',
      channelNo: '1',
    });

    // 隐藏加载状态
    aiChat.hideLoading();

    // 添加 AI 回复消息
    aiChat.addAIMessage(`已帮你找到${result.videos.length}条${data.message}的录像`);

    // 显示搜索结果
    aiChat.showSearchResult(result.videos, data.message);
  } catch (error) {
    aiChat.hideLoading();
    aiChat.showError('搜索失败：' + error.message);
  }
});

// 监听快捷操作
aiChat.on('quickAction', async (data) => {
  console.log('快捷操作:', data.type);

  if (data.type === 'summary') {
    // 获取总结
    aiChat.showLoading();
    try {
      const summary = await player.getSummary();
      aiChat.hideLoading();
      aiChat.showSummary(summary);
    } catch (error) {
      aiChat.hideLoading();
      aiChat.showError('获取总结失败');
    }
  } else if (data.type === 'highlights') {
    // 获取重点事件
    aiChat.showLoading();
    try {
      const highlights = await player.getHighlights();
      aiChat.hideLoading();
      aiChat.showHighlights(highlights);
    } catch (error) {
      aiChat.hideLoading();
      aiChat.showError('获取重点事件失败');
    }
  }
});

// 监听视频播放
aiChat.on('videoPlay', (data) => {
  console.log('播放视频', data.video);
  // 调用播放器播放视频
  player.playVideo(data.video.playUrl);
});

// 监听查看全部
aiChat.on('viewAll', (data) => {
  console.log('查看全部视频', data.videos.length);
  // 可以跳转到视频列表页面或展开完整列表
});
```

### 数据格式示例

**视频项格式：**

```typescript
const videoItem: VideoItem = {
  videoId: 'video-001',
  thumbnailUrl: 'https://example.com/thumb.jpg',
  playUrl: 'https://example.com/video.mp4',
  startTime: '2026-01-19 10:00:00',
  endTime: '2026-01-19 10:05:00',
  duration: 300,
  description: '宝宝在客厅玩耍',
};
```

**总结数据格式：**

```typescript
const summaryData: SummaryData = {
  title: '今日总结',
  timeRange: '该数据截止至今日12点',
  statistics: {
    totalVideos: 15,
    personCount: 12,
    petCount: 1,
    babyFallCount: 2,
  },
  highlights: [
    {
      eventId: 'event-001',
      title: '宝宝在客厅摔倒',
      description: '',
      videoCount: 1,
      videos: [videoItem],
    },
    {
      eventId: 'event-002',
      title: '爸爸在看电视',
      description: '',
      videoCount: 5,
      videos: [videoItem1, videoItem2],
    },
  ],
};
```

**ActionItem 格式（快捷操作 / 含二级菜单）：**

```typescript
const action: ActionItem = {
  sequenceNo: 1,
  actionType: 'searchRecording',
  actionName: '找录像',
  messageContent: '请帮我找出今天有人出现的录像',
  /** 二级菜单；不需要二级菜单则置 null */
  children: [
    { sequenceNo: 1, actionType: 'searchRecording', actionName: '找人', messageContent: '...', children: null },
  ],
  /** 内置 builtinRelevance 用于携带 level/label */
  payload: { level: 3, label: '高' },
};
```

## API

### 构造函数

```typescript
new AIChat(options: AIChatOptions)
```

**AIChatOptions 关键字段：**

| 字段 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `container` | `string \| HTMLElement` | — | 挂载容器 |
| `language` | `'zh' \| 'en'` | `'zh'` | 多语言 |
| `isMobile` | `boolean` | `false` | 是否移动端样式 |
| `isAICloudEnabled` | `boolean` | `true` | AI 云存储是否已开通；false 时打开升级页 |
| `onUpgradeService` | `() => void` | — | 升级页"点击升级"回调 |
| `suggestedQueries` | `string[]` | `[]` | 默认推荐 query（接口数据未到时显示） |
| `accessToken` | `string` | — | 调用内置接口所需 |
| `baseURL` | `string` | `https://open.ys7.com` | 接口域名 |
| `deviceSerial` | `string` | — | 设备序列号 |

### 方法

**基础方法**

- `open()` - 打开 AI 对话界面
- `close()` - 关闭 AI 对话界面
- `destroy()` - 销毁实例
- `on(event, callback)` - 监听事件
- `off(event, callback)` - 移除事件监听
- `updateOptions(options)` - 更新配置

**数据传入方法（由上层调用）**

- `addUserMessage(message)` - 添加用户消息
- `addAIMessage(message, data?)` - 添加 AI 消息
- `showSearchResult(videos, query)` - 显示搜索结果
- `showSummary(summary)` - 显示总结数据
- `showHighlights(highlights)` - 显示重点事件
- `showError(message)` - 显示错误信息
- `showLoading()` - 显示加载状态
- `hideLoading()` - 隐藏加载状态
- `updateActionList(actionList)` - 更新底部快捷操作按钮（含 children 自动渲染下拉）

### 对外事件（上层需要监听）

- `open` - 界面打开
- `close` - 界面关闭
- `messageSent` - 用户发送消息（携带 message + 当前 relevanceLevel，上层据此调用 chat/completions）
- `quickAction` - 快捷操作点击（type: 'search' | 'summary' | 'highlights' | 自定义 actionType）
- `videoPlay` - 视频播放请求
- `viewAll` - 查看全部视频列表
- `upgrade` - 升级页"点击升级"按钮被触发（与 `onUpgradeService` 同步触发）
- `error` - 内部错误

> 推荐用 `EZUIKitPlayer.EVENTS.xxx` 引用事件名，避免硬编码字符串。

## 接口

内置 chat/suggested、chat/completions 两个接口的封装在 `services/index.ts` 中：

| 接口 | 方法 | 关键参数 |
|---|---|---|
| 推荐内容 | `getChatSuggested(params)` | `deviceSerial`, `intelligentType?`（默认不传） |
| 对话补全 | `sendAIChatCompletions(message, options?)` | `relevanceLevel?: 1 \| 2 \| 3`（默认不带，由 UI 当前 level 注入） |

`relevanceLevel` 等级映射（服务端默认值，可热更）：

| level | 含义 | 默认阈值 |
|---|---|---|
| 1 | 低 | 0.10 |
| 2 | 中 | 0.17 |
| 3 | 高 | 0.50 |

## 开发

```bash
# 开发模式
pnpm dev

# 构建
pnpm build
```

## License

Copyright © Ezviz-OpenBiz
