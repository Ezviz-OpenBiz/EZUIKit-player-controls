<template>
  <div>
    <h2>Broadcast 云广播</h2>
    <div style="margin-bottom: 12px;">
      <button @click="open">打开</button>
      <button @click="close" style="margin-left: 8px;">关闭</button>
      <button @click="reload" style="margin-left: 8px;">重新加载语音列表</button>
      <span style="margin-left: 12px;">语音数量：{{ voiceCount }}</span>
    </div>
    <div ref="broadcastContainer" style="width: 400px; height: 500px; position: relative; background: #000;"></div>
  </div>
</template>

<script>
import Broadcast from "@ezuikit/control-broadcast";
import "@ezuikit/control-broadcast/dist/style/style.css";

// 模拟宿主下发接口（实际项目中替换为真实的下发请求）
function mockRequest() {
  return new Promise(function (resolve) {
    setTimeout(resolve, 500);
  });
}

export default {
  name: "BroadcastDemo",
  data() {
    return { voiceCount: 0 };
  },
  mounted() {
    var self = this;
    // 实例不放进 data，避免 Vue 2 对其做深度响应式代理
    // 第一个参数是挂载容器，非 body 容器需为定位元素
    var broadcast = new Broadcast(this.$refs.broadcastContainer, {
      deviceSerial: "your-device-serial",
      channelNo: 1,
      accessToken: "your-access-token",
      language: "zh",
      direction: "bottom",
      onOpen: function () {
        console.log("Broadcast: 面板已打开");
      },
      onClose: function () {
        console.log("Broadcast: 面板已关闭");
      },
      // 语音列表由控件调用内置接口查询，加载完后通过该回调通知宿主
      onVoiceListChange: function (list) {
        self.voiceCount = list.length;
      },
      onApiResult: function (result) {
        console.log("Broadcast: 内置接口结果", result);
      },
      onRecordComplete: function (voiceFile) {
        console.log("Broadcast: 录音完成", voiceFile.size);
      },
      onError: function (info) {
        console.log("Broadcast: 错误", info.type, info.code, info.msg);
      },
      // 配置后由宿主接管「下发默认语音」，下发后用 showSuccess / showError 回填结果
      onRequestSendVoice: function (data) {
        console.log("Broadcast: 下发语音", data.fileUrl, data.channelNo);
        mockRequest()
          .then(function () {
            broadcast.showSuccess("语音下发成功");
          })
          .catch(function (error) {
            broadcast.showError((error && error.message) || "语音下发失败");
          });
      },
      // 配置后由宿主接管「下发临时语音」（录音结束时触发）
      onRequestSendVoiceOnce: function (data) {
        console.log("Broadcast: 下发临时语音", data.voiceFile.size, data.channelNo);
        mockRequest()
          .then(function () {
            broadcast.showSuccess("临时语音下发成功");
          })
          .catch(function (error) {
            broadcast.showError((error && error.message) || "临时语音下发失败");
          });
      },
    });

    this.broadcast = broadcast;
    broadcast.open = true;
  },
  beforeDestroy() {
    if (this.broadcast) this.broadcast.destroy();
    this.broadcast = null;
  },
  methods: {
    open() {
      if (this.broadcast) this.broadcast.open = true;
    },
    close() {
      if (this.broadcast) this.broadcast.close();
    },
    reload() {
      if (this.broadcast) this.broadcast.loadVoiceList();
    },
  },
};
</script>
