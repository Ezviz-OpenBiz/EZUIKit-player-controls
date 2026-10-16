/**
 * 弹框位置坐标点（以视口左上角为原点，单位 px）
 */
interface ModalPosition {
    /** 距视口左侧距离（px） */
    x: number;
    /** 距视口顶部距离（px） */
    y: number;
}
/**
 * Modal 配置项
 */
interface ModalOptions {
    /** 标题，支持字符串或 HTMLElement */
    title?: string | HTMLElement;
    /** 内容，支持字符串（HTML）或 HTMLElement */
    content?: string | HTMLElement;
    /** 弹框宽度，number 视为 px，默认 420 */
    width?: number | string;
    /** 弹框高度，number 视为 px，默认 auto */
    height?: number | string;
    /**
     * 弹框展示位置：
     * - `'center'`（默认）：在视口中居中；
     * - `{ x, y }`：以视口左上角为原点的坐标（px），会自动约束在页面可视范围内，不会超出页面。
     */
    position?: 'center' | ModalPosition;
    /** 是否允许拖动（拖动标题栏），默认 true */
    draggable?: boolean;
    /** 是否展示遮罩层，默认 true */
    showMask?: boolean;
    /** 点击遮罩层是否关闭，默认 true */
    maskClosable?: boolean;
    /** 是否展示头部（标题栏，含标题与关闭按钮，也是拖动手柄），默认 true */
    showHeader?: boolean;
    /** 是否展示右上角关闭(X)按钮，默认 true */
    showClose?: boolean;
    /** 按下 Esc 是否关闭，默认 true */
    closeOnEscape?: boolean;
    /** 创建后是否立即打开，默认 false。仅构造时读取，之后通过实例的 `open` 属性打开 / 关闭 */
    open?: boolean;
    /** 层级，默认 1000 */
    zIndex?: number;
    /** 追加到弹框根节点的自定义类名 */
    className?: string;
    /** 打开回调（打开并定位之后调用） */
    onOpen?: () => void;
    /** 关闭回调（关闭按钮、Esc、点击遮罩或 `open = false`；销毁时不调用） */
    onClose?: () => void;
    /** 开始拖动回调（在标题栏按下鼠标左键或触摸时） */
    onDragStart?: () => void;
    /** 拖动中回调：每帧最多一次，参数为约束到视口内后的位置 */
    onDragging?: (position: ModalPosition) => void;
    /** 结束拖动回调（松开鼠标或触摸结束），参数为最终位置 */
    onDragEnd?: (position: {
        left: number;
        top: number;
    }) => void;
    /** Dom 节点初始化成功 */
    onInitSuccess?: () => void;
}

/**
 * Modal 弹框控件。
 *
 * 特性：
 * 1. 支持右上角 X 关闭、Esc 关闭、点击遮罩关闭；
 * 2. 支持拖动标题栏移动窗口，约束在视口内；
 * 3. 多实例时后创建在最上层，点击任意弹框自动置顶（bringToTop）；
 * 4. 通过 ModalProvider 单例统一管理所有实例的注册与 z-index 分配；
 * 5. 不提供事件订阅，打开 / 关闭 / 拖动通过配置项中的回调通知（`onOpen` / `onClose` / `onDragStart` / `onDragging` / `onDragEnd`）。
 *
 * @example
 * ```ts
 * const modal = new Modal('#app', {
 *   title: '提示',
 *   content: '<p>Hello</p>',
 *   onClose: () => console.log('closed'),
 *   onDragEnd: ({ left, top }) => console.log(left, top),
 * });
 * modal.open = true; // 打开
 * modal.open = false; // 关闭
 * ```
 */
declare class Modal {
    /** 构建时由 Rollup 注入版本号 */
    static VERSION: string;
    /** 关闭按钮图标 */
    private static readonly _CLOSE_ICON_;
    /** 配置项 */
    options: ModalOptions;
    private _container;
    /** 当前实例的 z-index 基础值（由 ModalProvider 分配，mask 用 base，wrap 用 base + 1） */
    private _baseZIndex;
    private _$mask;
    private _$wrap;
    private _$header;
    private _$title;
    private _$body;
    private _$close;
    private _open;
    private _dragging;
    private _dragOffset;
    private _destroyed;
    /** 拖动开始时缓存的可移动边界，避免每次 move 读取布局造成强制回流（layout thrashing） */
    private _dragBounds;
    /** 拖动中最近一次指针位置（由 rAF 消费） */
    private _dragPoint;
    /** 拖动 rAF 句柄：将高频 move 合并为每帧最多一次 DOM 写入 */
    private _dragRafId;
    /** 当前位置（通过 transform 位移），避免拖动/缩放时读取 getBoundingClientRect */
    private _pos;
    /**
     * @param container 挂载容器，支持 CSS 选择器字符串或 HTMLElement，默认 document.body
     * @param options 配置项
     */
    constructor(container?: string | HTMLElement, options?: ModalOptions);
    /**
     * 打开 / 关闭弹框。
     *
     * - 打开（`true`）：显示遮罩与弹框，按 `options.position` 定位并约束在视口内，调用 `onOpen`；
     * - 关闭（`false`）：隐藏遮罩与弹框并结束进行中的拖动，调用 `onClose`。
     *
     * 非布尔值按真假值处理；重复设置相同状态、或在 {@link Modal.destroy} 之后设置均无效果。
     */
    set open(open: boolean);
    /**
     * 当前是否处于打开状态（销毁后为 false）
     */
    get open(): boolean;
    /**
     * 将当前弹框置顶（z-index 层级最高）
     */
    bringToTop(): void;
    /**
     * 设置标题, 支持 string | HTMLElement
     * @param title 字符串或 HTMLElement
     */
    setTitle(title: string | HTMLElement): void;
    /**
     * 设置内容， 支持 string | HTMLElement
     * @param content 字符串（HTML）或 HTMLElement
     */
    setContent(content: string | HTMLElement): void;
    /**
     * 更新配置
     * @param options 新配置
     */
    updateOptions(options: Partial<ModalOptions>): void;
    /** 设置位置并约束到视口范围内（窗口不允许超出页面区域） */
    setPosition(left: number, top: number, bounds?: {
        maxLeft: number;
        maxTop: number;
    }): ModalPosition;
    /**
     * 销毁，释放 DOM 与监听并从 ModalProvider 注销（幂等）。
     * 销毁时不调用 `onClose`，之后 `open` 恒为 false。
     */
    destroy(): void;
    /**
     * 打开 / 关闭状态切换后的扩展点，供子类覆盖（默认什么也不做），通过 `this.open` 读取切换后的状态。
     *
     * 只在状态真正变化时调用，包括构造时 `options.open` 打开（此时子类构造函数尚未执行完）
     * 与 `updateOptions` 重建后恢复打开；调用时 `onOpen` / `onClose` 已执行。
     *
     * 子类请覆盖本方法，不要重写 `open` 访问器：构建产物（swc 编译到 ES5）会把访问器里的 `super.open`
     * 编译成 `Modal.prototype.open`、把 `super.open = value` 编译成 `this.open = value`，前者读错状态，后者无限递归。
     */
    protected _afterOpenChange(): void;
    private _resolveContainer;
    private _toSize;
    private _render;
    private _mount;
    private _teardownDom;
    private _bindEvents;
    private _onCloseClick;
    private _onMaskClick;
    private _onModalPointerDown;
    /** 阻止弹框内双击冒泡到播放器容器触发全屏切换 */
    private _onWrapDblClick;
    private _onKeydown;
    private _onWindowResize;
    private _getPoint;
    private _onHeaderPointerDown;
    private _onPointerMove;
    /** rAF 回调：每帧最多写入一次位置（使用拖动开始时缓存的边界，不触发强制回流） */
    private _onDragFrame;
    private _onPointerUp;
    private _stopDragging;
    /** 视口内可用的最大左/上偏移 */
    private _bounds;
    /** 通过 transform 位移定位（GPU 合成，不触发布局），并记录当前位置 */
    private _setTranslate;
    /** 居中显示并约束到视口内 */
    private _center;
    /**
     * 按 options.position 应用初始位置：
     * - 'center'（默认）：视口居中；
     * - { x, y }：使用坐标定位（由 {@link setPosition} 约束在视口内，不会超出页面）。
     */
    private _applyInitialPosition;
}

export { Modal as default };
export type { ModalOptions, ModalPosition };
