<template>
  <div>
    <h2>Ptz 云台控制</h2>
    <div ref="ptzContainer" style="width: 300px; height: 300px;"></div>
  </div>
</template>

<script>
import "@ezuikit/control-ptz/dist/style/style.js";
import { Ptz } from "@ezuikit/control-ptz";

export default {
  name: "PtzDemo",
  data() {
    return { ptz: null };
  },
  mounted() {
    this.ptz = new Ptz(this.$refs.ptzContainer, {
      language: "zh",
      accessToken: "your-access-token",
      deviceSerial: "your-device-serial",
      channelNo: 1,
      onDirection: function (info) {
        console.log("Ptz direction:", info);
        return function () {};
      },
      onSpeedChange: function (speed) {
        console.log("Ptz speed:", speed);
      },
    });
  },
  beforeDestroy() {
    if (this.ptz) this.ptz.destroy();
  },
};
</script>
