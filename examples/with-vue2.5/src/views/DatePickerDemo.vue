<template>
  <div>
    <h2>DatePicker 日期选择器</h2>
    <section>
      <h3>DatePicker</h3>
      <div ref="pickerContainer" style="width: 300px;"></div>
    </section>
    <section style="margin-top: 24px;">
      <h3>Calendar 日历</h3>
      <div ref="calendarContainer" style="width: 300px;"></div>
    </section>
  </div>
</template>

<script>
import "@ezuikit/control-date-picker/dist/style/style.js";
import { DatePicker, Calendar } from "@ezuikit/control-date-picker";

export default {
  name: "DatePickerDemo",
  data() {
    return {
      datePicker: null,
      calendar: null,
    };
  },
  mounted() {
    this.datePicker = new DatePicker(this.$refs.pickerContainer, {
      language: "zh",
      current: new Date(),
      onChange: function (date, mode) {
        console.log("DatePicker onChange:", date, mode);
      },
      onCell: function (date, mode) {
        console.log("DatePicker onCell:", date, mode);
      },
    });

    this.calendar = new Calendar(this.$refs.calendarContainer, {
      language: "zh",
      current: new Date(),
      badges: [new Date()],
      onChange: function (date, dateStr) {
        console.log("Calendar onChange:", date, dateStr);
      },
    });
  },
  beforeDestroy() {
    if (this.datePicker) this.datePicker.destroy();
    if (this.calendar) this.calendar.destroy();
  },
};
</script>
