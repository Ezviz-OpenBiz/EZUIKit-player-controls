import React, { useEffect, useRef } from "react";
import Broadcast from "@ezuikit/control-broadcast";

export default function BroadcastDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let broadcast: Broadcast | null = null;

    if (containerRef.current) {
      broadcast = new Broadcast({
        container: containerRef.current,
        deviceSerial: "your-device-serial",
        channelNo: 1,
        accessToken: "your-access-token",
        language: "zh",
        direction: "bottom",
      });

      broadcast.on(Broadcast.EVENTS.requestQueryVoiceList, () => {
        console.log("Broadcast: 请求语音列表");
      });

      broadcast.on(Broadcast.EVENTS.requestSendVoice, (data: any) => {
        console.log("Broadcast: 下发语音", data);
      });

      broadcast.on(Broadcast.EVENTS.requestSendVoiceOnce, (data: any) => {
        console.log("Broadcast: 下发临时语音", data);
      });

      broadcast.open();
    }

    return () => {
      broadcast?.destroy();
    };
  }, []);

  return (
    <div>
      <h2>Broadcast 云广播</h2>
      <div ref={containerRef} style={{ width: 400, height: 500, position: "relative" }} />
    </div>
  );
}
