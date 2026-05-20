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
    setDate(date: Date): void;
    updateOptions(options: Partial<AlarmMessageOptions>): void;
    on(event: string, callback: (data: any) => void): void;
    off(event: string, callback: (data: any) => void): void;
    destroy(): void;
}

/**
 * 告警类型编码 → 名称映射表
 * 基于告警消息类型表.md
 */
declare const ALARM_TYPE_MAP: Record<number, string>;
declare function getAlarmTypeName(alarmType: number): string;

export { ALARM_TYPE_MAP, AlarmMessage as default, getAlarmTypeName };
export type { AlarmItem, AlarmListUpdateData, AlarmMessageOptions };
