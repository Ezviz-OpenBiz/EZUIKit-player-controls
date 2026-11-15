import React, { useEffect, useRef } from "react";
import Broadcast from "@ezuikit/control-broadcast";
import "@ezuikit/control-broadcast/dist/style/style.css";

// 模拟宿主接口（实际项目中替换为 player.queryVoiceList / sendVoice / sendVoiceOnce）
const mockVoiceList = [
  { voiceName: "欢迎光临", fileUrl: "https://example.com/welcome.wav", duration: 3 },
  { voiceName: "请勿靠近", fileUrl: "https://example.com/warning.wav", duration: 5 },
];
const mockRequest = <T,>(data?: T) => new Promise<T | undefined>((resolve) => setTimeout(() => resolve(data), 500));

export default function BroadcastDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const broadcastRef = useRef<Broadcast | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 第一个参数是挂载容器，容器需为定位元素
    const broadcast = new Broadcast(containerRef.current, {
      deviceSerial: "your-device-serial",
      channelNo: 1,
      accessToken: "your-access-token",
      language: "zh",
      direction: "bottom",
      onOpen: () => console.log("Broadcast: 面板已打开"),
      onClose: () => console.log("Broadcast: 面板已关闭"),
      onRecordComplete: (voiceFile) => console.log("Broadcast: 录音完成", voiceFile.size),
      onRecordError: ({ msg }) => console.log("Broadcast: 录音错误", msg),
      // 查询语音列表：打开面板时没有语音列表，或调用 loadVoiceList() 时触发
      onRequestQueryVoiceList: async (params) => {
        console.log("Broadcast: 请求语音列表", params);
        try {
          const list = await mockRequest(mockVoiceList);
          broadcast.updateVoiceList(list ?? []);
        } catch (error: any) {
          broadcast.showError(error?.message || "语音列表加载失败");
        }
      },
      // 下发默认语音：点击语音项时触发
      onRequestSendVoice: async ({ fileUrl, channelNo }) => {
        console.log("Broadcast: 下发语音", fileUrl, channelNo);
        try {
          await mockRequest();
          broadcast.showSuccess("语音下发成功");
        } catch (error: any) {
          broadcast.showError(error?.message || "语音下发失败");
        }
      },
      // 下发临时语音：录音结束、得到有效录音时触发
      onRequestSendVoiceOnce: async ({ voiceFile, channelNo }) => {
        console.log("Broadcast: 下发临时语音", voiceFile, channelNo);
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
        <button onClick={() => broadcastRef.current?.close()}>关闭</button>
      </div>
      <div ref={containerRef} style={{ width: 400, height: 500, position: "relative", background: "#000" }} />
    </div>
  );
}
