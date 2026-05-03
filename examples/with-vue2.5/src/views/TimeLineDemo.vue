<template>
  <div>
    <h2>TimeLine 时间轴</h2>
    <section>
      <h3>PC 时间轴</h3>
      <div ref="pcContainer"></div>
    </section>
    <section style="margin-top: 24px;">
      <h3>移动端时间轴</h3>
      <div ref="mobileContainer" style="width: 375px;"></div>
    </section>
  </div>
</template>

<script>
import "@ezuikit/control-time-line/dist/style";
import { TimeLine, MobileTimeLine } from "@ezuikit/control-time-line";

export default {
  name: "TimeLineDemo",
  data() {
    return {
      timeLine: null,
      mobileTimeLine: null,
    };
  },
  mounted() {
    var now = new Date();
    var todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
    var todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
    var timeSections = [
      { startTime: todayStart.getTime(), endTime: todayEnd.getTime(), coverPic: "" },
    ];

    this.timeLine = new TimeLine(this.$refs.pcContainer, {
      current: now,
      language: "zh",
      timeSections: timeSections,
      width: 800,
      height: 38,
      onChange: function (time) {
        console.log("TimeLine onChange:", time);
      },
    });

    this.mobileTimeLine = new MobileTimeLine(this.$refs.mobileContainer, {
      current: now,
      language: "zh",
      timeSections: timeSections,
      height: 400,
      showTimeWidthBtn: true,
      onChange: function (time) {
        console.log("MobileTimeLine onChange:", time);
      },
    });
  },
  beforeDestroy() {
    if (this.timeLine) this.timeLine.destroy();
    if (this.mobileTimeLine) this.mobileTimeLine.destroy();
  },
};
</script>
