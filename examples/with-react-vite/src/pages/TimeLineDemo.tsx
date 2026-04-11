import React, { useEffect, useRef } from "react";
import { TimeLine, MobileTimeLine } from "@ezuikit/control-time-line";

export default function TimeLineDemo() {
  const pcRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeLine: TimeLine | null = null;
    let mobileTimeLine: MobileTimeLine | null = null;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
    const timeSections = [
      { startTime: todayStart.getTime(), endTime: todayEnd.getTime(), coverPic: "" },
    ];

    if (pcRef.current) {
      timeLine = new TimeLine(pcRef.current, {
        current: now,
        language: "zh",
        timeSections,
        width: 800,
        height: 60,
        onChange: (time) => {
          console.log("TimeLine onChange:", time);
        },
      });
    }

    if (mobileRef.current) {
      mobileTimeLine = new MobileTimeLine(mobileRef.current, {
        current: now,
        language: "zh",
        timeSections,
        height: 200,
        showTimeWidthBtn: true,
        onChange: (time) => {
          console.log("MobileTimeLine onChange:", time);
        },
      });
    }

    return () => {
      timeLine?.destroy();
      mobileTimeLine?.destroy();
    };
  }, []);

  return (
    <div>
      <h2>TimeLine 时间轴</h2>
      <section>
        <h3>PC 时间轴</h3>
        <div ref={pcRef} />
      </section>
      <section style={{ marginTop: 24 }}>
        <h3>移动端时间轴</h3>
        <div ref={mobileRef} style={{ width: 375 }} />
      </section>
    </div>
  );
}
