import EventEmitter from 'eventemitter3';

interface AlarmItem {
    alarmId: string;
    alarmName: string;
    alarmType: number;
    alarmTime: number;
    channelNo: number;
    isEncrypt: number;
    isChecked: number;
    recState: number;
    preTime: number;
    delayTime: number;
    deviceSerial: string;
    alarmPicUrl: string;
    relationAlarms: any[];
    customerType: string | null;
    customerInfo: string | null;
    alarmTypeName?: string;
    alarmTimeStr?: string;
}
interface AlarmMessageOptions {
    container: string | HTMLElement;
    deviceSerial: string;
    channelNo: number | string;
    accessToken: string;
    language?: 'zh' | 'en';
    isMobile?: boolean;
    player?: any;
}
interface AlarmListUpdateData {
    list: AlarmItem[];
    page: {
        total: number;
        page: number;
        size: number;
    };
    hasMore: boolean;
    append?: boolean;
}

/**
 * 告警消息列表控制模块
 */
declare class AlarmMessage {
    private options;
    private alarmMessageUI;
    private isOpen;
    private container;
    eventEmitter: EventEmitter;
    constructor(options: AlarmMessageOptions);
    open(): void;
    close(): void;
    updateAlarmList(data: AlarmListUpdateData): void;
    setLoading(loading: boolean): void;
    setError(message: string): void;
    updateOptions(options: Partial<AlarmMessageOptions>): void;
    on(event: string, callback: (data: any) => void): void;
    off(event: string, callback: (data: any) => void): void;
    destroy(): void;
}

export { AlarmMessage as default };
export type { AlarmItem, AlarmListUpdateData, AlarmMessageOptions };
