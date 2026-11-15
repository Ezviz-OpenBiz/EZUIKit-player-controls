import React, { useEffect, useRef, useState } from "react";
import Broadcast from "@ezuikit/control-broadcast";
import "@ezuikit/control-broadcast/dist/style/style.css";

// 模拟宿主下发接口（实际项目中替换为真实的下发请求）
const mockRequest = () => new Promise<void>((resolve) => setTimeout(resolve, 500));

export default function BroadcastDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const broadcastRef = useRef<Broadcast | null>(null);
  const [voiceCount, setVoiceCount] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // 第一个参数是挂载容器，非 body 容器需为定位元素
    const broadcast = new Broadcast(containerRef.current, {
      deviceSerial: "your-device-serial",
      channelNo: 1,
      accessToken: "your-access-token",
      language: "zh",
      direction: "bottom",
      onOpen: () => console.log("Broadcast: 面板已打开"),
      onClose: () => console.log("Broadcast: 面板已关闭"),
      // 语音列表由控件调用内置接口查询，加载完后通过该回调通知宿主
      onVoiceListChange: (list) => setVoiceCount(list.length),
      onApiResult: (result) => console.log("Broadcast: 内置接口结果", result),
      onRecordComplete: (voiceFile) => console.log("Broadcast: 录音完成", voiceFile.size),
      onError: ({ type, code, msg }) => console.log("Broadcast: 错误", type, code, msg),
      // 配置后由宿主接管「下发默认语音」，下发后用 showSuccess / showError 回填结果
      onRequestSendVoice: async ({ fileUrl, channelNo }) => {
        console.log("Broadcast: 下发语音", fileUrl, channelNo);
        try {
          await mockRequest();
          broadcast.showSuccess("语音下发成功");
        } catch (error: any) {
          broadcast.showError(error?.message || "语音下发失败");
        }
      },
      // 配置后由宿主接管「下发临时语音」（录音结束时触发）
      onRequestSendVoiceOnce: async ({ voiceFile, channelNo }) => {
        console.log("Broadcast: 下发临时语音", voiceFile.size, channelNo);
        try {
          await mockRequest();
          broadcast.showSuccess("临时语音下发成功");
        } catch (error: any) {
          broadcast.showError(error?.message || "临时语音下发失败");
        }
      },
    });

    broadcastRef.current = broadcast;
    broadcast.open = true;

    return () => {
      broadcast.destroy();
      broadcastRef.current = null;
    };
  }, []);

  return (
    <div>
      <h2>Broadcast 云广播</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => broadcastRef.current && (broadcastRef.current.open = true)}>打开</button>{" "}
        <button onClick={() => broadcastRef.current?.close()}>关闭</button>{" "}
        <button onClick={() => broadcastRef.current?.loadVoiceList()}>重新加载语音列表</button>
        <span style={{ marginLeft: 12 }}>语音数量：{voiceCount}</span>
      </div>
      <div ref={containerRef} style={{ width: 400, height: 500, position: "relative", background: "#000" }} />
    </div>
  );
}
