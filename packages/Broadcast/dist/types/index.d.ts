/**
 * @description 事件发射器
 * @author Ezviz-OpenBiz
 * @since 2026-01-13
 */
type EventCallback = (...args: any[]) => void;
declare class EventEmitter {
    private events;
    constructor();
    /**
     * 监听事件
     * @param event 事件名称
     * @param callback 回调函数
     */
    on(event: string, callback: EventCallback): void;
    /**
     * 移除事件监听
     * @param event 事件名称
     * @param callback 回调函数
     */
    off(event: string, callback: EventCallback): void;
    /**
     * 触发事件
     * @param event 事件名称
     * @param args 参数
     */
    emit(event: string, ...args: any[]): void;
    /**
     * 监听一次事件
     * @param event 事件名称
     * @param callback 回调函数
     */
    once(event: string, callback: EventCallback): void;
    /**
     * 移除所有事件监听
     */
    removeAllListeners(): void;
    /**
     * 获取事件监听器数量
     * @param event 事件名称
     */
    listenerCount(event: string): number;
}

/**
 * @description 类型定义
 * @author Ezviz-OpenBiz
 * @since 2026-01-13
 */
/**
 * 语音列表项
 */
interface VoiceItem {
    /** 语音名称 */
    voiceName: string;
    /** 语音文件下载地址，有效期1天 */
    fileUrl: string;
    /** 语音文件时长，单位秒 */
    duration: number;
}
/**
 * 录音器配置
 */
interface RecorderOptions {
    /** 最短录音时长（秒），默认3 */
    minDuration?: number;
    /** 最长录音时长（秒），默认60 */
    maxDuration?: number;
    /** 采样率，默认16000 */
    sampleRate?: number;
    /** 声道数，默认1 */
    channelCount?: number;
}

/**
 * @description 语音录制器（WAV格式）
 * @author Ezviz-OpenBiz
 * @since 2026-01-13
 */

/**
 * 语音录制器类
 * 使用 Web Audio API 录制原始音频数据，然后转换为 WAV 格式
 * iOS Safari 使用 MediaRecorder API 以提高兼容性
 */
declare class VoiceRecorder {
    private options;
    private audioContext;
    private mediaStreamSource;
    private scriptProcessor;
    private stream;
    private startTime;
    private maxTimer;
    private audioBuffers;
    private isRecordingFlag;
    private isIOSDevice;
    private mediaRecorder;
    private recordedChunks;
    constructor(options?: RecorderOptions);
    /**
     * 开始录音
     */
    start(): Promise<void>;
    /**
     * 使用 MediaRecorder API 开始录音（iOS Safari）
     */
    private startWithMediaRecorder;
    /**
     * 使用 ScriptProcessor 开始录音（所有平台）
     */
    private startWithScriptProcessor;
    /**
     * 停止录音
     */
    stop(): Promise<Blob>;
    /**
     * 使用 MediaRecorder 停止录音（iOS Safari）
     */
    private stopWithMediaRecorder;
    /**
     * 使用 ScriptProcessor 停止录音（非 iOS）
     */
    private stopWithScriptProcessor;
    /**
     * 将 Float32Array 编码为 WAV 格式
     */
    private encodeWAV;
    /**
     * 清理资源
     */
    private cleanup;
    /**
     * 销毁录音器
     */
    destroy(): void;
    /**
     * 获取录音时长
     */
    getDuration(): number;
    /**
     * 是否正在录音
     */
    isRecording(): boolean;
}

/**
 * @description 云广播UI控制器
 * @author Ezviz-OpenBiz
 * @since 2026-01-13
 */

/**
 * UI配置选项
 */
interface BroadcastUIOptions {
    /** 语言 */
    language: 'zh' | 'en';
    /** 展开方向：top-从上往下, bottom-从下往上, left-从左往右, right-从右往左 */
    direction?: 'top' | 'bottom' | 'left' | 'right';
    /** 初始语音列表 */
    voiceList?: VoiceItem[];
    /** 是否移动端 */
    isMobile?: boolean;
    /** EZUIKitPlayer 实例引用（用于获取全屏状态） */
    player?: any;
    /** 关闭回调 */
    onClose: () => void;
    /** 开始录音回调 */
    onRecordStart: () => void;
    /** 停止录音回调 */
    onRecordStop: () => void;
    /** 下发语音回调 */
    onVoiceSend: (fileUrl: string) => void;
    /** 下发临时语音回调 */
    onVoiceSendOnce: (blob: Blob) => void;
}
/**
 * 云广播UI控制器类
 */
declare class BroadcastUI {
    private options;
    private container;
    private modalElement;
    private voiceListElement;
    private talkButton;
    private isRecording;
    private voiceList;
    private recordingToast;
    private isStarting;
    private lastTouchTime;
    private pendingStop;
    private orientationChangeHandler;
    /**
     *
     * @param container
     * @param options
     */
    constructor(container: HTMLElement | string, options: BroadcastUIOptions);
    /**
     * 设置屏幕方向变化监听器（移动端）
     */
    private setupOrientationListener;
    /**
     * 移除屏幕方向变化监听器
     */
    private removeOrientationListener;
    /**
     * 创建UI
     */
    private createUI;
    /**
     * 将模态框定位到 container 下方（移动端）
     */
    private positionModalBelowContainer;
    /**
     * 获取模态框HTML
     */
    private getModalHTML;
    /**
     * 注入样式
     */
    private injectStyles;
    /**
     * 绑定事件
     */
    private bindEvents;
    /**
     * 处理录音状态切换（PC端）
     */
    private handleRecordToggle;
    /**
     * 处理开始录音
     */
    private handleRecordStart;
    /**
     * 处理停止录音
     */
    private handleRecordStop;
    /**
     * 显示UI
     */
    show(): void;
    /**
     * 隐藏UI
     */
    hide(): void;
    /**
     * 关闭弹窗（供上层调用）
     * 效果与内部关闭按钮、遮罩点击一致
     */
    close(): void;
    /**
     * 更新语音列表
     */
    updateVoiceList(voiceList: VoiceItem[]): void;
    /**
     * 渲染语音列表
     */
    private renderVoiceList;
    /**
     * 选中语音
     */
    private selectVoice;
    /**
     * 设置录音状态
     */
    setRecordingState(isRecording: boolean): void;
    /**
     * 显示成功消息
     */
    showSuccess(message: string): void;
    /**
     * 显示错误消息
     */
    showError(message: string): void;
    /**
     * 销毁UI
     */
    destroy(): void;
}

/**
 * @description 云广播喊话控制模块
 * @author Ezviz-OpenBiz
 * @since 2026-01-13
 */

/**
 * 云广播配置选项
 */
interface BroadcastOptions {
    /** 设备序列号 */
    deviceSerial: string;
    /** 通道号，默认为1 */
    channelNo?: string | number;
    /** 访问令牌，如果和 token 一起，优先使用小权限token */
    accessToken?: string;
    /**
     * 优先使用小权限token
     * 如果使用小权限token, 最少需要传token.deviceToken.global、token.deviceToken.video
     */
    token?: {
        deviceToken: {
            global: string;
            video: string;
        };
    };
    /** 环境配置 */
    env?: {
        domain: string;
    };
    /** 设备能力集 */
    capacity?: {
        /** 对讲能力：1或3表示支持云广播 */
        support_talk?: string | number | null;
    };
    /** 语言，默认zh */
    language?: 'zh' | 'en';
    /** 容器，支持传入字符串ID或HTMLElement节点 */
    container?: string | HTMLElement;
    /** 展开方向 */
    direction?: 'top' | 'bottom' | 'left' | 'right';
    /** 初始语音列表 */
    voiceList?: VoiceItem[];
    /** 是否移动端 */
    isMobile?: boolean;
    /** EZUIKitPlayer 实例引用（用于获取全屏状态） */
    player?: any;
}
/**
 * 云广播喊话控制类
 */
declare class Broadcast {
    /** 版本号 */
    static VERSION: string;
    /** 事件常量 */
    static EVENTS: {
        /** 打开云广播界面 */
        open: string;
        /** 关闭云广播界面 */
        close: string;
        /** 请求查询语音列表 */
        requestQueryVoiceList: string;
        /** 语音列表加载完成 */
        voiceListLoaded: string;
        /** 语音列表加载失败 */
        voiceListError: string;
        /** 请求下发临时语音 */
        requestSendVoiceOnce: string;
        /** 请求下发默认语音 */
        requestSendVoice: string;
        /** 选中语音列表项 */
        voiceSelected: string;
        /** 录制语音完成 */
        voiceRecorded: string;
        /** 开始录音 */
        recordStart: string;
        /** 停止录音 */
        recordStop: string;
        /** 录音完成 */
        recordComplete: string;
        /** 录音错误 */
        recordError: string;
        /** 语音下发成功 */
        voiceSent: string;
        /** 语音下发失败 */
        voiceSendError: string;
        /** 错误事件 */
        error: string;
    };
    /** 配置选项 */
    options: BroadcastOptions;
    /** 事件发射器 */
    eventEmitter: EventEmitter;
    /** 语音录制器 */
    voiceRecorder: VoiceRecorder | null;
    /** UI控制器 */
    broadcastUI: BroadcastUI;
    /** 是否已打开 */
    isOpen: boolean;
    /** 语音列表 */
    voiceList: VoiceItem[];
    /** 最大时长定时器 */
    private maxDurationTimer;
    /** 暂存的录音数据（达到最大时长时） */
    private pendingAudioBlob;
    /**
     * 构造函数
     * @param options 配置选项
     */
    constructor(options: BroadcastOptions);
    /**
     * 初始化麦克风权限
     * 提前请求麦克风权限，避免首次录音时延迟
     */
    private initMicrophonePermission;
    /**
     * 请求麦克风权限（公开方法）
     * 可用于用户拒绝权限后重新请求
     */
    requestMicrophonePermission(): Promise<boolean>;
    /**
     * 设置事件监听
     * 监听上层返回的结果事件
     */
    private setupEventListeners;
    /**
     * 打开云广播界面
     */
    open(): void;
    /**
     * 关闭云广播界面
     */
    close(): void;
    /**
     * 加载语音列表
     * 触发请求事件，由上层调用实际接口
     */
    loadVoiceList(): void;
    /**
     * 开始录音
     */
    startRecord(): Promise<void>;
    /**
     * 停止录音并暂存（达到最大时长时调用）
     */
    private stopRecordAndCache;
    /**
     * 停止录音
     */
    stopRecord(): Promise<void>;
    /**
     * 下发临时语音
     * 触发请求事件，由上层调用实际接口
     * @param voiceFile 语音文件
     */
    sendVoiceOnce(voiceFile: Blob): void;
    /**
     * 下发默认语音
     * 触发请求事件，由上层调用实际接口
     * @param fileUrl 语音文件URL
     */
    sendVoice(fileUrl: string): void;
    /**
     * 更新配置
     * @param options 新的配置选项
     */
    updateOptions(options: Partial<BroadcastOptions>): void;
    /**
     * 监听事件
     * @param event 事件名称
     * @param callback 回调函数
     */
    on(event: string, callback: (data: any) => void): void;
    /**
     * 移除事件监听
     * @param event 事件名称
     * @param callback 回调函数
     */
    off(event: string, callback: (data: any) => void): void;
    /**
     * 销毁实例
     */
    destroy(): void;
}

export { Broadcast as default };
export type { BroadcastOptions };
