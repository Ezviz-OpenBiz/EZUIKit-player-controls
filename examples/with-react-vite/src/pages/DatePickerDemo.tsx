import '@ezuikit/control-date-picker/dist/style';
import React, { useEffect, useRef } from "react";
import * as DatePicker from '@ezuikit/control-date-picker';


console.log("DatePicker", DatePicker)

export default function DatePickerDemo() {
  const pickerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // let datePicker: DatePicker | null = null;

    // if (pickerRef.current) {
    //   datePicker = new DatePicker(pickerRef.current, {
    //     language: "zh",
    //     current: new Date(),
    //     onChange: (date, mode) => {
    //       console.log("DatePicker onChange:", date, mode);
    //     },
    //     onCell: (date, mode) => {
    //       console.log("DatePicker onCell:", date, mode);
    //     },
    //   });
    // }

    return () => {
      // datePicker?.destroy();
    };
  }, []);

  return (
    <div>
      <h2>DatePicker 日期选择器</h2>
      <section>
        <h3>DatePicker</h3>
        <div ref={pickerRef} style={{ width: 300 }} />
      </section>
    </div>
  );
}
