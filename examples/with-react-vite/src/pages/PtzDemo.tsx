import React, { useEffect, useRef } from "react";
import { Ptz } from "@ezuikit/control-ptz";

export default function PtzDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ptz: Ptz | null = null;

    if (containerRef.current) {
      ptz = new Ptz(containerRef.current, {
        language: "zh",
        accessToken: "your-access-token",
        deviceSerial: "your-device-serial",
        channelNo: 1,
        onDirection: (info) => {
          console.log("Ptz direction:", info);
          return () => {};
        },
        onSpeedChange: (speed) => {
          console.log("Ptz speed:", speed);
        },
      });
    }

    return () => {
      ptz?.destroy();
    };
  }, []);

  return (
    <div>
      <h2>Ptz 云台控制</h2>
      <div ref={containerRef} style={{ width: 300, height: 300 }} />
    </div>
  );
}
