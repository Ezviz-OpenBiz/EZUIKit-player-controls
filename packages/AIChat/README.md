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

1. AIChat 触发用户交互事件（`messageSent`、`quickAction`、`videoPlay`）
2. 上层（ezopen）监听这些事件，调用实际的 AI 接口
3. 上层通过 AIChat 提供的方法传入数据（`showSearchResult`、`showSummary` 等）
4. AIChat 更新 UI 显示

**数据流向：**

```
用户操作 → AIChat 触发事件 → 上层监听事件 → 调用 AI 接口 → 上层调用 AIChat 方法传入数据 → AIChat 更新 UI
```

## 安装

```bash
pnpm install @ezuikit/control-aichat
```

## 使用

### 基础使用

```typescript
import AIChat from '@ezuikit/control-aichat';

const aiChat = new AIChat({
  container: '#ai-chat-container',
  language: 'zh',
  isMobile: false,
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

## API

### 构造函数

```typescript
new AIChat(options: AIChatOptions)
```

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

### 对外事件（上层需要监听）

- `open` - 界面打开
- `close` - 界面关闭
- `messageSent` - 用户发送消息（上层需要调用 AI 接口）
- `quickAction` - 快捷操作点击（type: 'search' | 'summary' | 'highlights'）
- `videoPlay` - 视频播放请求
- `viewAll` - 查看全部视频列表

## 开发

```bash
# 开发模式
pnpm dev

# 构建
pnpm build
```

## License

Copyright © Ezviz-OpenBiz
