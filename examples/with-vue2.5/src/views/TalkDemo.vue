<template>
  <div>
    <h2>Talk 对讲</h2>
    <p>状态: {{ isTalking ? '对讲中...' : '未开始' }}</p>
    <button @click="startTalk" :disabled="isTalking">开始对讲</button>
    <button @click="stopTalk" :disabled="!isTalking" style="margin-left: 8px;">停止对讲</button>
  </div>
</template>

<script>
import Talk from "@ezuikit/control-talk";

export default {
  name: "TalkDemo",
  data() {
    return {
      talk: null,
      isTalking: false,
    };
  },
  mounted() {
    this.talk = new Talk({
      deviceSerial: "your-device-serial",
      channelNo: "1",
      accessToken: "your-access-token",
      env: { domain: "https://open.ys7.com" },
      capacity: { support_talk: null, support_switch_talkmode: null },
    });
  },
  methods: {
    startTalk() {
      var self = this;
      this.talk.startTalk(function (isGb) {
        console.log("Talk started, isGb:", isGb);
        self.isTalking = true;
      });
    },
    stopTalk() {
      this.talk.stopTalk();
      this.isTalking = false;
    },
  },
  beforeDestroy() {
    if (this.talk) this.talk.destroy();
  },
};
</script>
