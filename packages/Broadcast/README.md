# @ezuikit/control-broadcast

云广播喊话控制模块

## 功能特性

- 🎤 语音录制（3-60秒）
- 📋 默认语音列表查询
- 📤 临时语音下发
- 🔊 默认语音下发
- 🎵 录音播放预览
- 🌍 国际化支持（中英文）
- 🔌 事件驱动架构，解耦接口调用

## 架构说明

Broadcast 模块采用**事件驱动架构**，不直接调用接口，而是通过 EventEmitter 与上层通信：

1. Broadcast 触发请求事件（`requestQueryVoiceList`、`requestSendVoiceOnce`、`requestSendVoice`）
2. 上层（ezopen）监听这些事件，调用实际的接口方法
3. 上层将结果通过事件返回给 Broadcast（`voiceListLoaded`、`voiceSent` 等）
4. Broadcast 监听结果事件，更新 UI 和内部状态

详细说明请参考 [EVENT_DRIVEN_ARCHITECTURE.md](./EVENT_DRIVEN_ARCHITECTURE.md)

## 安装

```bash
pnpm install @ezuikit/control-broadcast
```

## 使用

### 基础使用

```typescript
import Broadcast from '@ezuikit/control-broadcast';

const broadcast = new Broadcast({
  deviceSerial: 'BA5551167',
  channelNo: '1',
  accessToken: 'your-access-token',
  env: {
    domain: 'https://open.ys7.com',
  },
});

// 打开云广播界面
broadcast.open();

// 监听事件
broadcast.on('voiceListLoaded', (data) => {
  console.log('语音列表加载完成', data);
});

broadcast.on('voiceSent', (data) => {
  console.log('语音下发成功', data);
});

// 销毁
broadcast.destroy();
```

### 与上层集成（ezopen）

上层需要监听 Broadcast 的请求事件并调用实际接口：

```javascript
// 监听查询语音列表请求
broadcast.eventEmitter.on('requestQueryVoiceList', async (data) => {
  try {
    const result = await player.queryVoiceList({
      deviceSerial: data.params.deviceSerial,
      channelNo: data.params.channelNo,
      pageSize: data.params.pageSize,
    });

    broadcast.eventEmitter.emit('voiceListLoaded', {
      eventType: 'voiceListLoaded',
      code: 0,
      data: result.data,
      msg: '语音列表加载成功',
    });
  } catch (error) {
    broadcast.eventEmitter.emit('voiceListError', {
      eventType: 'voiceListError',
      code: -1,
      msg: error.message,
      error,
    });
  }
});

// 监听临时语音下发请求
broadcast.eventEmitter.on('requestSendVoiceOnce', async (data) => {
  try {
    const result = await player.sendVoiceOnce({
      deviceSerial: data.deviceSerial,
      channelNo: data.channelNo,
      voiceFile: data.voiceFile,
    });

    broadcast.eventEmitter.emit('voiceSent', {
      eventType: 'voiceSent',
      code: 0,
      data: result,
      msg: '临时语音下发成功',
    });
  } catch (error) {
    broadcast.eventEmitter.emit('voiceSendError', {
      eventType: 'voiceSendError',
      code: -1,
      msg: error.message,
      error,
    });
  }
});

// 监听默认语音下发请求
broadcast.eventEmitter.on('requestSendVoice', async (data) => {
  try {
    const result = await player.sendVoice({
      deviceSerial: data.deviceSerial,
      channelNo: data.channelNo,
      fileUrl: data.fileUrl,
    });

    broadcast.eventEmitter.emit('voiceSent', {
      eventType: 'voiceSent',
      code: 0,
      data: result,
      msg: '默认语音下发成功',
    });
  } catch (error) {
    broadcast.eventEmitter.emit('voiceSendError', {
      eventType: 'voiceSendError',
      code: -1,
      msg: error.message,
      error,
    });
  }
});
```

## API

### 构造函数

```typescript
new Broadcast(options: BroadcastOptions)
```

### 方法

- `open()` - 打开云广播界面
- `close()` - 关闭云广播界面
- `destroy()` - 销毁实例
- `on(event, callback)` - 监听事件
- `off(event, callback)` - 移除事件监听
- `updateOptions(options)` - 更新配置

### 请求事件（上层需要监听）

- `requestQueryVoiceList` - 请求查询语音列表
- `requestSendVoiceOnce` - 请求下发临时语音
- `requestSendVoice` - 请求下发默认语音

### 结果事件（上层需要触发）

- `voiceListLoaded` - 语音列表加载成功
- `voiceListError` - 语音列表加载失败
- `voiceSent` - 语音下发成功
- `voiceSendError` - 语音下发失败

### 对外事件（应用层可监听）

- `open` - 界面打开
- `close` - 界面关闭
- `recordStart` - 开始录音
- `recordStop` - 停止录音
- `recordComplete` - 录音完成
- `recordError` - 录音错误
- `error` - 通用错误

## 开发

```bash
# 开发模式
pnpm dev

# 构建
pnpm build
```

## License

Copyright © Ezviz-OpenBiz
