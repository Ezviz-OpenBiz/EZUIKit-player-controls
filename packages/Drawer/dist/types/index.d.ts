/**
 * 抽屉弹出方向
 */
type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
/**
 * 动态挂载点解析函数：返回挂载元素；返回 null / undefined 时回退到构造函数传入的 container。
 */
type DrawerContainerGetter = () => HTMLElement | null | undefined;
/**
 * Drawer 配置项
 */
interface DrawerOptions {
    /** 标题：字符串按 HTML 插入（须为可信内容），也可传 HTMLElement */
    title?: string | HTMLElement;
    /** 内容：字符串按 HTML 插入（须为可信内容），也可传 HTMLElement */
    content?: string | HTMLElement;
    /** 弹出方向，默认 'right' */
    placement?: DrawerPlacement;
    /** 面板宽度，placement 为 left / right 时生效；number 视为 px，默认 300 */
    width?: number | string;
    /** 面板高度，placement 为 top / bottom 时生效；number 视为 px，默认 300 */
    height?: number | string;
    /** 是否展示遮罩，默认 true */
    showMask?: boolean;
    /** 点击遮罩是否关闭，默认 true */
    maskClosable?: boolean;
    /** 是否展示头部（标题 + 关闭按钮），默认 true */
    showHeader?: boolean;
    /** 是否展示关闭(X)按钮（位于头部，showHeader 为 false 时无效），默认 true */
    showClose?: boolean;
    /** 按下 Esc 是否关闭，默认 true */
    closeOnEscape?: boolean;
    /** 开合动画时长（ms），默认 300；非有限数或负数回退到默认值。会写入根节点的 `--edrawer-duration`，使 CSS 过渡与 JS 定时器一致 */
    duration?: number;
    /** 创建后是否立即打开，默认 false（仅构造时生效） */
    open?: boolean;
    /** 根节点层级，缺省使用样式变量 `--edrawer-z-index`（默认 100） */
    zIndex?: number;
    /** 追加到根节点的自定义类名，多个用空格分隔 */
    className?: string;
    /**
     * 动态挂载点。配置后首次 open() 前不挂载 DOM，每次 open() 时调用它决定挂载位置，
     * 返回 null / undefined 时回退到 container。适用于挂载点晚于控件创建才出现的场景（如移动端扩展区）。
     */
    getContainer?: DrawerContainerGetter;
    /** 打开/关闭回调 */
    onOpenChange?: (open: boolean) => void;
    /** 打开开始回调（打开动画开始前同步触发） */
    onOpenStart?: () => void;
    /** 打开结束回调（打开过渡结束后触发） */
    onOpenEnd?: () => void;
    /** 关闭开始回调（关闭动画开始前同步触发） */
    onCloseStart?: () => void;
    /** 关闭结束回调（关闭过渡结束、根节点隐藏后触发） */
    onCloseEnd?: () => void;
}

/**
 * Drawer 抽屉布局控件。
 *
 * 只负责抽屉的布局骨架，业务内容通过 `content` / {@link Drawer.setContent} 注入：
 * 1. 遮罩 + 从左 / 右 / 上 / 下滑出的面板，带开合过渡动画；
 * 2. 头部（标题 + 关闭按钮），支持点击遮罩、Esc 关闭；
 * 3. 默认相对挂载容器定位（容器需为定位元素），挂载到 document.body 时相对视口定位；
 * 4. 支持通过 `getContainer` 在每次打开时动态解析挂载点（如移动端扩展区）。
 *
 * @example
 * ```ts
 * const drawer = new Drawer('#player', {
 *   title: '告警消息',
 *   content: listElement,
 *   placement: 'right',
 *   width: 300,
 * });
 * drawer.open = true; // 打开
 * drawer.open = false; // 关闭
 * drawer.destroy();
 * ```
 *
 * 无事件订阅机制，状态变化通过配置项回调通知：`onOpenChange`、`onOpenStart` / `onOpenEnd`、`onCloseStart` / `onCloseEnd`。
 */
declare class Drawer {
    /** 构建时由 Rollup 注入版本号 */
    static VERSION: string;
    /** 配置项 */
    options: DrawerOptions;
    /** 默认挂载容器 */
    private _container;
    private _$root;
    private _$mask;
    private _$title;
    private _$close;
    private _$body;
    /** 标题节点 id（面板 aria-labelledby 引用） */
    private readonly _titleId;
    private _open;
    private _destroyed;
    /** 收起动画结束后隐藏根节点的定时器 */
    private _hideTimer;
    /** 打开动画结束后回调的定时器 */
    private _openTimer;
    /** 当前注册了 Esc 监听的 document（容器可能在 iframe 等其它文档内，需与注册时一致才能正确移除） */
    private _keydownDoc;
    /**
     * @param container 默认挂载容器，支持 CSS 选择器、元素 ID 或 HTMLElement，缺省或找不到时为 document.body。
     * 非 body 容器需为定位元素（position 非 static），抽屉相对它铺满定位。
     * @param options 配置项
     *
     * @example
     * ```ts
     * // 元素 ID / CSS 选择器 / HTMLElement 均可；缺省挂载到 document.body（fixed 定位）
     * const drawer = new Drawer('#player', { title: '告警消息', placement: 'right', width: 300 });
     *
     * // 底部抽屉，挂载点晚于控件创建才出现：每次打开时通过 getContainer 解析
     * const mobile = new Drawer(playerEl, {
     *   placement: 'bottom',
     *   height: '100%',
     *   showMask: false,
     *   getContainer: () => document.querySelector<HTMLElement>('.ezplayer-mobile-extend'),
     * });
     * ```
     */
    constructor(container?: string | HTMLElement, options?: DrawerOptions);
    /**
     * 应用构造配置 `open: true`（配置为 false 或缺省时不做任何事）。
     *
     * 直接 `new Drawer()` 时由构造函数自动调用；**子类不会被自动调用**，需在自己的构造函数末尾
     * （自身字段与回调都初始化完成之后）手动调用一次，否则 `open: true` 对子类不生效。
     *
     * @example
     * ```ts
     * class MyDrawer extends Drawer {
     *   private readonly logs: string[] = [];
     *
     *   constructor(container: HTMLElement, options: DrawerOptions) {
     *     super(container, options);
     *     this.options.onOpenChange = (open) => this.logs.push(`open=${open}`);
     *     this.applyInitialOpen(); // 所有字段与回调就绪后再按配置打开
     *   }
     * }
     * ```
     */
    protected applyInitialOpen(): void;
    /**
     * 打开/关闭抽屉。配置了 `getContainer` 时，会先解析本次挂载点并在需要时移动 DOM。
     * 重复设置相同状态、销毁后设置均为空操作；`getContainer` 抛错时状态保持不变。
     *
     * @example
     * ```ts
     * const drawer = new Drawer('#player', {
     *   onOpenChange: (open) => console.log('open =', open),
     *   onCloseEnd: () => console.log('收起动画结束'),
     * });
     * drawer.open = true; // 打开：onOpenStart → onOpenChange(true) → onOpenEnd
     * drawer.open = true; // 重复设置，空操作
     * drawer.open = !drawer.open; // 切换（此时为关闭）
     * ```
     */
    set open(open: boolean);
    /**
     * 当前是否处于打开状态（关闭动画进行中已视为关闭）
     *
     * @example
     * ```ts
     * if (drawer.open) drawer.open = false;
     * ```
     */
    get open(): boolean;
    /**
     * 设置标题（showHeader 为 false 时仅更新配置）
     * @param title 字符串（按 HTML 插入，须为可信内容）或 HTMLElement
     *
     * @example
     * ```ts
     * drawer.setTitle('告警消息（3）');
     *
     * const title = document.createElement('strong');
     * title.textContent = '告警消息';
     * drawer.setTitle(title);
     * ```
     */
    setTitle(title: string | HTMLElement): void;
    /**
     * 设置内容
     * @param content 字符串（按 HTML 插入，须为可信内容）或 HTMLElement
     *
     * @example
     * ```ts
     * drawer.setContent('<p>暂无数据</p>');
     *
     * const list = document.createElement('ul');
     * drawer.setContent(list); // 节点被移入内容区，引用与其上的监听保留
     * ```
     */
    setContent(content: string | HTMLElement): void;
    /**
     * 更新配置。方向、尺寸、遮罩、头部等结构性配置通过重建 DOM 生效，
     * 重建后保持当前打开 / 关闭状态（直接处于终态，不重播动画）；`open` 仅在构造时生效。
     * @param options 新配置
     *
     * @example
     * ```ts
     * // 切换弹出方向与尺寸：重建 DOM，保持当前开合状态且不重播动画
     * drawer.updateOptions({ placement: 'bottom', height: '60%' });
     *
     * // 只改文案请用 setTitle / setContent，避免重建 DOM 重置内容区滚动位置
     * drawer.updateOptions({ closeOnEscape: false, maskClosable: false });
     * ```
     */
    updateOptions(options: Partial<DrawerOptions>): void;
    /**
     * 销毁，移除 DOM、定时器与全部监听（幂等）。销毁时不会触发任何回调。
     *
     * @example
     * ```ts
     * drawer.destroy();
     * drawer.destroy(); // 幂等
     * drawer.open = true; // 销毁后无效
     * ```
     */
    destroy(): void;
    private _resolveContainer;
    /** 按 CSS 选择器查找元素，非法选择器返回 null 而不是抛错 */
    private _query;
    /** 本次打开的挂载点：优先 getContainer()，为空时回退到默认容器 */
    private _resolveMountTarget;
    /** 将根节点挂载到目标容器（已在该容器内则不移动） */
    private _attach;
    /** 规范化弹出方向，非法值回退到 right */
    private _getPlacement;
    /** 开合动画时长（ms）：非有限数或负数回退到默认值，避免 `NaN` 写入 CSS 变量与定时器 */
    private _getDuration;
    private _toSize;
    private _render;
    /** 将字符串（HTML）或节点写入目标元素 */
    private _mount;
    /** 移除 DOM 与元素级监听，并释放全部节点引用 */
    private _teardownDom;
    private _clearTimers;
    /** 在根节点所属文档上注册 Esc 监听（容器可能位于 iframe 等其它文档内，监听必须挂在同一文档才能收到按键） */
    private _bindEscape;
    /** 从注册时的文档上移除 Esc 监听（幂等） */
    private _unbindEscape;
    /** 读取布局属性以强制浏览器回流 */
    private _reflow;
    private readonly _onCloseClick;
    private readonly _onMaskClick;
    /** 阻止抽屉内双击冒泡到播放器容器触发全屏切换 */
    private readonly _onRootDblClick;
    private readonly _onKeydown;
}

export { Drawer as default };
export type { DrawerContainerGetter, DrawerOptions, DrawerPlacement };
