interface BasePtzOptions {
    language?: 'zh' | 'en';
    env?: {
        domain: string;
    };
    /** 不再减容 ptzSpeed, 请配置 ptzOptions.speed */
    speed?: 1 | 2 | 3;
    accessToken?: string;
    token?: {
        deviceToken: {
            video?: string;
        };
    };
    deviceSerial?: string;
    channelNo?: number | string;
    locales?: Record<string, Record<string, string>>;
    onDirection?: (info: Record<string, any>) => (result?: any) => void;
    onSpeedChange?: (speed: number) => void;
}
/**
 * 按压结束原因
 * - up: 正常抬起（任意位置）
 * - cancel: pointercancel / touchcancel（系统手势、来电等）
 * - leave: 按住时移出控件
 * - lost: 指针捕获丢失
 * - blur: 窗口失焦
 * - hidden: 页面隐藏（切 tab、锁屏）
 * - destroy: 按住时被销毁
 */
type PtzPressEndReason = 'up' | 'cancel' | 'leave' | 'lost' | 'blur' | 'hidden' | 'destroy';
/** 按下时由子类给出的命令参数。stop 原样复用，保证与 start 的方向、速度、设备一致 */
interface PtzPressStart {
    direction: number;
    speed: number;
    /** 透传给 onDirection 的信息（不含 type） */
    info: Record<string, any>;
    /** 子类自用标记，区分按压来源（如方向盘 / 变焦按钮） */
    tag?: string;
}
interface PtzPressHandlers {
    /** 按下时调用，返回 null 表示忽略本次按下 */
    onStart: (clientX: number, clientY: number) => PtzPressStart | null;
    /** 按压结束（无论何种原因）时调用，用于复原 UI */
    onEnd?: (reason: PtzPressEndReason) => void;
}
/** 一条待发送的云台命令。设备参数在按下时快照，按住期间 updateOptions 不会让 stop 发错设备 */
interface PtzCommand extends PtzPressStart {
    pressId: number;
    type: 'start' | 'stop';
    domain: string;
    deviceSerial: string;
    channelNo: string;
    token: string;
    resultCb: ((result?: any) => void) | null;
}
declare class BasePtz<T extends BasePtzOptions> {
    $container: HTMLElement;
    options: T;
    locale: Record<string, string>;
    speed: 1 | 3 | 7;
    protected _destroyed: boolean;
    /** 控件自身的事件解绑函数，destroy 时统一执行 */
    private _unbinds;
    private _press;
    private _pressSeq;
    /** 尚未发出的命令，严格按顺序串行发送 */
    private _queue;
    private _inflight;
    private _draining;
    constructor(container: HTMLElement, options?: BasePtzOptions);
    updateOptions(options: Pick<BasePtzOptions, 'accessToken' | 'channelNo' | 'deviceSerial' | 'token' | 'env'>): void;
    /**
     * 销毁（可重复调用）
     * - 按住中会补发 stop
     * - 未发出的 start 直接丢弃；已发出 start 对应的 stop 仍会发送（含失败重试、迟到补发），保证设备停下
     * - 销毁后不再回调 onDirection / onSpeedChange，也不再操作 DOM
     */
    destroy(): void;
    /** 当前按压 id，没有按压时为 null */
    protected get _activePressId(): number | null;
    /** 绑定事件并登记解绑，destroy 时自动移除 */
    protected _listen(target: EventTarget, type: string, fn: (e: any) => void, opts?: AddEventListenerOptions): void;
    /**
     * 为「按住发 start、松开发 stop」的元素绑定事件
     * 保证每个 start 都有且只有一个 stop：在任意位置抬起、移出元素、pointercancel、
     * 失去指针捕获、窗口失焦、页面隐藏、destroy 都会结束按压并发 stop
     */
    protected _bindPress(el: HTMLElement, handlers: PtzPressHandlers): void;
    /** 子类处理接口返回（仅在未销毁时调用），如错误码高亮 */
    protected _onCommandResult(_cmd: PtzCommand, _result: any): void;
    private _beginPress;
    /** 按压期间在 window 上临时监听结束信号，按压结束即移除 */
    private _watchPress;
    /** 坐标是否仍落在元素上（基于真实命中测试，圆角区域外也算移出） */
    private _hitTest;
    private _endPress;
    private _dispatch;
    /** 网络卡顿时限制积压：成对丢弃最早的、start 与 stop 都还没发出的按压 */
    private _trimQueue;
    private _drain;
    /**
     * 发送 start，等它返回后才放行后面的 stop，保证 stop 不会先于 start 到达。
     *
     * 超过 PTZ_REQUEST_TIMEOUT 仍未返回时先放行 stop，避免设备一直转；但不中止 start，
     * 因为客户端中止不代表服务端没执行。start 之后真正成功时，如果没有其他 stop 会在它之后发出，
     * 就再补发一次 stop，保证最后一次成功的 stop 在 start 成功之后。
     */
    private _sendStart;
    /** 迟到成功的 start 是否需要补发 stop：同一设备上既没有进行中的按压，也没有排队未发的 stop */
    private _needsCompensation;
    /**
     * 发送 stop。只有网络层失败（请求异常、超时、HTTP 5xx）才重试，最多 PTZ_STOP_RETRY 次，间隔递增。
     * 接口返回了业务错误码（如 60000 设备不支持、10002 token 失效）时重试也不会成功，直接结束
     */
    private _sendStop;
    /** 发一次请求，永不抛错 */
    private _request;
    /** 命令最终结果：回调子类与宿主（销毁后不回调） */
    private _finish;
}

declare class MobilePtz extends BasePtz<BasePtzOptions> {
    $content: HTMLElement;
    private _$wrap;
    private _$icons;
    constructor(container: HTMLElement, options: BasePtzOptions);
    /** 销毁（可重复调用） */
    destroy(): void;
    _render(): void;
    protected _onCommandResult(cmd: PtzCommand, rt: any): void;
    private _onStart;
    private _resetUI;
    private _setIconActive;
}

/**
 * @class Ptz
 * @classdesc 云台控制
 *
 * @example
 * const ptz = new Ptz(container, { accessToken, deviceSerial, channelNo })
 * // 销毁
 * ptz.destroy()
 */
declare class Ptz extends BasePtz<BasePtzOptions> {
    pluginStatus: any;
    private _$wrapper;
    private _$directionCircleContainer;
    private _$speedContainer;
    private _$btnContainer;
    private _isRotate;
    /** 错误高亮的延时复原定时器（只保留一个） */
    private _clearTimer;
    constructor(container: HTMLElement, options?: Partial<BasePtzOptions>);
    get isRotate(): boolean;
    /**
     * 是否旋转了
     */
    set isRotate(isRotate: boolean);
    destroy(): void;
    protected _onCommandResult(cmd: PtzCommand, rt: any): void;
    private _onDirectionStart;
    /** backDeg 为 null 时清除高亮。只改 backgroundImage，不覆盖其他内联样式（如 touch-action） */
    private _paintDirection;
    private _onSwitchSpeed;
}

export { BasePtz, MobilePtz, Ptz };
export type { BasePtzOptions };
