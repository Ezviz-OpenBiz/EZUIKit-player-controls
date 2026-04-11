import React, { useEffect, useRef } from "react";
import Zoom from "@ezuikit/control-zoom";

export default function ZoomDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<Zoom | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      zoomRef.current = new Zoom(containerRef.current, {
        initialZoom: 1,
        allowWheel: true,
        allowPan: true,
        max: 8,
        min: 1,
        onChange: (zoomVal, reset) => {
          console.log("Zoom onChange:", zoomVal, reset);
        },
      });
    }

    return () => {
      zoomRef.current?.destroy();
    };
  }, []);

  return (
    <div>
      <h2>Zoom 缩放控制</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => zoomRef.current?.zoomIn(0.5)}>放大</button>
        <button onClick={() => zoomRef.current?.zoomOut(0.5)} style={{ marginLeft: 8 }}>缩小</button>
        <button onClick={() => zoomRef.current?.reset()} style={{ marginLeft: 8 }}>重置</button>
      </div>
      <div ref={containerRef} style={{ width: 600, height: 400, border: "1px solid #ccc", overflow: "hidden" }}>
        <img src="https://via.placeholder.com/600x400" alt="zoom demo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );
}
