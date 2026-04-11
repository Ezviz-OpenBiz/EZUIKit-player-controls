<template>
  <div>
    <h2>Zoom 缩放控制</h2>
    <div style="margin-bottom: 12px;">
      <button @click="zoomIn">放大</button>
      <button @click="zoomOut" style="margin-left: 8px;">缩小</button>
      <button @click="resetZoom" style="margin-left: 8px;">重置</button>
    </div>
    <div ref="zoomContainer" style="width: 600px; height: 400px; border: 1px solid #ccc; overflow: hidden;">
      <img src="https://images.pexels.com/photos/34577784/pexels-photo-34577784.jpeg" alt="zoom demo" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
  </div>
</template>

<script>
import Zoom from "@ezuikit/control-zoom";

export default {
  name: "ZoomDemo",
  data() {
    return { zoom: null };
  },
  mounted() {
    this.zoom = new Zoom(this.$refs.zoomContainer, {
      initialZoom: 1,
      allowWheel: true,
      allowPan: true,
      max: 8,
      min: 1,
      onChange: function (zoomVal, reset) {
        console.log("Zoom onChange:", zoomVal, reset);
      },
    });
  },
  methods: {
    zoomIn() { if (this.zoom) this.zoom.zoomIn(0.5); },
    zoomOut() { if (this.zoom) this.zoom.zoomOut(0.5); },
    resetZoom() { if (this.zoom) this.zoom.reset(); },
  },
  beforeDestroy() {
    if (this.zoom) this.zoom.destroy();
  },
};
</script>
