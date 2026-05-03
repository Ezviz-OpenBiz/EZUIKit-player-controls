import React, { useEffect, useRef, useState } from "react";
import Talk from "@ezuikit/control-talk";

export default function TalkDemo() {
  const talkRef = useRef<Talk | null>(null);
  const [isTalking, setIsTalking] = useState(false);

  useEffect(() => {
    talkRef.current = new Talk({
      deviceSerial: "your-device-serial",
      accessToken: "your-access-token",
      channelNo: "1",
      env: { domain: "https://open.ys7.com" },
      capacity: { support_talk: null, support_switch_talkmode: null },
    });

    return () => {
      talkRef.current?.destroy();
    };
  }, []);

  const startTalk = () => {
    talkRef.current?.startTalk((isGb) => {
      console.log("Talk started, isGb:", isGb);
      setIsTalking(true);
    });
  };

  const stopTalk = () => {
    talkRef.current?.stopTalk();
    setIsTalking(false);
  };

  return (
    <div>
      <h2>Talk 对讲</h2>
      <p>状态: {isTalking ? "对讲中..." : "未开始"}</p>
      <button onClick={startTalk} disabled={isTalking}>开始对讲</button>
      <button onClick={stopTalk} disabled={!isTalking} style={{ marginLeft: 8 }}>停止对讲</button>
    </div>
  );
}
