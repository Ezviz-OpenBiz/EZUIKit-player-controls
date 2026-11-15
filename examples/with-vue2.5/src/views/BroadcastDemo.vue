<template>
  <div>
    <h2>Broadcast 云广播</h2>
    <div style="margin-bottom: 12px;">
      <button @click="open">打开</button>
      <button @click="close" style="margin-left: 8px;">关闭</button>
    </div>
    <div ref="broadcastContainer" style="width: 400px; height: 500px; position: relative; background: #000;"></div>
  </div>
</template>

<script>
import Broadcast from "@ezuikit/control-broadcast";
import "@ezuikit/control-broadcast/dist/style/style.css";

// 模拟宿主接口（实际项目中替换为 player.queryVoiceList / sendVoice / sendVoiceOnce）
var mockVoiceList = [
  { voiceName: "欢迎光临", fileUrl: "https://example.com/welcome.wav", duration: 3 },
  { voiceName: "请勿靠近", fileUrl: "https://example.com/warning.wav", duration: 5 },
];
function mockRequest(data) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(data);
    }, 500);
  });
}

export default {
  name: "BroadcastDemo",
  mounted() {
    // 实例不放进 data，避免 Vue 2 对其做深度响应式代理
    // 第一个参数是挂载容器，容器需为定位元素
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
      onRecordComplete: function (voiceFile) {
        console.log("Broadcast: 录音完成", voiceFile.size);
      },
      onRecordError: function (e) {
        console.log("Broadcast: 录音错误", e.msg);
      },
      // 查询语音列表：打开面板时没有语音列表，或调用 loadVoiceList() 时触发
      onRequestQueryVoiceList: function (params) {
        console.log("Broadcast: 请求语音列表", params);
        mockRequest(mockVoiceList)
          .then(function (list) {
            broadcast.updateVoiceList(list || []);
          })
          .catch(function (error) {
            broadcast.showError((error && error.message) || "语音列表加载失败");
          });
      },
      // 下发默认语音：点击语音项时触发
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
      // 下发临时语音：录音结束、得到有效录音时触发
      onRequestSendVoiceOnce: function (data) {
        console.log("Broadcast: 下发临时语音", data.voiceFile, data.channelNo);
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
  },
};
</script>
