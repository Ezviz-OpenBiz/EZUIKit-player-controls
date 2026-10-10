/**
 * 消息类型
 */
type MessageType = 'info' | 'success' | 'warn' | 'error';
/**
 * 消息弹出位置（相对挂载容器 / 视口）
 */
type MessagePosition = 'top' | 'bottom';
/**
 * 单条消息配置（`open` 的参数，以及 `info` / `success` / `warn` / `error` 的 options 参数）
 */
interface MessageItemOptions {
    /** 消息类型，默认 'info' */
    type?: MessageType;
    /** 消息内容，字符串按文本插入，也可传 HTMLElement */
    content?: string | HTMLElement;
    /** 自动关闭时长（ms），默认继承实例的 `duration`，0 表示不自动关闭 */
    duration?: number;
    /** 是否全屏展示（覆盖整个容器，图标与文案上下布局），默认 false */
    full?: boolean;
    /** 该条消息关闭后的回调 */
    onClose?: () => void;
}
/**
 * 一条已展示的消息记录（`open` / `info` 等方法的返回值为其 id，`onOpen` / `onClose` 回调传入该对象）
 */
interface MessageItem {
    /** 消息唯一标识 */
    id: string;
    /** 消息类型 */
    type: MessageType;
    /** 消息内容 */
    content: string | HTMLElement;
    /** 自动关闭时长（ms），0 表示不自动关闭 */
    duration: number;
    /** 自动关闭定时器句柄 */
    timer: number | null;
    /** 是否全屏展示（覆盖整个容器） */
    full: boolean;
    /** 消息对应的 DOM 节点 */
    el: HTMLElement;
    /** 关闭回调 */
    onClose?: () => void;
}
/**
 * Message 配置项
 */
interface MessageOptions {
    /** 挂载容器，支持元素 ID、CSS 选择器或 HTMLElement，默认 document.body */
    container?: string | HTMLElement;
    /** 单条消息自动关闭时长（ms），默认 3000，0 表示不自动关闭 */
    duration?: number;
    /** 最大同时显示条数，默认 0 表示不限制（超出后关闭最早的消息） */
    maxCount?: number;
    /** 消息弹出位置，默认 'top' */
    position?: MessagePosition;
    /** 层级，默认 1000 */
    zIndex?: number;
    /** 追加到根节点的自定义类名，多个用空格分隔 */
    className?: string;
    /** 消息打开回调 */
    onOpen?: (item: MessageItem) => void;
    /** 消息关闭回调 */
    onClose?: (item: MessageItem) => void;
}

/**
 * Message 消息 / Toast 通知控件。
 *
 * 每个实例是一个独立的消息上下文（context），拥有自己的挂载容器与消息列表，
 * 支持在页面的多个区域分别弹出消息（多 context）：
 * 1. 根节点铺满挂载容器（或视口，挂到 body 时为 fixed），即「覆盖全部区域」的点击穿透层；
 * 2. 消息以 Toast 形式在该区域内堆叠展示，自动关闭，支持手动关闭 / 清空；
 * 3. 提供 `info` / `success` / `warn` / `error` 四种类型（图标与配色不同）。
 *
 * @example
 * ```ts
 * const message = new Message();
 * message.info('这是一条信息');
 * message.success('操作成功');
 * message.warn('请注意');
 * message.error('出错了');
 * ```
 */
declare class Message {
    /** 构建时由 Rollup 注入版本号 */
    static VERSION: string;
    /** 配置项 */
    options: MessageOptions;
    /** 挂载容器 */
    private _container;
    /** 消息根节点（铺满容器的点击穿透层） */
    private _$root;
    /** 当前展示中的消息列表 */
    private _items;
    private _destroyed;
    /**
     * @param container 挂载容器，支持 CSS 选择器、元素 ID 或 HTMLElement，缺省为 document.body。
     * 非 body 容器需为定位元素（position 非 static），消息相对它铺满定位。
     * @param options 配置项
     */
    constructor(container?: string | HTMLElement, options?: MessageOptions);
    /**
     * 弹出一条 info 消息。
     * @param content 消息内容，字符串按文本插入，也可传 HTMLElement
     * @param options 单条消息配置（duration / onClose 等）
     * @returns 消息 id（可传给 {@link Message.close} 手动关闭）
     */
    info(content: string | HTMLElement, options?: MessageItemOptions): string;
    /**
     * 弹出一条 success 消息。
     * @param content 消息内容
     * @param options 单条消息配置
     * @returns 消息 id
     */
    success(content: string | HTMLElement, options?: MessageItemOptions): string;
    /**
     * 弹出一条 warn 消息。
     * @param content 消息内容
     * @param options 单条消息配置
     * @returns 消息 id
     */
    warn(content: string | HTMLElement, options?: MessageItemOptions): string;
    /**
     * 弹出一条 error 消息。
     * @param content 消息内容
     * @param options 单条消息配置
     * @returns 消息 id
     */
    error(content: string | HTMLElement, options?: MessageItemOptions): string;
    /**
     * 弹出一条消息（需在配置中指定 type / content）。
     * @param options 消息配置
     * @returns 消息 id
     */
    open(options: MessageItemOptions): string;
    /**
     * 弹出一条全屏消息：覆盖整个容器，图标与文案上下布局。
     * @param content 消息内容
     * @param options 单条消息配置（type / duration / onClose 等）
     * @returns 消息 id
     */
    full(content: string | HTMLElement, options?: MessageItemOptions): string;
    /**
     * 关闭指定消息；不传 id 时关闭全部。
     * @param id 消息 id（由 open / info 等方法返回）
     */
    close(id?: string): void;
    /**
     * 清空全部消息（等价于 `close()`）。
     */
    clear(): void;
    /**
     * 更新配置。duration / maxCount 对后续新消息生效，position / zIndex / className 立即生效。
     * @param options 新配置
     */
    updateOptions(options: Partial<MessageOptions>): void;
    /**
     * 销毁实例：清除定时器、移除 DOM（幂等）。
     */
    destroy(): void;
    private _resolveContainer;
    /** 按 CSS 选择器查找元素，非法选择器返回 null 而不是抛错 */
    private _query;
    private _position;
    private _buildRootClass;
    private _render;
    /** 将根节点挂载到容器：挂在 body 上时相对视口定位（fixed），否则相对容器定位（absolute） */
    private _attach;
    private _open;
    private _createItemElement;
    private _removeItem;
    private _clearItemTimer;
    /** 超出最大条数时，关闭最早的消息 */
    private _trim;
}

export { Message as default };
export type { MessageItem, MessageItemOptions, MessageOptions, MessagePosition, MessageType };
