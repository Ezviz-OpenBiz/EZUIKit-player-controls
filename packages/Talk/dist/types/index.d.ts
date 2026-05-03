declare class EventEmitter {
    events: {};
    /**
     * 注册监听器
     * @param {string} type - 事件类型
     * @param {function} listener - 事件处理函数
     */
    on(type: string, listener: Function): void;
    /**
     * 触发事件
     * @param {string} type - 事件类型
     * @param {*} arg - 传递给处理函数的参数
     */
    emit(type: string, arg: any): void;
    /**
     * 注销监听器
     * @param {string} type - 事件类型
     * @param {function} listener - 要注销的监听器处理函数
     */
    off(type: string, listener: Function): void;
    /**
     * 一次性监听器
     * @param {string} type - 事件类型
     * @param {function} listener - 事件处理函数
     */
    once(type: string, listener: Function): void;
    /**
     * 移除所有监听器
     */
    removeAllListener(): void;
}

/**
 * Talk 对讲功能类
 */
interface TalkOptions {
    /**
     * 设备序列号
     */
    deviceSerial: string;
    /**
     * 通道号， 默认1
     */
    channelNo: string | number;
    /**
     * 访问令牌， 如果和 token 一起， 优先使用小权限token
     */
    accessToken: string;
    /**
     * 优先使用小权限token
     *
     * 如果使用小权限token, 最少需要传token.deviceToken.global、token.deviceToken.video和token.streamToken.talk
     *
     * 私有流小权限 {@link https://open.ys7.com/help/4293}
     */
    token?: {
        deviceToken: {
            global: string;
            video: string;
        };
        streamToken: {
            talk: string;
        };
    };
    env?: {
        domain: string;
    };
    capacity?: {
        support_talk: string | null;
        support_switch_talkmode: string | null;
    };
}
declare global {
    interface Window {
        tts?: any;
        stopTalk: () => void;
        startTalk: (options: any) => void;
        Janus_Talk: any;
    }
}
declare class Talk {
    static VERSION: string;
    options: TalkOptions;
    gainNode: GainNode | null;
    volumeGain: any;
    volumeChangeInterval: number | null;
    microphoneId: any;
    audioLeft: HTMLDivElement;
    audioRight: HTMLDivElement;
    eventEmitter: EventEmitter;
    talkOptions: any;
    ttsTalk: any;
    isTalking: boolean;
    constructor(options?: Partial<TalkOptions>);
    destroy: () => void;
    startTalk: (callback?: ((isGb: boolean) => void) | undefined) => void;
    stopTalk: () => void;
    /**
     * @param options 更新配置项
     */
    updateOptions(options: any): void;
    changeTalkChannelNo: (channelNo: number) => void;
    _customizeStream: (stream: MediaStream) => Promise<unknown>;
    setVolumeGain: (volume: number) => {
        code: number;
        msg: string;
        res: null;
    };
    observeVolumeChange: (options?: any) => void;
    getMicrophonePermission: () => Promise<unknown>;
    getMicrophonesList: () => Promise<unknown>;
    setProfile: (options: any) => void;
}

export { Talk as default };
export type { TalkOptions };
