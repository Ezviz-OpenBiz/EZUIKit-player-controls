import React, { useEffect, useRef } from "react";
import AIChat from "@ezuikit/control-aichat";

export default function AIChatDemo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let aiChat: AIChat | null = null;

    if (containerRef.current) {
      aiChat = new AIChat({
        container: containerRef.current,
        language: "zh",
        isMobile: false,
        isAICloudEnabled: true,
        accessToken: "your-access-token",
        deviceSerial: "your-device-serial",
        channelNo: 1,
      });

      aiChat.on(AIChat.EVENTS.messageSent, (data: any) => {
        console.log("AIChat messageSent:", data);
      });

      aiChat.on(AIChat.EVENTS.videoPlay, (data: any) => {
        console.log("AIChat videoPlay:", data);
      });

      aiChat.open();
    }

    return () => {
      aiChat?.destroy();
    };
  }, []);

  return (
    <div>
      <h2>AIChat AI视频搜索对话</h2>
      <div ref={containerRef} style={{ width: 400, height: 600, position: "relative" }} />
    </div>
  );
}
