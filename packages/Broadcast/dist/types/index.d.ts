import { LoggerCls } from '@ezuikit/utils-logger';
import Drawer from '@ezuikit/control-drawer';

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
    /** 日志实例（由 Broadcast 传入，上下文 Broadcast），缺省时内部创建 */
    logger?: LoggerCls;
}
/**
 * 查询语音列表的请求参数（`onRequestQueryVoiceList` 的参数）
 */
interface QueryVoiceListRequest {
    /** 设备序列号 */
    deviceSerial: string;
    /** 通道号 */
    channelNo?: string | number;
    /** 分页大小，固定为 50 */
    pageSize: number;
}
/**
 * 下发默认语音的请求参数（`onRequestSendVoice` 的参数）
 */
interface SendVoiceRequest {
    /** 语音文件 URL（来自语音列表项的 `fileUrl`） */
    fileUrl: string;
    /** 设备序列号 */
    deviceSerial: string;
    /** 通道号 */
    channelNo?: string | number;
}
/**
 * 下发临时语音的请求参数（`onVoiceRecorded` / `onRequestSendVoiceOnce` 的参数）
 */
interface SendVoiceOnceRequest {
    /** 录制的语音（16kHz 单声道 WAV） */
    voiceFile: Blob;
    /** 设备序列号 */
    deviceSerial: string;
    /** 通道号 */
    channelNo?: string | number;
}
/**
 * 错误信息（`onRecordError` / `onError` 的参数）
 */
interface BroadcastErrorInfo {
    /** 错误描述 */
    msg: string;
    /** 原始错误 */
    error: unknown;
}
/**
 * 宿主回调（替代 2.x 之前的事件）。均在构造时与 `updateOptions` 中配置，调用时读取最新值；
 * 回调抛出的异常会被捕获并通过 logger 打印，不会中断控件内部流程（例如录音结束后请求下发）。
 */
interface BroadcastCallbacks {
    /** 面板打开（`open = true`） */
    onOpen?: () => void;
    /** 面板关闭：关闭按钮、遮罩、Esc、`close()` / `open = false`，以及打开状态下的 `destroy()` */
    onClose?: () => void;
    /** 请求查询语音列表：宿主查询后调用 `updateVoiceList(list)` 回填，失败时调用 `showError(msg)` */
    onRequestQueryVoiceList?: (params: QueryVoiceListRequest) => void;
    /** 请求下发默认语音（点击语音项）：宿主下发后调用 `showSuccess(msg)` 或 `showError(msg)` */
    onRequestSendVoice?: (data: SendVoiceRequest) => void;
    /** 请求下发临时语音（录音结束）：宿主下发后调用 `showSuccess(msg)` 或 `showError(msg)` */
    onRequestSendVoiceOnce?: (data: SendVoiceOnceRequest) => void;
    /** 录到有效语音，参数与 `onRequestSendVoiceOnce` 相同，紧挨着在它之前调用 */
    onVoiceRecorded?: (data: SendVoiceOnceRequest) => void;
    /** 开始录音 */
    onRecordStart?: () => void;
    /** 停止录音并得到有效录音（随后请求下发）；关闭面板取消录音时不触发 */
    onRecordStop?: () => void;
    /** 录音完成：正常停止，或达到最长时长自动停止并暂存时；参数为 WAV 录音 */
    onRecordComplete?: (voiceFile: Blob) => void;
    /** 录音出错：开始失败、时长不足等 */
    onRecordError?: (info: BroadcastErrorInfo) => void;
    /** 其它错误，如麦克风权限请求失败 */
    onError?: (info: BroadcastErrorInfo) => void;
}
/**
 * 云广播配置选项
 */
interface BroadcastOptions extends BroadcastCallbacks {
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
    /**
     * 容器，支持传入字符串ID或HTMLElement节点；面板挂载在容器内（PC 与移动端一致），非 body 容器需为定位元素。
     * 缺省为 document.body（面板相对视口铺满）
     */
    container?: string | HTMLElement;
    /** 展开方向 */
    direction?: 'top' | 'bottom' | 'left' | 'right';
    /** 初始语音列表 */
    voiceList?: VoiceItem[];
    /** 是否移动端：按住说话、松开结束（PC 端为点击切换），不影响挂载位置 */
    isMobile?: boolean;
    /** EZUIKitPlayer 实例引用（用于获取全屏状态） */
    player?: any;
    /**
     * 日志实例（`@ezuikit/utils-logger`），缺省时内部创建。
     * 日志以控件名 `Broadcast` 为上下文（`logger.context('Broadcast')`），仅在构造时读取。
     */
    logger?: LoggerCls;
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
    /** 日志实例（上下文 Broadcast） */
    private readonly logger;
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
 * 云广播 UI（抽象基类，由 `Broadcast` 继承）。
 *
 * 继承 {@link Drawer}（`@ezuikit/control-drawer`）复用其抽屉骨架（遮罩、面板、标题栏、
 * 开合动画、挂载与滚动锁定），本类只负责抽屉内的广播内容：Tab、语音列表、加载/空/错误状态、
 * 底部录音按钮、轻提示与录音提示（`@ezuikit/control-message`），以及录音交互。
 * 录音、取消与下发的业务逻辑由子类实现 {@link BroadcastUI.startRecord} 等抽象方法接入；
 * 抽屉开合统一经 {@link BroadcastUI.handleOpenChange}，子类可覆盖以追加逻辑。
 */
declare abstract class BroadcastUI extends Drawer {
    /** 广播配置（区别于继承自 Drawer 的 `options`） */
    broadcastOptions: BroadcastOptions;
    /** 语音列表 */
    voiceList: VoiceItem[];
    /** 日志实例（上下文 Broadcast） */
    protected readonly logger: LoggerCls;
    /** 是否移动端（构造时确定交互方式：移动端按住说话，PC 端点击切换） */
    private readonly isMobile;
    private voiceListElement;
    private loadingElement;
    private emptyElement;
    private errorElement;
    private tipElement;
    private talkButton;
    private isRecording;
    private isStarting;
    private lastTouchTime;
    private pendingStop;
    private pendingCancel;
    private tipTimer;
    /** 录音提示：挂在内容区上的 Message 实例，根节点带 `${PREFIX}-recording` 类名，样式按它限定 */
    private recordingMessage;
    /** 当前录音提示的消息 id，未展示时为 null */
    private recordingMessageId;
    /** 当前录音提示里的波形柱（实例内引用，不使用全局 id） */
    private waveBars;
    /** 当前录音提示里的倒计时文案 */
    private recordingHint;
    /** 波形动画定时器 */
    private waveTimer;
    /** 倒计时定时器 */
    private countdownTimer;
    /** 倒计时剩余秒数 */
    private remainingTime;
    /**
     * @param container 挂载容器，支持元素 ID 或 HTMLElement；PC 与移动端一致，非 body 容器需为定位元素
     * @param options 广播配置
     */
    constructor(container: HTMLElement | string, options: BroadcastOptions);
    /** 开始录音（子类实现）；抛出的错误会以轻提示展示并恢复按钮状态 */
    protected abstract startRecord(): Promise<void>;
    /** 停止录音并下发（子类实现）；抛出的错误会以轻提示展示 */
    protected abstract stopRecord(): Promise<void>;
    /** 取消录音（子类实现）：停止采集并丢弃录音，不下发；关闭面板时调用 */
    protected abstract cancelRecord(): void;
    /**
     * 下发默认语音（子类实现），点击语音项时调用
     * @param fileUrl 语音文件 URL
     */
    protected abstract sendVoice(fileUrl: string): void;
    /**
     * 由 direction 映射为 Drawer 的 placement（非法值回退 right）
     */
    private static resolvePlacement;
    /**
     * 构建注入到抽屉 body 内的广播内容
     */
    private static buildContent;
    /**
     * 构建录音提示内容：波形（9 根柱子）+ 倒计时文案。
     * 元素引用由调用方在实例内保存，不使用全局 id，同页多个实例互不影响。
     */
    private static buildRecordingContent;
    /**
     * 抽屉开 / 合：`open = x`、`close()` 与遮罩 / 关闭按钮 / Esc 都会触发（状态未变化时不触发）。
     * 关闭时取消进行中的录音（不下发）。子类覆盖时需调用 `super.handleOpenChange(open)`。
     * @param open 是否打开
     */
    protected handleOpenChange(open: boolean): void;
    /**
     * 取消录音（关闭面板时）：收起录音提示、恢复按钮，并由子类丢弃录音；
     * 仍在等待麦克风启动时，启动完成后再取消（见 handleRecordStart）。
     */
    private cancelRecording;
    /**
     * 绑定内容区事件
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
     * 切换录音按钮的录音中状态与文案
     * @param recording 是否录音中
     */
    private setTalkButtonRecording;
    /**
     * 展示录音提示（波形 + 倒计时）：duration 0 不自动关闭，录音结束时由 hideRecordingMessage 关闭
     */
    private showRecordingMessage;
    /**
     * 关闭录音提示，并停止波形动画与倒计时
     */
    private hideRecordingMessage;
    /**
     * 波形动画：每 100ms 按正弦波更新各柱子的高度（保持垂直居中）
     */
    private startWaveAnimation;
    /**
     * 停止波形动画
     */
    private stopWaveAnimation;
    /**
     * 倒计时：每秒刷新剩余时长，归零后提示结束录音的方式
     */
    private startCountdown;
    /**
     * 停止倒计时
     */
    private stopCountdown;
    /**
     * 刷新录音提示文案：剩余时长；归零后按设备类型提示松开 / 再次点击结束
     */
    private updateRecordingHint;
    /**
     * 关闭面板（等价于 `open = false`），效果与关闭按钮、遮罩点击、Esc 一致
     */
    close(): void;
    /**
     * 更新语音列表（宿主查询到语音列表后调用），非数组按空列表处理
     * @param voiceList 语音列表
     */
    updateVoiceList(voiceList: VoiceItem[]): void;
    /**
     * 渲染语音列表
     */
    private renderVoiceList;
    /**
     * 转义将要插入 HTML 的服务端文本
     */
    private static escape;
    /**
     * 选中语音
     */
    private selectVoice;
    /**
     * 设置录音状态
     */
    setRecordingState(isRecording: boolean): void;
    /**
     * 加载态：展示时隐藏列表与空/错误态；关闭时恢复列表显示
     * @param loading 是否加载中
     */
    setLoading(loading: boolean): void;
    /**
     * 错误态：传空串清除
     * @param message 错误文案
     */
    setError(message: string): void;
    /**
     * 显示成功消息（底部轻提示，2 秒自动消失）
     */
    showSuccess(message: string): void;
    /**
     * 显示错误消息（底部轻提示，2 秒自动消失）
     */
    showError(message: string): void;
    /**
     * 底部轻提示
     * @param message 文案
     * @param isError 是否错误样式
     */
    private showTip;
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
 * 云广播喊话控制类。
 *
 * 继承 {@link BroadcastUI}（进而继承 `@ezuikit/control-drawer`），复用其抽屉骨架与广播内容；本类负责录音与下发流程，
 * 并通过配置中的回调（{@link BroadcastCallbacks}）与宿主通信：控件发出请求回调（`onRequestQueryVoiceList` /
 * `onRequestSendVoice` / `onRequestSendVoiceOnce`），宿主调用实际接口后用 `updateVoiceList(list)` /
 * `showSuccess(msg)` / `showError(msg)` 回填结果。
 * 面板开合使用继承自 Drawer 的 `open` 访问器（`broadcast.open = true`），`close()` 等价于 `open = false`。
 */
declare class Broadcast extends BroadcastUI {
    /** 版本号 */
    static VERSION: string;
    /** 语音录制器 */
    voiceRecorder: VoiceRecorder | null;
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
     * 调用宿主回调（每次读取最新配置）。回调抛出的异常只通过 logger 打印，不中断控件内部流程。
     * @param name 回调名
     * @param args 回调参数
     */
    private invoke;
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
     * 面板开 / 合（覆盖 BroadcastUI）：打开时无语音列表则请求加载并触发 `onOpen`；
     * 关闭时（BroadcastUI 已取消进行中的录音）触发 `onClose`。
     * @param open 是否打开
     */
    protected handleOpenChange(open: boolean): void;
    /**
     * 加载语音列表
     * 通过 `onRequestQueryVoiceList` 请求宿主查询（如 player.queryVoiceList()），宿主用 `updateVoiceList(list)` 回填
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
     * 停止录音，得到有效录音后请求下发临时语音
     */
    stopRecord(): Promise<void>;
    /**
     * 取消录音（关闭面板时由 BroadcastUI 调用）：清除最大时长定时器，停止采集并丢弃录音与暂存数据，不下发
     */
    protected cancelRecord(): void;
    /**
     * 清除最大时长定时器
     */
    private clearMaxDurationTimer;
    /**
     * 下发临时语音
     * 先触发 `onVoiceRecorded`，再通过 `onRequestSendVoiceOnce` 请求宿主下发（如 player.sendVoiceOnce()）
     * @param voiceFile 语音文件
     */
    sendVoiceOnce(voiceFile: Blob): void;
    /**
     * 下发默认语音
     * 通过 `onRequestSendVoice` 请求宿主下发（如 player.sendVoice()）
     * @param fileUrl 语音文件URL
     */
    sendVoice(fileUrl: string): void;
    /**
     * 更新配置：合并到 `broadcastOptions`，回调在下次触发时读取新值；
     * 容器、方向、语言、移动端等界面相关配置只在构造时生效。
     * @param options 新的配置选项
     */
    updateOptions(options: Partial<BroadcastOptions>): void;
    /**
     * 销毁实例
     */
    destroy(): void;
}

export { Broadcast as default };
export type { BroadcastCallbacks, BroadcastErrorInfo, BroadcastOptions, QueryVoiceListRequest, SendVoiceOnceRequest, SendVoiceRequest, VoiceItem };
