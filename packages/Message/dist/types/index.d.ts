/**
 * 消息类型
 */
type MessageType = 'info' | 'success' | 'warn' | 'error' | 'notification';
/**
 * 消息弹出位置（相对挂载容器 / 视口）
 */
type MessagePosition = 'top' | 'bottom' | 'left' | 'right';
/**
 * 单条消息配置（`open` 的参数，以及各消息方法的 options 参数）
 */
interface MessageItemOptions {
    /** 消息类型，默认 'info' */
    type?: MessageType;
    /** 消息内容，字符串按innerHTML插入(有安全风险，须开发者自行解决)，也可传 HTMLElement */
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
    /** 所有 Message 实例共用的类型图标配置 */
    private static _icons;
    /**
     * 设置所有 Message 实例共用的类型图标；未配置的类型使用内置图标。
     * 调用时会替换整个配置，传入空对象可恢复全部内置图标。
     * @param icons 按消息类型配置的图标，支持图片 URL 或 HTMLElement
     *
     * @example
     * ```ts
     * // 自定义部分类型的图标，未配置的类型仍使用内置图标
     * Message.setIcons({ success: 'https://example.com/success.png', error: document.createElement('i') });
     *
     * // 传入空对象恢复全部内置图标
     * Message.setIcons({});
     * ```
     */
    static setIcons(icons: Partial<Record<Exclude<MessageType, 'notification'>, string | HTMLElement>>): void;
    /** 配置项 */
    options: MessageOptions;
    /** 挂载容器 */
    private _container;
    /** 消息根节点（铺满容器的点击穿透层） */
    private _$root;
    /** 独立 notification context 的挂载节点 */
    private _$notificationRoot;
    /** 当前展示中的消息列表 */
    private _items;
    /** 与普通消息分离的 notification context，列表顺序为从旧到新 */
    private _notificationItems;
    /** 确保后创建的 notification 始终覆盖先前通知 */
    private _notificationZIndex;
    private _destroyed;
    /**
     * @param container 挂载容器，支持 CSS 选择器、元素 ID 或 HTMLElement，缺省为 document.body。
     * 非 body 容器需为定位元素（position 非 static），消息相对它铺满定位。
     * @param options 配置项
     */
    constructor(container?: string | HTMLElement, options?: MessageOptions);
    /**
     * 弹出一条 toast info 消息。默认 3 秒后关闭
     * @param content 消息内容，字符串按 HTML 解析（innerHTML），不可信内容请传 HTMLElement
     * @param options 单条消息配置（duration / onClose 等）
     * @returns 消息 id（可传给 {@link Message.close} 手动关闭）
     *
     * @example
     * ```ts
     * message.info('这是一条信息');
     *
     * // 单条指定 5 秒后关闭，并在关闭后回调
     * message.info('即将重连', { duration: 5000, onClose: () => console.log('closed') });
     * ```
     */
    info(content: string | HTMLElement, options?: MessageItemOptions): string;
    /**
     * 弹出一条 toast success 消息。默认 3 秒后关闭
     * @param content 消息内容
     * @param options 单条消息配置
     * @returns 消息 id
     *
     * @example
     * ```ts
     * message.success('操作成功');
     * message.success('已保存', { duration: 1500 });
     * ```
     */
    success(content: string | HTMLElement, options?: MessageItemOptions): string;
    /**
     * 弹出一条 toast warn 消息。默认 3 秒后关闭
     * @param content 消息内容
     * @param options 单条消息配置
     * @returns 消息 id
     *
     * @example
     * ```ts
     * message.warn('请注意');
     * message.warn('网络不稳定', { duration: 0 }); // 不自动关闭
     * ```
     */
    warn(content: string | HTMLElement, options?: MessageItemOptions): string;
    /**
     * 弹出一条 toast error 消息。默认 3 秒后关闭
     * @param content 消息内容
     * @param options 单条消息配置
     * @returns 消息 id
     *
     * @example
     * ```ts
     * message.error('出错了');
     *
     * // 传入 HTMLElement 作为内容
     * const el = document.createElement('span');
     * el.textContent = '请求失败，请重试';
     * message.error(el);
     * ```
     */
    error(content: string | HTMLElement, options?: MessageItemOptions): string;
    /**
     * 弹出一条无图标且带关闭按钮的 notification 消息。
     * @param content 消息内容
     * @param options 单条消息配置
     * @returns 消息 id
     *
     * @example
     * ```ts
     * message.notification('设备 A 触发了移动侦测告警');
     *
     * // 持续显示，直到用户点击关闭按钮或调用 close(id)
     * const id = message.notification('新版本可用', { duration: 0 });
     * message.close(id);
     * ```
     */
    notification(content: string | HTMLElement, options?: MessageItemOptions): string;
    /**
     * 弹出一条消息（需在配置中指定 type / content）。默认 3 秒后关闭
     * @param options 消息配置
     * @returns 消息 id
     *
     * @example
     * ```ts
     * const id = message.open({ type: 'warn', content: '磁盘空间不足', duration: 0, onClose: () => console.log('closed') });
     * message.close(id);
     * ```
     */
    open(options: MessageItemOptions): string;
    /**
     * 弹出一条全屏消息：覆盖整个容器，图标与文案上下布局。默认 3 秒后关闭
     * @param content 消息内容
     * @param options 单条消息配置（type / duration / onClose 等）
     * @returns 消息 id
     *
     * @example
     * ```ts
     * // 非 body 容器需为定位元素（position 非 static）
     * const message = new Message('#player');
     *
     * // 默认 3 秒后自动关闭
     * message.full('加载中');
     *
     * // 指定类型；duration: 0 表示持续显示，之后通过关闭按钮或 close(id) 关闭
     * const id = message.full('设备离线', { type: 'error', duration: 0 });
     * message.close(id);
     * ```
     */
    full(content: string | HTMLElement, options?: MessageItemOptions): string;
    /**
     * 关闭指定消息；不传 id 时关闭全部。
     * @param id 消息 id（由 open / info 等方法返回）
     *
     * @example
     * ```ts
     * const id = message.info('处理中', { duration: 0 });
     * message.close(id); // 关闭指定消息
     * message.close(); // 关闭全部消息
     * ```
     */
    close(id?: string): void;
    /**
     * 清空全部消息（等价于 `close()`）。
     *
     * @example
     * ```ts
     * message.clear();
     * ```
     */
    clear(): void;
    /**
     * 更新配置。duration / maxCount 对后续新消息生效，position / zIndex / className 立即生效。
     * @param options 新配置
     *
     * @example
     * ```ts
     * // 后续新消息 5 秒后关闭，且最多同时显示 3 条；弹出位置立即切换到底部
     * message.updateOptions({ duration: 5000, maxCount: 3, position: 'bottom' });
     * ```
     */
    updateOptions(options: Partial<MessageOptions>): void;
    /**
     * 销毁实例：清除定时器、移除 DOM（幂等）。
     *
     * @example
     * ```ts
     * message.destroy();
     * ```
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
    /** 超出最大条数时，关闭对应 context 中最早的消息 */
    private _trim;
}

export { Message as default };
export type { MessageItem, MessageItemOptions, MessageOptions, MessagePosition, MessageType };
