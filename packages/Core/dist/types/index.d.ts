import I18n, { I18nTranslation } from '@ezuikit/utils-i18n';
export { default as I18n, I18nTranslation } from '@ezuikit/utils-i18n';
import { LoggerCls } from '@ezuikit/utils-logger';
export { LoggerCls } from '@ezuikit/utils-logger';

/**
 * @description 接口请求与设备鉴权配置：保存 `deviceSerial` / `channelNo` / `accessToken` / `token` / `env`；基于 fetch 发出请求，
 * 地址拼接域名（`env.domain`），默认携带 `clientType` / `accessToken` / `deviceSerial` / `localIndex`（通道号）请求头，
 * 可统一取消进行中的请求。继承 ControlCore 的控件通过 `this.services` 使用，也可以单独 `new Services(options)`
 * @author Ezviz-OpenBiz
 * @since 2026-11-15
 */

/**
 * 接口请求服务。
 *
 * - 地址：相对路径前加 `domain`（`env.domain`，缺省 `https://open.ys7.com`，去掉末尾 `/`），`http(s)://` 开头的地址原样使用；
 * - 请求头：默认携带 `clientType: 'ezuikit'`，以及已配置的 `accessToken`、`deviceSerial`、`localIndex`（通道号），
 *   `options.headers` 中的同名字段优先；`headers: null` 表示不携带任何请求头；
 * - 取消：每个请求带 `AbortSignal`，`abortAll()` / `destroy()` 取消进行中的请求（`setSignal = false` 的请求不受影响，
 *   可自行传 `signal`，如超时控制）；
 * - 配置：`updateOptions` 浅合并（`token` / `env` 整体替换），下次请求生效；`deviceSerial` / `channelNo` / `accessToken` /
 *   `token` / `domain` / `options` 读取当前配置；
 * - token：`accessToken` 优先，未传时按接口类型使用小权限 `token`（见 `token` 的示例）；默认请求头只带 `accessToken`。
 *
 * 返回原始 `Response`，由调用方解析（`await res.json()`）。
 *
 * @example
 * ```ts
 * const services = new Services({ deviceSerial: 'BC1234567', channelNo: 1, accessToken: 'at.xxx' });
 *
 * const res = await services.get('/api/service/device/talkMode?deviceSerial=BC1234567');
 * const data = await res.json();
 *
 * const body = new FormData();
 * body.append('accessToken', services.accessToken || services.token?.deviceToken?.video || '');
 * await services.post('/api/lapp/voice/send', { body, headers: null }); // 开放平台表单接口不需要请求头
 *
 * services.updateOptions({ accessToken: 'at.new', env: { domain: 'https://open.ys7.com' } });
 * services.abortAll(); // 取消进行中的请求
 * ```
 */
declare class Services {
    /** 设备与鉴权配置 */
    private _options;
    /** 进行中请求的取消控制器 */
    private _controllers;
    /**
     * @param options 设备与鉴权配置（可直接传控件的完整配置，只读取 `deviceSerial` / `channelNo` / `accessToken` / `token` / `env`）
     */
    constructor(options?: Partial<ControlServiceOptions>);
    /**
     * 当前的设备与鉴权配置（副本）
     *
     * @example
     * ```ts
     * services.options.accessToken; // 'at.xxx'
     * ```
     */
    get options(): ControlServiceOptions;
    /**
     * 设备序列号
     *
     * @example
     * ```ts
     * body.append('deviceSerial', this.services.deviceSerial ?? '');
     * ```
     */
    get deviceSerial(): string | undefined;
    /**
     * 通道号
     *
     * @example
     * ```ts
     * body.append('channelNo', String(this.services.channelNo ?? 1));
     * ```
     */
    get channelNo(): string | number | undefined;
    /**
     * 接口域名（`env.domain`，去掉末尾 `/`），缺省为 `https://open.ys7.com`
     *
     * @example
     * ```ts
     * new Services({ env: { domain: 'https://a.com/' } }).domain; // 'https://a.com'
     * ```
     */
    get domain(): string;
    /**
     * 访问令牌（未传时为空串），优先于小权限 token
     *
     * @example
     * ```ts
     * if (!this.services.accessToken && !this.services.token) this.logger.error('accessToken is required');
     * ```
     */
    get accessToken(): string;
    /**
     * 小权限 token（`options.token`），见 {@link ControlToken}。`accessToken` 优先，未传 `accessToken` 时按接口类型取用
     *
     * @example
     * ```ts
     * const { accessToken, token } = this.services;
     * const video = accessToken || token?.deviceToken?.video || ''; // 设备类接口
     * const global = accessToken || token?.deviceToken?.global || ''; // 设备类全局接口
     * const talk = accessToken || token?.streamToken?.talk || ''; // 对讲取流
     * const http = accessToken || token?.httpToken?.url || ''; // 非设备类接口
     * ```
     */
    get token(): ControlToken | undefined;
    /**
     * 进行中（可取消）的请求数
     */
    get pending(): number;
    /**
     * 更新配置：浅合并（`token` / `env` 整体替换），只处理设备与鉴权字段，其它字段忽略；传 `undefined` 可清除字段。下次请求生效
     * @param options 新的配置
     *
     * @example
     * ```ts
     * services.updateOptions({ accessToken: 'at.new' });
     * services.updateOptions({ token: undefined }); // 清除小权限 token
     * ```
     */
    updateOptions(options?: Partial<ControlServiceOptions>): void;
    /**
     * 拼接接口地址（内部使用）：相对路径前加 `domain`，`http(s)://` 开头的地址原样返回
     * @param path 接口路径（开头的 `/` 可省略）
     */
    private url;
    /**
     * 默认请求头：`clientType`，以及已配置的 `accessToken` / `deviceSerial` / `localIndex`（通道号）
     *
     * @example
     * ```ts
     * services.headers; // { clientType: 'ezuikit', accessToken: 'at.xxx', deviceSerial: 'BC1234567', localIndex: '1' }
     * ```
     */
    get headers(): Record<string, string>;
    /**
     * 发起请求
     * @param url 接口地址（相对路径或完整地址）
     * @param options 请求参数（同 fetch；`headers: null` 表示不携带任何请求头）
     * @param setSignal 是否可被 `abortAll()` 取消，默认 true
     * @returns fetch 的 Response
     *
     * @example
     * ```ts
     * const res = await services.request('/api/v3/device/talkMode?mode=1', { method: 'PUT' });
     * ```
     */
    request(url: string, options?: ServicesRequestInit, setSignal?: boolean): Promise<Response>;
    /**
     * GET 请求
     * @param url 接口地址
     * @param options 请求参数
     * @param setSignal 是否可被 `abortAll()` 取消，默认 true
     *
     * @example
     * ```ts
     * const res = await services.get(`/api/service/device/talkMode?deviceSerial=${serial}`);
     * ```
     */
    get(url: string, options?: ServicesRequestInit, setSignal?: boolean): Promise<Response>;
    /**
     * POST 请求
     * @param url 接口地址
     * @param options 请求参数（`body` 为 FormData 时不要手动设置 Content-Type）
     * @param setSignal 是否可被 `abortAll()` 取消，默认 true
     *
     * @example
     * ```ts
     * const res = await services.post('/api/lapp/voice/send', { body: form, headers: null });
     * ```
     */
    post(url: string, options?: ServicesRequestInit, setSignal?: boolean): Promise<Response>;
    /**
     * PUT 请求
     * @param url 接口地址
     * @param options 请求参数
     * @param setSignal 是否可被 `abortAll()` 取消，默认 true
     *
     * @example
     * ```ts
     * await services.put(`/api/v3/device/talkMode?deviceSerial=${serial}&mode=1`);
     * ```
     */
    put(url: string, options?: ServicesRequestInit, setSignal?: boolean): Promise<Response>;
    /**
     * DELETE 请求
     * @param url 接口地址
     * @param options 请求参数
     * @param setSignal 是否可被 `abortAll()` 取消，默认 true
     *
     * @example
     * ```ts
     * await services.delete(`/api/xxx?id=1`);
     * ```
     */
    delete(url: string, options?: ServicesRequestInit, setSignal?: boolean): Promise<Response>;
    /**
     * 取消所有进行中的请求：以 `abort('abort fetch')` 中止，被取消的请求 reject，原因为 `signal.reason`（浏览器中即 `'abort fetch'`）。
     * `setSignal = false` 的请求不受影响；没有进行中的请求时为空操作，取消后可以继续发请求
     *
     * @example
     * ```ts
     * services.abortAll();
     * ```
     */
    abortAll(): void;
    /**
     * 销毁：取消所有进行中的请求（同 `abortAll()`）。控件销毁时调用；之后仍可发请求，配置保留
     *
     * @example
     * ```ts
     * destroy() {
     *   this.services.destroy();
     * }
     * ```
     */
    destroy(): void;
}

/**
 * @description 类型与接口定义：宿主配置（ControlCoreOptions）、控件配置（ControlCoreConfig）、继承后获得的公共成员（ControlCoreApi）等。
 * 本文件只包含类型，不产生运行时代码
 * @author Ezviz-OpenBiz
 * @since 2026-11-15
 */

/**
 * 语言：内置 `zh` / `en`，也可以是宿主 I18n 中的其它语言（如 `ja`，控件没有该语言的文案时用兜底语言）
 *
 * @example
 * ```ts
 * const language: ControlLanguage = 'en';
 * ```
 */
type ControlLanguage = 'zh' | 'en' | (string & {});
/**
 * 文案对象（可嵌套的普通对象，值可以是任意类型），工具函数的入参与返回值使用
 *
 * @example
 * ```ts
 * const messages: ControlMessageRecord = { title: '标题', tip: { ok: '成功' }, months: ['一月', '二月'] };
 * ```
 */
type ControlMessageRecord = Record<string, unknown>;
/**
 * 某一语言的文案：可嵌套；值通常是字符串，也可以是数组等（如 DatePicker 的 `months`，用 `messages` 读取）
 *
 * @example
 * ```ts
 * const zh: ControlLocaleMessages = { title: '广播喊话', remaining: '还可录制 {{time}} 秒', tip: { ok: '成功' } };
 * ```
 */
type ControlLocaleMessages = I18nTranslation | ControlMessageRecord;
/**
 * 多语言字典：`{ [语言]: 文案 }`，文案可嵌套，不带命名空间前缀
 *
 * @example
 * ```ts
 * const locales: ControlLocales = {
 *   zh: { title: '广播喊话', tip: { success: '成功' } },
 *   en: { title: 'Voice Broadcast', tip: { success: 'Success' } },
 * };
 * ```
 */
type ControlLocales = Record<string, ControlLocaleMessages>;
/**
 * 文案 key：内置文案各语言共有的顶层 key（字符串），用于 `t()` 的 key 提示
 *
 * @example
 * ```ts
 * const LOCALES = { zh: { title: '标题', ok: '确定' }, en: { title: 'Title', ok: 'OK' } };
 * type Key = ControlLocaleKey<typeof LOCALES>; // 'title' | 'ok'
 * ```
 */
type ControlLocaleKey<L extends ControlLocales> = Extract<keyof L[keyof L], string>;
/**
 * 插值变量：文案中的 `{{name}}` 替换为 `variables.name`
 *
 * @example
 * ```ts
 * const variables: TranslateVariables = { time: 12 };
 * core.t('remaining', variables); // '还可录制 {{time}} 秒' → '还可录制 12 秒'
 * ```
 */
type TranslateVariables = Record<string, string | number>;
/**
 * 小权限 token（萤石开放平台），各字段都可选，按接口类型取用；`accessToken` 优先，未传 `accessToken` 时才使用小权限 token：
 * - `deviceToken.video`：设备类接口（如云台、语音下发）
 * - `deviceToken.global`：设备类全局接口（如对讲模式）
 * - `streamToken.talk`：对讲取流
 * - `httpToken.url`：非设备类接口（如语音列表查询）
 *
 * 私有流小权限说明见 {@link https://open.ys7.com/help/4293}
 *
 * @example
 * ```ts
 * const token: ControlToken = {
 *   deviceToken: { video: 'dt.video', global: 'dt.global' },
 *   streamToken: { talk: 'st.talk', live: 'st.live', rec: 'st.rec' },
 *   httpToken: { url: 'ht.url' },
 * };
 * // 控件中按接口类型取用
 * const { accessToken, token } = this.services;
 * const value = accessToken || token?.deviceToken?.video || '';
 * ```
 */
interface ControlToken {
    /** 设备类 token */
    deviceToken?: {
        /** 设备类全局接口（如对讲模式查询） */
        global?: string;
        /** 设备类接口（如云台控制、语音下发） */
        video?: string;
        [key: string]: string | undefined;
    };
    /** 取流 token */
    streamToken?: {
        /** 对讲取流 */
        talk?: string;
        /** 直播取流 */
        live?: string;
        /** 回放取流 */
        rec?: string;
        [key: string]: string | undefined;
    };
    /** 非设备类接口 token */
    httpToken?: {
        /** 非设备类接口（如语音列表查询） */
        url?: string;
        [key: string]: string | undefined;
    };
}
/**
 * 环境配置
 *
 * @example
 * ```ts
 * const env: ControlEnv = { domain: 'https://open.ys7.com' };
 * ```
 */
interface ControlEnv {
    /** 接口域名，默认 `https://open.ys7.com`；末尾的 `/` 会被去掉 */
    domain?: string;
}
/**
 * 设备与鉴权配置：保存在实例的 `services` 中（`this.services.deviceSerial` 等），可以用 `updateServiceOptions` 在运行期更新
 *
 * @example
 * ```ts
 * const service: ControlServiceOptions = {
 *   deviceSerial: 'BC1234567',
 *   channelNo: 1,
 *   accessToken: 'at.xxx',
 *   env: { domain: 'https://open.ys7.com' },
 * };
 * ```
 */
interface ControlServiceOptions {
    /** 设备序列号 */
    deviceSerial?: string;
    /** 通道号 */
    channelNo?: string | number;
    /** 访问令牌；与 `token` 同时传入时优先使用 `accessToken`，未传时按接口类型使用小权限 token */
    accessToken?: string;
    /** 小权限 token，见 {@link ControlToken} */
    token?: ControlToken;
    /** 环境配置，见 {@link ControlEnv} */
    env?: ControlEnv;
}
/**
 * `Services` 的请求参数：同 fetch 的 `RequestInit`，`headers` 额外支持 `null`（不携带任何请求头，包括默认请求头）。
 * `method` 由 `get` / `post` / `put` / `delete` 决定（传入的会被覆盖），`request` 使用传入的 `method`
 *
 * @example
 * ```ts
 * // 开放平台表单接口：不携带任何请求头（保持简单请求，避免跨域预检）
 * const init: ServicesRequestInit = { method: 'POST', body: form, headers: null };
 * await this.services.request('/api/lapp/voice/send', init);
 * ```
 */
interface ServicesRequestInit extends Omit<RequestInit, 'headers'> {
    /** 请求头，与默认请求头合并（同名以此为准）；`null` 表示不携带任何请求头 */
    headers?: HeadersInit | null;
}
/**
 * 控件的公共配置项（宿主传入）。控件的配置类型继承它即可获得这些字段。
 *
 * `language` / `i18n` / `prefixLocaleKey` / `locales` / `logger` 只在构造时生效；
 * 设备与鉴权字段（{@link ControlServiceOptions}）可以用 `updateServiceOptions` 在运行期更新。
 *
 * @example
 * ```ts
 * import Logger from '@ezuikit/utils-logger';
 *
 * export interface BroadcastOptions extends ControlCoreOptions {
 *   deviceSerial: string; // 控件可以把可选字段收紧为必填
 *   onOpen?: () => void;
 * }
 *
 * const options: BroadcastOptions = {
 *   deviceSerial: 'BC1234567',
 *   accessToken: 'at.xxx',
 *   language: 'en',
 *   locales: { en: { title: 'Talk to device' } },
 *   logger: Logger({ level: 'WARN' }),
 * };
 * ```
 */
interface ControlCoreOptions extends ControlServiceOptions {
    /** 语言，默认 `'zh'`；传入 `i18n` 时忽略（使用 `i18n` 当前的语言）。仅构造时生效 */
    language?: ControlLanguage;
    /**
     * 多语言实例（`@ezuikit/utils-i18n`），例如与播放器共用的实例。仅构造时生效。
     * 控件以追加的方式（`appendTranslations`）把文案写入它，不切换它的语言；缺省时按 `language` 新建实例
     */
    i18n?: I18n;
    /**
     * 文案在 I18n 中的命名空间（key 前缀），缺省为控件的默认值（如 `broadcast`）；传空串表示不加前缀，支持 `a.b` 多级。
     * 文案的完整 key 为 `${prefixLocaleKey}.${key}`。仅构造时生效
     */
    prefixLocaleKey?: string;
    /**
     * 自定义文案：`{ [语言]: { key: text } }`（不带命名空间前缀），在内置文案之后追加，同名 key 覆盖内置文案；
     * 也可以增加新的语言。兜底语言（默认 `zh`）的自定义文案在兜底时同样生效。仅构造时生效
     */
    locales?: ControlLocales;
    /**
     * 日志实例（`@ezuikit/utils-logger`），缺省时内部创建；日志以控件名为上下文（`logger.context(name)`，前缀 `[name]`）。
     * 没有 `context()` 的 logger（早于 2.1.0 或自定义对象）直接使用。仅构造时生效
     */
    logger?: LoggerCls;
}
/**
 * 控件自身的配置（由控件在 `super()` 中传入，宿主不需要关心）
 *
 * @typeParam L 内置文案的类型
 * @example
 * ```ts
 * const config: ControlCoreConfig<typeof LOCALES> = {
 *   name: 'Broadcast', // 日志上下文 [Broadcast]
 *   prefixLocaleKey: 'broadcast', // 文案 key 为 broadcast.*
 *   locales: LOCALES, // { zh: {...}, en: {...} }
 *   fallbackLanguage: 'zh',
 *   defaults: { channelNo: 1 },
 * };
 * ```
 */
interface ControlCoreConfig<L extends ControlLocales = ControlLocales> {
    /** 控件名：日志上下文（前缀 `[name]`） */
    name: string;
    /** 默认的文案命名空间（如 `broadcast`），宿主可用 `options.prefixLocaleKey` 覆盖；缺省时不加前缀 */
    prefixLocaleKey?: string;
    /** 内置文案：`{ zh: {...}, en: {...} }`，不带命名空间前缀 */
    locales?: L;
    /** 兜底语言：当前语言缺少某条文案时使用该语言的文案（内置 + 宿主 locales），默认 `'zh'` */
    fallbackLanguage?: string;
    /** 设备与鉴权配置的默认值（如 `channelNo: 1`），宿主传入的值优先（按字段覆盖，`token` / `env` 整体替换） */
    defaults?: ControlServiceOptions;
    /**
     * 创建实例上的 `services`：控件需要在接口服务上扩展业务方法时，传入返回 {@link Services} 子类实例的函数；
     * 缺省为 `new Services(options)`。子类中可用 `declare readonly services: XxxServices` 收窄类型。
     * 子类可重写 `updateOptions`（如把 `baseURL` 作为 `env.domain`），`updateServiceOptions` 会经过它
     * @param options 初始的设备与鉴权配置（`defaults` 与宿主配置合并后的结果）
     *
     * @example
     * ```ts
     * class AIChatServices extends Services {
     *   async getChatSuggested() {
     *     return await (await this.get('/api/xxx')).json();
     *   }
     * }
     *
     * class AIChat extends ControlCoreMixin(EventEmitter)<typeof LOCALES> {
     *   declare readonly services: AIChatServices;
     *
     *   constructor(options: AIChatOptions) {
     *     super(options, { name: 'AIChat', locales: LOCALES, createServices: (o) => new AIChatServices(o) });
     *     void this.services.getChatSuggested();
     *   }
     * }
     * ```
     */
    createServices?: (options: ControlServiceOptions) => Services;
}
/**
 * 构造函数类型（`ControlCoreMixin` 的父类）
 *
 * @example
 * ```ts
 * function withName<TBase extends Constructor>(Base: TBase) {
 *   return class extends Base {
 *     name = 'x';
 *   };
 * }
 * ```
 */
type Constructor<T = object> = new (...args: any[]) => T;
/**
 * 控件继承 ControlCore（或 `ControlCoreMixin(Base)`）后获得的公共成员。
 *
 * 控件自身不要再声明同名成员（如 `language` 字段、`logger` / `services` 私有字段）。`t` 等是原型方法，作为回调传出时需要绑定：
 * `(key, v) => this.t(key, v)`。设备与鉴权配置不在实例上，读取 `this.services.xxx`。
 *
 * @typeParam L 内置文案的类型（`{ zh: {...}, en: {...} }`），用于 `t()` 的 key 提示与 `messages` 的类型
 * @example
 * ```ts
 * function describe(control: ControlCoreApi) {
 *   return `${control.name} · ${control.language} · ${control.services.domain}`;
 * }
 * ```
 */
interface ControlCoreApi<L extends ControlLocales = ControlLocales> {
    /**
     * 控件名（日志上下文），来自 `config.name`
     *
     * @example
     * ```ts
     * this.name; // 'Broadcast'
     * ```
     */
    readonly name: string;
    /**
     * 日志实例：宿主 `options.logger.context(name)`，或内部创建的 Logger 的上下文实例（前缀 `[name]`）
     *
     * @example
     * ```ts
     * this.logger.log('init'); // [Broadcast] [LOG] init
     * this.logger.warn('slow network');
     * this.logger.error('request failed', error);
     * ```
     */
    readonly logger: LoggerCls;
    /**
     * 多语言实例：宿主传入的 `options.i18n`，或按 `options.language` 新建的实例。控件文案在命名空间 `prefixLocaleKey` 下
     *
     * @example
     * ```ts
     * this.i18n.t('broadcast.title'); // 直接取完整 key（没有兜底）
     * this.i18n.switchLocale('en'); // 切换语言后 t() / messages 随之变化
     * ```
     */
    readonly i18n: I18n;
    /**
     * 文案在 I18n 中的命名空间（key 前缀），空串表示不加前缀
     *
     * @example
     * ```ts
     * this.prefixLocaleKey; // 'broadcast'（宿主可用 options.prefixLocaleKey 修改）
     * ```
     */
    readonly prefixLocaleKey: string;
    /**
     * I18n 是否由宿主传入（`options.i18n`）
     *
     * @example
     * ```ts
     * if (!this.isExternalI18n) this.i18n.switchLocale('en'); // 只切换自己创建的实例
     * ```
     */
    readonly isExternalI18n: boolean;
    /**
     * 当前语言（I18n 实例的语言）。控件中按语言分支（如表头顺序、日期格式）时读它，不要读 `options.language`：
     * 后者可能带控件自己的默认值，且传入 `i18n` 时被忽略；宿主切换 I18n 的语言后它随之变化
     *
     * @example
     * ```ts
     * this.language; // 'zh'
     * const isChinese = /^zh/i.test(this.language); // 兼容 zh-CN 等
     * ```
     */
    readonly language: string;
    /**
     * 当前语言的全部文案（命名空间下的对象，不带前缀）：兜底语言的文案在下、当前语言的文案在上深度合并，每次返回新对象。
     * 适用于文案中有数组等非字符串的控件（如 DatePicker 的 `months` / `weeks`）
     *
     * @example
     * ```ts
     * const { months, today } = this.messages; // ['Jan', 'Feb', ...], 'Today'
     * ```
     */
    readonly messages: L[keyof L];
    /**
     * 文案在 I18n 中的完整 key：`${prefixLocaleKey}.${key}`（没有前缀时就是 `key`）
     * @param key 文案 key（不带前缀，可为点分路径）
     * @returns 完整 key
     *
     * @example
     * ```ts
     * this.localeKey('title'); // 'broadcast.title'
     * this.i18n.t(this.localeKey('title'));
     * ```
     */
    localeKey: (key: string) => string;
    /**
     * 取文案：取 `${prefixLocaleKey}.${key}`，支持 `{{name}}` 插值。
     * 当前语言缺少该文案，或当前语言完全没有文案（宿主处于控件不支持的语言）时，用兜底语言（默认 `zh`）的文案，不展示 `[missing ...]`；
     * 兜底语言也没有时返回 I18n 的缺失提示
     * @param key 文案 key（不带前缀，可为点分路径）
     * @param variables 插值变量
     * @returns 文案
     *
     * @example
     * ```ts
     * this.t('title'); // '广播喊话'
     * this.t('remaining', { time: 12 }); // '还可录制 12 秒'
     * this.t('tip.ok'); // 嵌套文案
     * ```
     */
    t: (key: ControlLocaleKey<L> | (string & {}), variables?: TranslateVariables) => string;
    /**
     * 追加文案（不带前缀，自动放到命名空间下），同名 key 覆盖已有文案，可用于运行期补充文案或增加语言。
     * 数组整体替换而不是拼接（`appendTranslations` 内部的 deepmerge 默认会拼接数组，多个控件共用一个 I18n 时会重复）
     * @param locales 多语言字典 `{ [语言]: {...} }`，可传多个，后面的覆盖前面的；`undefined` 忽略
     *
     * @example
     * ```ts
     * this.appendLocales({ zh: { extra: '额外文案' }, fr: { title: 'Diffusion' } });
     * this.t('extra'); // '额外文案'
     * ```
     */
    appendLocales: (...locales: Array<ControlLocales | undefined>) => void;
    /**
     * 接口请求服务（{@link Services}），同时保存设备与鉴权配置：`options`（副本）/ `deviceSerial` / `channelNo` /
     * `accessToken` / `token` / `domain`，`updateServiceOptions` 会更新它。每个实例有自己的 `services`。
     * 默认携带 `clientType` / `accessToken` / `deviceSerial` / `localIndex` 请求头（`headers: null` 不携带），地址拼接 `domain`；
     * 控件销毁时调用 `this.services.destroy()` 取消进行中的请求（ControlCore 没有 `destroy()`，不会自动调用）。
     * 控件可用 `config.createServices` 换成扩展了业务接口的子类
     *
     * @example
     * ```ts
     * const { deviceSerial, channelNo, accessToken, token, domain } = this.services;
     *
     * const res = await this.services.get(`/api/service/device/talkMode?deviceSerial=${deviceSerial}`);
     * const { meta, data } = await res.json();
     *
     * const body = new FormData();
     * body.append('accessToken', accessToken || token?.deviceToken?.video || ''); // accessToken 优先
     * await this.services.post('/api/lapp/voice/send', { body, headers: null });
     *
     * destroy() {
     *   this.services.destroy();
     * }
     * ```
     */
    readonly services: Services;
    /**
     * 更新设备与鉴权配置，即 `this.services.updateOptions(options)`：浅合并（`token` / `env` 整体替换），只处理 `deviceSerial` /
     * `channelNo` / `accessToken` / `token` / `env`，其它字段（含 `language` / `i18n` / `locales` / `logger`）忽略。
     * 传 `undefined` 可清除字段。在控件的 `updateOptions` 中调用它，下次请求生效
     * @param options 新的配置，可直接传控件 `updateOptions` 收到的配置
     *
     * @example
     * ```ts
     * updateOptions(options: Partial<BroadcastOptions>) {
     *   this.updateServiceOptions(options); // { accessToken: 'new' } → 下次请求使用新 token
     * }
     * this.updateServiceOptions({ token: undefined }); // 清除小权限 token
     * ```
     */
    updateServiceOptions: (options: Partial<ControlCoreOptions>) => void;
}
/**
 * `ControlCoreMixin(Base)` 返回的类：构造参数为 `(options, config, ...Base 的构造参数)`，
 * 实例同时具有 Base 与 ControlCore（{@link ControlCoreApi}）的成员；静态成员与 Base 相同
 *
 * @typeParam TBase 父类
 * @example
 * ```ts
 * const Mixed: ControlCoreMixinClass<typeof Drawer> = ControlCoreMixin(Drawer);
 * const drawer = new Mixed(options, config, '#player', { placement: 'right' });
 * drawer.setTitle(drawer.t('title'));
 * ```
 */
type ControlCoreMixinClass<TBase extends Constructor> = Omit<TBase, 'prototype'> & {
    new <L extends ControlLocales = ControlLocales>(options: ControlCoreOptions | undefined, config: ControlCoreConfig<L>, ...args: ConstructorParameters<TBase>): InstanceType<TBase> & ControlCoreApi<L>;
    prototype: InstanceType<TBase> & ControlCoreApi;
};

/**
 * @description 控件公共能力（以继承的方式使用）：配置（设备、通道、token、域名）、多语言（i18n / locales / prefixLocaleKey / language）与日志。
 *
 * - 没有父类的控件：`class X extends ControlCore<L>`
 * - 已有父类的控件（Drawer、EventEmitter 等）：`class X extends ControlCoreMixin(Base)<L>`
 * - 设备与鉴权、接口请求：`this.services`（{@link Services}），保存设备与鉴权配置并发出请求
 *
 * 类型定义见 `./interface`
 * @author Ezviz-OpenBiz
 * @since 2026-11-15
 */

/**
 * 是否为 ControlCore 的实例：继承 {@link ControlCore} 或 {@link ControlCoreMixin} 的控件实例都返回 true
 * （混入的实例 `instanceof ControlCore` 为 false，需要用它识别）
 * @param value 任意值
 * @returns 是否为 ControlCore 的实例
 *
 * @example
 * ```ts
 * isControlCore(new Talk(options)); // true（extends ControlCore）
 * isControlCore(new Broadcast('#player', options)); // true（extends ControlCoreMixin(Drawer)）
 * isControlCore({}); // false
 *
 * // 接收控件实例或普通配置
 * const core = isControlCore(source) ? source : new ControlCore(source, { name: 'Services' });
 * ```
 */
declare function isControlCore(value: unknown): value is ControlCoreApi;
/**
 * 给已有父类的控件（如继承 Drawer 的 Broadcast / AlarmMessage、继承 EventEmitter 的 AIChat）混入 ControlCore 的能力。
 * 返回的类继承 `Base`，构造参数为 `(options, config, ...Base 的构造参数)`。没有父类的控件直接继承 {@link ControlCore}。
 *
 * - `Base` 的构造函数先执行，此时 ControlCore 的成员（`t()`、`logger`、`services` 等）还不可用，依赖它们的部分放到 `super()` 之后；
 * - `Base` 可以是 ES5 构造函数，也可以是原生 ES6 class；
 * - 混入的实例 `instanceof Base` 为 true，`instanceof ControlCore` 为 false（用 {@link isControlCore} 识别）。
 *
 * @param Base 父类
 * @returns 继承 `Base` 并具有 {@link ControlCoreApi} 成员的类
 *
 * @example
 * ```ts
 * import Drawer from '@ezuikit/control-drawer';
 * import { ControlCoreMixin, type ControlCoreOptions } from '@ezuikit/control-core';
 *
 * const LOCALES = { zh: { title: '广播喊话' }, en: { title: 'Voice Broadcast' } };
 *
 * interface BroadcastOptions extends ControlCoreOptions {
 *   deviceSerial: string;
 * }
 *
 * class Broadcast extends ControlCoreMixin(Drawer)<typeof LOCALES> {
 *   constructor(container: string | HTMLElement, options: BroadcastOptions) {
 *     // (options, config, ...Drawer 的构造参数)
 *     super(options, { name: 'Broadcast', prefixLocaleKey: 'broadcast', locales: LOCALES }, container, { placement: 'right' });
 *     this.setTitle(this.t('title')); // Drawer 的方法与 ControlCore 的成员共存
 *   }
 *
 *   // Drawer 也有 updateOptions；ControlCore 的方法名为 updateServiceOptions，不冲突
 *   updateOptions(options: Partial<BroadcastOptions>) {
 *     this.updateServiceOptions(options);
 *   }
 * }
 * ```
 */
declare function ControlCoreMixin<TBase extends Constructor>(Base: TBase): ControlCoreMixinClass<TBase>;
/** 没有父类的控件所用的空父类 */
declare class ControlCoreRoot {
}
declare const ControlCore_base: ControlCoreMixinClass<typeof ControlCoreRoot>;
/**
 * 控件公共能力的基类。AlarmMessage、Broadcast、Talk、TimeLine、AIChat、DatePicker、Ptz 等控件以继承的方式使用，统一处理：
 *
 * - **日志**：`options.logger`，以控件名为上下文（`logger`）；
 * - **多语言**：`options.i18n` / `options.language` / `options.locales` / `options.prefixLocaleKey`（`i18n`、`t()`、`messages`）。
 *   内置文案与宿主的 `locales` 以追加的方式写入 I18n 实例，放在命名空间 `prefixLocaleKey` 下；
 * - **设备与鉴权、接口请求**：`options.deviceSerial` / `channelNo` / `accessToken` / `token` / `env.domain`，保存在
 *   `services` 中（`this.services.deviceSerial` / `domain` / `token` 等），可用 `updateServiceOptions` 在运行期更新；
 *   `this.services.get` / `post` 等发出请求。
 *
 * 已有父类的控件（如继承 Drawer）用 {@link ControlCoreMixin}。公共成员的说明与示例见 {@link ControlCoreApi}。
 *
 * 构造参数 `(options, config)`：`options` 为宿主传入的配置（可直接传控件的完整配置，只读取公共字段，见 {@link ControlCoreOptions}），
 * `config` 为控件自身的配置（控件名、默认命名空间、内置文案等，见 {@link ControlCoreConfig}）。
 *
 * @typeParam L 内置文案的类型，用于 `t()` 的 key 提示与 `messages` 的类型
 * @example
 * ```ts
 * import { ControlCore, type ControlCoreOptions } from '@ezuikit/control-core';
 * import zh from './locales/zh_CN'; // { title: '对讲', remaining: '还可录制 {{time}} 秒' }
 * import en from './locales/en_US';
 *
 * const LOCALES = { zh, en };
 *
 * interface TalkOptions extends ControlCoreOptions {
 *   onOpen?: () => void;
 * }
 *
 * class Talk extends ControlCore<typeof LOCALES> {
 *   constructor(options: TalkOptions) {
 *     super(options, { name: 'Talk', prefixLocaleKey: 'talk', locales: LOCALES, defaults: { channelNo: 1 } });
 *     this.logger.log('init'); // [Talk] [LOG] init
 *     this.t('remaining', { time: 12 }); // '还可录制 12 秒'
 *   }
 *
 *   async send(fileUrl: string) {
 *     const { accessToken, token, deviceSerial } = this.services; // 设备与鉴权配置保存在 services 中
 *     const body = new FormData();
 *     body.append('accessToken', accessToken || token?.deviceToken?.video || '');
 *     body.append('deviceSerial', deviceSerial ?? '');
 *     body.append('fileUrl', fileUrl);
 *     await this.services.post('/api/lapp/voice/send', { body, headers: null });
 *   }
 *
 *   updateOptions(options: Partial<TalkOptions>) {
 *     this.updateServiceOptions(options);
 *   }
 *
 *   destroy() {
 *     this.services.destroy(); // 取消进行中的请求
 *   }
 * }
 *
 * const talk = new Talk({ deviceSerial: 'BC1234567', accessToken: 'at.xxx', language: 'en' });
 * talk.t('remaining', { time: 3 }); // '3s remaining'
 * ```
 */
declare class ControlCore<L extends ControlLocales = ControlLocales> extends ControlCore_base<L> {
}

/**
 * @description 常量
 * @author Ezviz-OpenBiz
 * @since 2026-11-15
 */
/**
 * 默认接口域名（萤石开放平台），`env.domain` 未传时使用
 *
 * @example
 * ```ts
 * new ControlCore({}, { name: 'X' }).services.domain === DOMAIN; // true
 * ```
 */
declare const DOMAIN = "https://open.ys7.com";
/**
 * 默认语言：未传 `i18n` 与 `language` 时新建的 I18n 实例的语言
 */
declare const DEFAULT_LANGUAGE = "zh";
/**
 * 默认兜底语言：宿主当前语言缺少某条文案时，使用该语言的文案（控件可用 `config.fallbackLanguage` 修改）
 */
declare const DEFAULT_FALLBACK_LANGUAGE = "zh";

/**
 * @description 工具函数：多语言字典合并、加前缀、按路径取值、插值，配置项合并，日志实例创建
 * @author Ezviz-OpenBiz
 * @since 2026-11-15
 */

/**
 * 深度合并多语言字典，返回新对象（不修改入参，嵌套对象都会复制）；同名的叶子以后面的为准，数组整体替换
 * @param sources 多语言字典，后面的覆盖前面的；`undefined` 忽略
 * @returns 合并后的新对象
 *
 * @example
 * ```ts
 * mergeTranslations({ a: { b: '1', c: '2' }, list: ['x'] }, { a: { b: '3' }, list: ['y'] });
 * // { a: { b: '3', c: '2' }, list: ['y'] }
 * ```
 */
declare function mergeTranslations(...sources: Array<object | undefined>): ControlMessageRecord;
/**
 * 给每种语言的文案加上命名空间：`{ zh: {...} }` → `{ zh: { [prefix]: {...} } }`；前缀为空时原样复制。返回新对象
 * @param locales 多语言字典；`undefined` 时返回空对象
 * @param prefix 命名空间（支持 `a.b` 多级，多余的 `.` 忽略）
 * @returns 带命名空间的多语言字典
 *
 * @example
 * ```ts
 * prefixLocales({ zh: { title: '标题' } }, 'broadcast'); // { zh: { broadcast: { title: '标题' } } }
 * prefixLocales({ zh: { a: '1' } }, 'p.q'); // { zh: { p: { q: { a: '1' } } } }
 * prefixLocales({ zh: { a: '1' } }, ''); // { zh: { a: '1' } }
 * ```
 */
declare function prefixLocales(locales: ControlLocales | undefined, prefix: string): Record<string, ControlMessageRecord>;
/**
 * 按点分路径取值；中间层不是对象或不存在时为 `undefined`
 * @param source 对象
 * @param path 点分路径
 * @returns 路径上的值
 *
 * @example
 * ```ts
 * getByPath({ a: { b: 'x' } }, 'a.b'); // 'x'
 * getByPath({ a: 'x' }, 'a.b'); // undefined
 * ```
 */
declare function getByPath(source: unknown, path: string): unknown;
/**
 * 插值：把 `{{name}}`（允许两侧空格）替换为变量值；没有对应变量时保留占位符
 * @param text 文案
 * @param variables 插值变量；不传时原样返回
 * @returns 插值后的文案
 *
 * @example
 * ```ts
 * interpolate('还可录制 {{time}} 秒', { time: 12 }); // '还可录制 12 秒'
 * interpolate('{{a}}-{{b}}', { a: 1 }); // '1-{{b}}'
 * ```
 */
declare function interpolate(text: string, variables?: TranslateVariables): string;
/**
 * 深度合并配置项（`deepmerge.all`，`clone: false`），后面的覆盖前面的。用于控件合并默认配置与宿主配置。
 *
 * - 普通对象递归合并，数组与 deepmerge 默认行为一致（拼接）；
 * - `clone: false`：只出现在某一侧的值（如宿主传入的 `I18n`、logger、DOM 节点）按引用保留，不会被拷贝成丢失原型方法的普通对象；
 * - `Date`、`RegExp` 不被合并，后者按引用覆盖；
 * - 注意：同名属性两侧都是类实例（如默认配置与宿主配置都带 `i18n`）时，deepmerge 会把它们当作普通对象合并，
 *   丢失原型方法。默认配置里不要放类实例（`Date` 除外），由宿主单侧传入。
 * @param sources 配置项，后面的覆盖前面的；`null` / `undefined` 忽略
 * @returns 合并后的配置
 *
 * @example
 * ```ts
 * const options = mergeOptions<TimeLineOptions>(DEFAULT_OPTIONS, { env: { domain: 'https://a.com' }, i18n });
 * options.i18n === i18n; // true（只在宿主一侧，按引用保留）
 * ```
 */
declare function mergeOptions<T = ControlMessageRecord>(...sources: Array<object | undefined | null>): T;
/**
 * 创建控件的日志实例：优先使用宿主传入的 logger，未传入时新建一个 `@ezuikit/utils-logger` 实例；
 * 都以控件名作为上下文（`logger.context(name)`，前缀 `[name]`）。宿主的 logger 没有 `context()`（早于 2.1.0 或自定义对象）时直接使用它
 * @param name 控件名
 * @param logger 宿主传入的日志实例
 * @returns 控件使用的日志实例
 *
 * @example
 * ```ts
 * import Logger from '@ezuikit/utils-logger';
 *
 * const logger = createControlLogger('Broadcast', Logger({ level: 'WARN' }));
 * logger.warn('slow'); // [Broadcast] [WARN] slow
 * createControlLogger('Talk').log('init'); // 内部创建，INFO 级别
 * ```
 */
declare function createControlLogger(name: string, logger?: LoggerCls): LoggerCls;

export { ControlCore, ControlCoreMixin, DEFAULT_FALLBACK_LANGUAGE, DEFAULT_LANGUAGE, DOMAIN, Services, createControlLogger, getByPath, interpolate, isControlCore, mergeOptions, mergeTranslations, prefixLocales };
export type { Constructor, ControlCoreApi, ControlCoreConfig, ControlCoreMixinClass, ControlCoreOptions, ControlEnv, ControlLanguage, ControlLocaleKey, ControlLocaleMessages, ControlLocales, ControlMessageRecord, ControlServiceOptions, ControlToken, ServicesRequestInit, TranslateVariables };
