import React, { useEffect, useRef } from 'react';
import { Calendar, DatePicker } from '@ezuikit/control-date-picker';
import '@ezuikit/control-date-picker/dist/style';

export default function DatePickerDemo() {
  const calendarEleRef = useRef<HTMLDivElement>(null);
  const datePickerEleRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<Calendar | null>(null);
  const datePickerRef = useRef<DatePicker | null>(null);
  useEffect(() => {
    if (calendarEleRef.current) {
      console.log('DatePicker', Calendar, calendarEleRef.current);
      calendarRef.current = new Calendar(calendarEleRef.current, {
        language: 'zh',
        current: new Date(),
        onChange: (date, mode) => {
          console.log('DatePicker onChange:', date, mode);
        },
        onCell: (date, mode) => {
          console.log('DatePicker onCell:', date, mode);
        },
      });
    }
    if (datePickerEleRef.current) {
      console.log('DatePicker', DatePicker, datePickerEleRef.current);
      datePickerRef.current = new DatePicker(datePickerEleRef.current, {
        language: 'zh',
        current: new Date(),
        open: true,
        onChange: (date, mode) => {
          console.log('DatePicker onChange:', date, mode);
        },
        onCell: (date, mode) => {
          console.log('DatePicker onCell:', date, mode);
        },
      });
    }

    return () => {
      calendarRef.current?.destroy();
      datePickerRef.current?.destroy();
    };
  }, []);

  return (
    <div>
      <h2>DatePicker 日期选择器</h2>
      <section>
        <h3>Calendar</h3>
        <div ref={calendarEleRef} />
      </section>
      <section>
        <h3>DatePicker</h3>
        <button ref={datePickerEleRef}>选择日期</button>
      </section>
    </div>
  );
}
