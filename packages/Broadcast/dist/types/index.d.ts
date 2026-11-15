import * as _ezuikit_control_core from '@ezuikit/control-core';
import { ControlCoreOptions } from '@ezuikit/control-core';
import Drawer from '@ezuikit/control-drawer';

/**
 * @description 多语言：内置中文（zh）与英文（en）文案；I18n 的创建、追加、取文案由 `@ezuikit/control-core` 的 ControlCore 统一处理
 * @author Ezviz-OpenBiz
 * @since 2026-01-13
 *
 * 文案默认放在命名空间 `broadcast` 下（宿主可用 `options.prefixLocaleKey` 修改），以追加的方式写入 I18n 实例：
 * 宿主通过 `options.i18n` 传入的实例，或按 `options.language` 新建的实例；宿主的 `options.locales` 在内置文案之后追加。
 */

/**
 * 内置多语言字典（不带命名空间）：`{ zh: {...}, en: {...} }`。
 * 宿主可用相同结构的 `options.locales` 覆盖部分文案
 *
 * @example
 * ```ts
 * locales.zh.title; // '广播喊话'
 * ```
 */
declare const locales: {
    zh: {
        title: string;
        defaultVoice: string;
        pressToTalk: string;
        clickToTalk: string;
        sendVoice: string;
        recording: string;
        stopRecording: string;
        loading: string;
        noVoice: string;
        recordingRemaining: string;
        releaseToStop: string;
        clickToStop: string;
        voiceSentSuccess: string;
        recordComplete: string;
        voiceSendFailed: string;
        voiceListFailed: string;
        recordFailed: string;
        recordTooShort: string;
        micUnsupported: string;
        micInsecure: string;
        micPermissionDenied: string;
        micNotFound: string;
        micBusy: string;
        micOverconstrained: string;
        micUnknown: string;
    };
    en: {
        title: string;
        defaultVoice: string;
        pressToTalk: string;
        clickToTalk: string;
        sendVoice: string;
        recording: string;
        stopRecording: string;
        loading: string;
        noVoice: string;
        recordingRemaining: string;
        releaseToStop: string;
        clickToStop: string;
        voiceSentSuccess: string;
        recordComplete: string;
        voiceSendFailed: string;
        voiceListFailed: string;
        recordFailed: string;
        recordTooShort: string;
        micUnsupported: string;
        micInsecure: string;
        micPermissionDenied: string;
        micNotFound: string;
        micBusy: string;
        micOverconstrained: string;
        micUnknown: string;
    };
};

/** Broadcast 内置文案的类型 */
type BroadcastLocales = typeof locales;

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
 * 语音列表查询结果
 */
interface VoiceListResult {
    /** 语音列表 */
    data: VoiceItem[];
    /** 分页信息 */
    page: {
        total: number;
        size: number;
        page: number;
    };
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
 * 麦克风错误码（`onError` 中 `type: 'permission'` 时的 `code`）：
 * - `unsupported`：浏览器不支持录音（没有 `getUserMedia` / `AudioContext`）
 * - `insecure`：非安全上下文，需要 HTTPS 或 localhost
 * - `denied`：用户或浏览器策略拒绝了麦克风权限
 * - `notFound`：没有可用的麦克风设备
 * - `busy`：麦克风被占用或硬件无法启动
 * - `overconstrained`：麦克风不满足录音参数（已自动退回默认参数重试，仍失败）
 * - `unknown`：其它麦克风错误
 */
type MicrophoneErrorCode = 'unsupported' | 'insecure' | 'denied' | 'notFound' | 'busy' | 'overconstrained' | 'unknown';
/**
 * 错误码：麦克风错误码（{@link MicrophoneErrorCode}，`type: 'permission'`），以及录音错误码（`type: 'record'`）：
 * - `tooShort`：录音时长不足最短时长（3 秒）
 * - `startFailed`：麦克风以外的原因导致开始录音失败
 * - `stopFailed`：停止录音 / 编码失败
 */
type BroadcastErrorCode = MicrophoneErrorCode | 'tooShort' | 'startFailed' | 'stopFailed';
/**
 * 错误信息（`onError` 的参数）
 */
interface BroadcastErrorInfo {
    /**
     * 错误类型：
     * - `permission`：获取麦克风失败（开始录音时，或 `requestMicrophonePermission()`），`code` 为具体原因
     * - `record`：其它录音错误（时长不足、开始 / 停止录音失败）
     */
    type: 'record' | 'permission';
    /** 错误码，见 {@link BroadcastErrorCode} */
    code: BroadcastErrorCode;
    /** 本地化的错误描述（与界面轻提示一致） */
    msg: string;
    /** 原始错误 */
    error: unknown;
}
/**
 * 内置接口的调用结果（`onApiResult` 的参数）
 */
interface BroadcastApiResult {
    /** 接口：查询语音列表 / 语音文件下发 / 临时语音下发 */
    api: 'queryVoiceList' | 'sendVoice' | 'sendVoiceOnce';
    /** 是否成功（接口返回码为 200） */
    success: boolean;
    /** 接口返回码；网络错误等没有返回码时为空串 */
    code: string;
    /** 提示信息：成功时为控件展示的成功文案，失败时为接口返回的 `msg` 或默认失败文案 */
    msg: string;
    /** 接口原始返回或原始错误 */
    data?: unknown;
}
/**
 * 宿主回调（替代 0.1.x 的事件）。均在构造时与 `updateOptions` 中配置，调用时读取最新值；
 * 回调抛出的异常会被捕获并通过 logger 打印，不会中断控件内部流程（例如录音结束后请求下发）。
 *
 * 语音列表始终由控件调用内置接口查询，变化时通过 `onVoiceListChange` 回调；两种下发默认也调用内置接口，
 * 配置了对应的 `onRequest*` 回调时改由宿主接管，控件不再调用该内置接口。
 */
interface BroadcastCallbacks {
    /** 面板打开（`open = true`） */
    onOpen?: () => void;
    /** 面板关闭：关闭按钮、遮罩、Esc、`close()` / `open = false`，以及打开状态下的 `destroy()` */
    onClose?: () => void;
    /**
     * 语音列表变化，参数为新列表（副本）：内置接口自动翻页全部加载完后触发一次（含空列表）；
     * 后续页失败时以已加载的部分触发。首页查询失败、构造时传入的初始 `voiceList` 不触发
     */
    onVoiceListChange?: (voiceList: VoiceItem[]) => void;
    /**
     * 请求下发默认语音（点击语音项）。配置后由宿主接管（不再调用内置接口）：
     * 宿主下发后调用 `showSuccess(msg)` 或 `showError(msg)`
     */
    onRequestSendVoice?: (data: SendVoiceRequest) => void;
    /**
     * 请求下发临时语音（录音结束）。配置后由宿主接管（不再调用内置接口）：
     * 宿主下发后调用 `showSuccess(msg)` 或 `showError(msg)`
     */
    onRequestSendVoiceOnce?: (data: SendVoiceOnceRequest) => void;
    /** 内置接口调用完成（成功或失败）；由宿主接管的请求不会触发 */
    onApiResult?: (result: BroadcastApiResult) => void;
    /** 录到有效语音，参数与 `onRequestSendVoiceOnce` 相同，紧挨着在它之前调用 */
    onVoiceRecorded?: (data: SendVoiceOnceRequest) => void;
    /** 开始录音 */
    onRecordStart?: () => void;
    /** 停止录音并得到有效录音（随后请求下发）；关闭面板取消录音时不触发 */
    onRecordStop?: () => void;
    /** 录音完成：正常停止，或达到最长时长自动停止并暂存时；参数为 WAV 录音 */
    onRecordComplete?: (voiceFile: Blob) => void;
    /** 出错：获取麦克风失败（`type: 'permission'`）或其它录音错误（`type: 'record'`），`code` 为具体原因 */
    onError?: (info: BroadcastErrorInfo) => void;
}
/**
 * 云广播配置选项
 */
/**
 * 云广播配置选项。
 *
 * 公共字段（`@ezuikit/control-core` 的 {@link ControlCoreOptions}）：`deviceSerial` / `channelNo` / `accessToken` /
 * `token`（`deviceToken.video` 用于下发，`httpToken.url` 用于查询语音列表）/ `env.domain`（默认 `https://open.ys7.com`）/
 * `language` / `i18n` / `locales` / `prefixLocaleKey`（默认 `broadcast`）/ `logger`
 */
interface BroadcastOptions extends BroadcastCallbacks, ControlCoreOptions {
    /** 设备序列号（必填） */
    deviceSerial: string;
    /** 语言，默认 `'zh'`；传入 `i18n` 时忽略（使用 `i18n` 当前的语言）。仅构造时生效 */
    language?: 'zh' | 'en';
    /** 设备能力集 */
    capacity?: {
        /** 对讲能力：1或3表示支持云广播 */
        support_talk?: string | number | null;
    };
    /** 展开方向 */
    direction?: 'top' | 'bottom' | 'left' | 'right';
    /** 初始语音列表 */
    voiceList?: VoiceItem[];
    /** 是否移动端：按住说话、松开结束（PC 端为点击切换），不影响挂载位置 */
    isMobile?: boolean;
}

declare const Broadcast_base: _ezuikit_control_core.ControlCoreMixinClass<typeof Drawer>;
/**
 * 云广播喊话控件。
 *
 * 继承 {@link Drawer}（`@ezuikit/control-drawer`）复用其抽屉骨架（遮罩、面板、标题栏、开合动画、挂载与滚动锁定），
 * 并通过 `ControlCoreMixin` 继承 `@ezuikit/control-core` 的公共能力：日志（`logger`）、多语言（`i18n` / `t()`，
 * 命名空间 `broadcast`）、设备与鉴权配置（`deviceSerial` / `token` / `domain` 等）。
 * 本类只负责编排，具体功能拆在各模块中：
 *
 * - 界面：{@link VoiceListView}（Tab、语音列表与加载 / 空 / 错误态）、{@link TalkButton}（录音按钮）、
 *   {@link Tip}（底部轻提示，Message 实例）、{@link RecordingPrompt}（录音提示浮层：波形 + 倒计时）；
 * - 录音：{@link RecordController}（状态机、最长时长、取消），底层为 `VoiceRecorder`；
 * - 接口：{@link BroadcastServices}（查询 / 下发）、{@link VoiceListLoader}（语音列表自动翻页）。
 *
 * 语音列表由控件调用内置接口查询，加载完后通过 `onVoiceListChange` 回调给宿主；
 * 语音文件下发、临时语音下发默认也调用内置接口，配置了对应的请求回调（`onRequestSendVoice` /
 * `onRequestSendVoiceOnce`）时改由宿主接管，宿主下发后用 `showSuccess(msg)` / `showError(msg)` 回填结果。
 * 内置接口的调用结果通过 `onApiResult` 通知宿主。
 *
 * 面板开合使用继承自 Drawer 的 `open` 访问器（`broadcast.open = true`），`close()` 等价于 `open = false`。
 *
 * @example
 * ```ts
 * import Broadcast from '@ezuikit/control-broadcast';
 * import '@ezuikit/control-broadcast/dist/style/style.css';
 *
 * const broadcast = new Broadcast('player', {
 *   deviceSerial: '<serial>',
 *   accessToken: '<token>',
 *   onVoiceListChange: (list) => console.log(list.length),
 *   onError: ({ code, msg }) => console.warn(code, msg),
 * });
 * broadcast.open = true;
 * ```
 */
declare class Broadcast extends Broadcast_base<BroadcastLocales> {
    /** 版本号 */
    static VERSION: string;
    /**
     * 内置多语言字典（不带命名空间）：`{ zh: {...}, en: {...} }`。宿主可用相同结构的 `options.locales` 覆盖部分文案
     */
    static locales: {
        zh: {
            title: string;
            defaultVoice: string;
            pressToTalk: string;
            clickToTalk: string;
            sendVoice: string;
            recording: string;
            stopRecording: string;
            loading: string;
            noVoice: string;
            recordingRemaining: string;
            releaseToStop: string;
            clickToStop: string;
            voiceSentSuccess: string;
            recordComplete: string;
            voiceSendFailed: string;
            voiceListFailed: string;
            recordFailed: string;
            recordTooShort: string;
            micUnsupported: string;
            micInsecure: string;
            micPermissionDenied: string;
            micNotFound: string;
            micBusy: string;
            micOverconstrained: string;
            micUnknown: string;
        };
        en: {
            title: string;
            defaultVoice: string;
            pressToTalk: string;
            clickToTalk: string;
            sendVoice: string;
            recording: string;
            stopRecording: string;
            loading: string;
            noVoice: string;
            recordingRemaining: string;
            releaseToStop: string;
            clickToStop: string;
            voiceSentSuccess: string;
            recordComplete: string;
            voiceSendFailed: string;
            voiceListFailed: string;
            recordFailed: string;
            recordTooShort: string;
            micUnsupported: string;
            micInsecure: string;
            micPermissionDenied: string;
            micNotFound: string;
            micBusy: string;
            micOverconstrained: string;
            micUnknown: string;
        };
    };
    /** 广播配置（区别于继承自 Drawer 的 `options`，用 `updateOptions` 更新） */
    private broadcastOptions;
    /** 取文案的函数（绑定本实例的 `t()`），传给各界面模块与错误转换 */
    private readonly translate;
    /** 当前语音列表 */
    private list;
    /** 内置接口服务（与本实例共用设备与鉴权配置） */
    private readonly voiceServices;
    /** 语音列表翻页加载 */
    private readonly voiceListLoader;
    /** 语音列表视图 */
    private readonly listView;
    /** 录音按钮 */
    private readonly talkButton;
    /** 底部轻提示 */
    private readonly tip;
    /** 录音提示浮层（波形 + 倒计时） */
    private readonly recordingPrompt;
    /** 录音流程 */
    private readonly recordController;
    /** 是否已销毁：销毁后到达的接口结果不再更新界面、不再回调 */
    private destroyed;
    /**
     * @param container 挂载容器：元素 ID、CSS 选择器或 HTMLElement（先按 ID、再按选择器查找，找不到时回退到 document.body）；
     *   PC 与移动端一致，非 body 容器需为定位元素
     * @param options 配置选项，见 {@link BroadcastOptions}
     */
    constructor(container: string | HTMLElement, options: BroadcastOptions);
    /** 当前语音列表（副本，修改它不影响控件） */
    get voiceList(): VoiceItem[];
    /**
     * 关闭面板（等价于 `open = false`），效果与关闭按钮、遮罩点击、Esc 一致；录音中会取消本次录音
     */
    close(): void;
    /**
     * 重新加载语音列表（打开面板且没有语音列表时会自动调用）：调用内置接口分页查询，
     * 已加载条数小于接口返回的 `page.total` 时自动加载下一页，直至加载完。
     * 每加载一页就追加渲染，全部加载完后触发一次 `onVoiceListChange`（参数为完整列表）；
     * 首页失败时在列表区展示错误，后续页失败时保留已加载的部分并以轻提示展示错误。并发调用时只采用最后一次的结果。
     */
    loadVoiceList(): void;
    /**
     * 开始录音（与点击 / 按住录音按钮相同）：展示录音提示、获取麦克风并开始采集。
     * 录音进行中或已销毁时为空操作。失败时恢复按钮与录音提示、展示轻提示并触发 `onError`；
     * 启动期间面板被关闭或实例被销毁时丢弃本次录音。
     * @returns 是否成功开始录音
     */
    startRecord(): Promise<boolean>;
    /**
     * 结束录音（与再次点击 / 松开录音按钮相同）：停止采集，得到有效录音后下发临时语音。
     * 启动期间调用时，启动完成后立即结束；未在录音时为空操作。时长不足等错误会展示轻提示并触发 `onError`。
     */
    stopRecord(): Promise<void>;
    /**
     * 请求麦克风权限（获取后立即释放），可用于提前授权或用户拒绝后重新请求。
     * 失败时触发 `onError`（`type: 'permission'`，`code` 为具体原因），不展示轻提示
     * @returns 是否获得权限
     */
    requestMicrophonePermission(): Promise<boolean>;
    /**
     * 展示成功提示（底部轻提示，2 秒自动关闭）。宿主接管下发（`onRequestSendVoice*`）后用它回填结果；销毁后为空操作
     * @param message 文案（纯文本）
     */
    showSuccess(message: string): void;
    /**
     * 展示错误提示（底部轻提示，2 秒自动关闭）。宿主接管下发（`onRequestSendVoice*`）后用它回填结果；销毁后为空操作
     * @param message 文案（纯文本）
     */
    showError(message: string): void;
    /**
     * 更新配置：浅合并到当前配置，回调在下次触发时读取新值，`accessToken` / `token` / `env` /
     * `deviceSerial` / `channelNo` 在下次接口请求时生效；
     * 方向、语言、移动端、初始列表、日志等界面相关配置只在构造时生效（容器是构造参数，无法更新）。
     * @param options 新的配置选项
     */
    updateOptions(options: Partial<BroadcastOptions>): void;
    /**
     * 销毁实例：关闭面板（打开时触发 `onClose`）、取消录音并释放麦克风、取消进行中的请求，移除 DOM 与监听。
     * 可重复调用，销毁后其它方法为空操作
     */
    destroy(): void;
    /**
     * 调用宿主回调（每次读取最新配置）。回调抛出的异常只通过 logger 打印，不中断控件内部流程
     * @param name 回调名
     * @param args 回调参数
     */
    private invoke;
    /**
     * 宿主是否配置了某个回调（用于判断下发是否由宿主接管）
     * @param name 回调名
     */
    private hasCallback;
    /**
     * 内置接口失败的统一处理：已销毁时忽略，否则打印日志并触发 `onApiResult`
     * @param api 接口名
     * @param error 捕获的错误
     * @param msg 展示文案
     * @returns 是否需要继续更新界面
     */
    private handleApiFailure;
    /**
     * 抽屉开 / 合：`open = x`、`close()` 与遮罩 / 关闭按钮 / Esc 都会触发（状态未变化时不触发）。
     * 打开时无语音列表则加载并触发 `onOpen`；关闭时取消进行中的录音（不下发）并触发 `onClose`
     * @param open 是否打开
     */
    private handleOpenChange;
    /**
     * 通过 {@link VoiceListLoader} 逐页加载，并把每页结果、最终结果反映到界面与回调
     */
    private queryVoiceList;
    /**
     * 替换语音列表并重新渲染（不触发回调），非数组按空列表处理
     * @param list 语音列表
     */
    private setVoiceList;
    /**
     * 报告录音错误：打印日志、展示轻提示并触发 `onError`（已销毁时忽略）
     * @param error 原始错误
     * @param fallback 非麦克风、非时长不足的错误使用的错误码
     */
    private reportRecordError;
    /**
     * 下发临时语音（录音结束得到有效录音时调用）。
     * 先触发 `onVoiceRecorded`；配置了 `onRequestSendVoiceOnce` 时由宿主下发，否则调用内置接口下发并展示结果
     * @param voiceFile 语音文件（WAV）
     */
    private sendVoiceOnce;
    /**
     * 下发默认语音（点击语音项时调用）。
     * 配置了 `onRequestSendVoice` 时由宿主下发，否则调用内置接口下发并展示结果
     * @param fileUrl 语音文件 URL
     */
    private sendVoice;
    /**
     * 调用内置下发接口，成功 / 失败都以底部轻提示展示，并触发 `onApiResult`
     * @param api 接口名
     * @param request 发起请求
     */
    private sendByApi;
}

/**
 * @description 入口（ESM / CJS）：默认导出 Broadcast，具名导出只有类型。
 * 不导出值：CJS 产物保持 `module.exports = Broadcast`，`require()` 直接得到类
 * @author Ezviz-OpenBiz
 * @since 2026-01-13
 */

export { Broadcast as default };
export type { BroadcastApiResult, BroadcastCallbacks, BroadcastErrorCode, BroadcastErrorInfo, BroadcastOptions, MicrophoneErrorCode, SendVoiceOnceRequest, SendVoiceRequest, VoiceItem, VoiceListResult };
