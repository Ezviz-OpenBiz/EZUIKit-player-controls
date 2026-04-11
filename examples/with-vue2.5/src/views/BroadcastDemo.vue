<template>
  <div>
    <h2>Broadcast 云广播</h2>
    <div ref="broadcastContainer" style="width: 400px; height: 500px; position: relative;"></div>
  </div>
</template>

<script>
import Broadcast from "@ezuikit/control-broadcast";

export default {
  name: "BroadcastDemo",
  data() {
    return { broadcast: null };
  },
  mounted() {
    this.broadcast = new Broadcast({
      container: this.$refs.broadcastContainer,
      deviceSerial: "your-device-serial",
      channelNo: 1,
      accessToken: "your-access-token",
      language: "zh",
      direction: "bottom",
    });

    this.broadcast.on(Broadcast.EVENTS.requestQueryVoiceList, function () {
      console.log("Broadcast: 请求语音列表");
    });

    this.broadcast.on(Broadcast.EVENTS.requestSendVoice, function (data) {
      console.log("Broadcast: 下发语音", data);
    });

    this.broadcast.on(Broadcast.EVENTS.requestSendVoiceOnce, function (data) {
      console.log("Broadcast: 下发临时语音", data);
    });

    this.broadcast.open();
  },
  beforeDestroy() {
    if (this.broadcast) this.broadcast.destroy();
  },
};
</script>
