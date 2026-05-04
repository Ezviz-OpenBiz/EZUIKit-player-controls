<template>
  <div>
    <h2>AIChat AI视频搜索对话</h2>
    <div ref="aiChatContainer" style="width: 400px; height: 600px; position: relative;"></div>
  </div>
</template>

<script>
import "@ezuikit/control-aichat/dist/style/style.js";
import AIChat from "@ezuikit/control-aichat";

export default {
  name: "AIChatDemo",
  data() {
    return { aiChat: null };
  },
  mounted() {
    this.aiChat = new AIChat({
      container: this.$refs.aiChatContainer,
      language: "zh",
      isMobile: false,
      isAICloudEnabled: true,
      accessToken: "your-access-token",
      deviceSerial: "your-device-serial",
      channelNo: 1,
    });

    this.aiChat.on(AIChat.EVENTS.messageSent, function (data) {
      console.log("AIChat messageSent:", data);
    });

    this.aiChat.on(AIChat.EVENTS.videoPlay, function (data) {
      console.log("AIChat videoPlay:", data);
    });

    this.aiChat.open();
  },
  beforeDestroy() {
    if (this.aiChat) this.aiChat.destroy();
  },
};
</script>
