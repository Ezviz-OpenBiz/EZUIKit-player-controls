/**
 * 当前渲染的可视索引范围
 */
interface VirtualScrollRange {
    /** 起始索引（含 buffer） */
    startIndex: number;
    /** 结束索引（含 buffer） */
    endIndex: number;
}
/**
 * VirtualScroll 配置项
 *
 * @typeParam T - 列表项数据类型
 */
interface VirtualScrollOptions<T = unknown> {
    /** 滚动容器，支持 CSS 选择器字符串或 HTMLElement */
    container?: string | HTMLElement;
    /** 列表数据；提供后 total 取 data.length，renderItem 第二参为 data[index] */
    data?: T[];
    /** 列表总条数（未提供 data 时使用） */
    total?: number;
    /**
     * 单项高度（px）。支持三种模式：
     * - `number`：固定高度（默认 40，O(1) 定位，性能最佳，适合十万级数据）；
     * - `(index, item) => number`：已知的不固定高度（无需测量，按索引返回精确高度）；
     * - 配合 `dynamicHeight: true`：内容高度不固定且无法预先计算，库会在渲染后测量真实 DOM 高度。
     */
    itemHeight?: number | ((index: number, item: T | undefined) => number);
    /**
     * 是否启用动态测量行高：当内容高度不固定且无法预先计算时开启。
     * 开启后库会在渲染后测量每行真实 DOM 高度，据此计算总高度与定位，并做滚动锚定避免跳动。
     * 默认 false。
     */
    dynamicHeight?: boolean;
    /**
     * 动态测量模式下「未测量项」的预估高度（px）。
     * 缺省时取 `itemHeight`（为数字时）或 40。预估越接近真实值，滚动条越稳定。
     */
    estimatedItemHeight?: number;
    /** 上下额外渲染的缓冲条数，默认 5 */
    buffer?: number;
    /** scrollToIndex 默认是否平滑滚动，默认 true */
    smooth?: boolean;
    /**
     * 渲染单项内容，返回 HTML 字符串或 HTMLElement。
     * 库会将其包裹进绝对定位的行容器中并复用 DOM。
     * @param index 数据索引
     * @param item 对应的数据项（未提供 data 时为 undefined）
     */
    renderItem: (index: number, item: T | undefined) => string | HTMLElement;
    /** 可视范围渲染变化回调 */
    onRender?: (range: VirtualScrollRange) => void;
    /** 滚动回调 */
    onScroll?: (scrollTop: number) => void;
}

/** 监听回调 */
type VirtualScrollListener = (...args: unknown[]) => void;
/**
 * 虚拟滚动列表（支持固定 / 不固定行高）。
 *
 * 只渲染可视区域（加缓冲）内的行，通过 DOM 复用池支撑大数据量的流畅滚动；
 * 行高支持三种模式：
 * - 固定高度（`itemHeight: number`）：O(1) 定位，性能最佳，可支撑十万级数据；
 * - 已知不固定高度（`itemHeight: (index, item) => number`）：前缀和定位，无需测量；
 * - 动态测量（`dynamicHeight: true`）：渲染后测量真实 DOM 高度，自动校正总高与定位并做滚动锚定。
 *
 * @typeParam T - 列表项数据类型
 * @example
 * ```ts
 * // 固定高度
 * const vs = new VirtualScroll(el, { total: 100000, itemHeight: 74, renderItem: (i) => `#${i}` });
 *
 * // 不固定高度（动态测量）
 * const vs2 = new VirtualScroll(el, {
 *   data,
 *   dynamicHeight: true,
 *   estimatedItemHeight: 80,
 *   renderItem: (i, item) => renderCard(item),
 * });
 * ```
 */
declare class VirtualScroll<T = unknown> {
    /** 构建时由 Rollup 注入版本号 */
    static VERSION: string;
    /** 事件常量 */
    static EVENTS: {
        readonly render: "render";
        readonly scroll: "scroll";
        readonly reachTop: "reachTop";
        readonly reachBottom: "reachBottom";
    };
    /** 配置项 */
    options: VirtualScrollOptions<T>;
    private _wrapper;
    private _eventEmitter;
    private _$content;
    private _$viewport;
    /** 当前在视口中的行：index -> 元素 */
    private _active;
    /** 可复用的空闲行节点池 */
    private _pool;
    /** 每项高度（仅不固定高度模式使用；动态模式初始为预估值，测量后校正） */
    private _heights;
    /** 高度前缀和：_prefix[i] = 第 i 项的顶部偏移；_prefix[total] = 总高度（仅不固定高度模式使用） */
    private _prefix;
    /** 前缀和是否需要重建 */
    private _prefixDirty;
    private _containerHeight;
    private _startIndex;
    private _endIndex;
    private _ticking;
    private _destroyed;
    private _resizeObserver;
    constructor(container: HTMLElement | string, options: VirtualScrollOptions<T>);
    /** 列表总条数 */
    getTotalCount(): number;
    /** 当前渲染的索引范围 */
    getCurrentRange(): VirtualScrollRange;
    /**
     * 滚动到指定索引（顶部对齐）
     * @param index 目标索引
     * @param smooth 是否平滑滚动，默认取 options.smooth
     * @returns 是否成功（索引越界返回 false）
     */
    scrollToIndex(index: number, smooth?: boolean): boolean;
    /** 滚动到顶部 */
    scrollToTop(smooth?: boolean): void;
    /** 滚动到底部 */
    scrollToBottom(smooth?: boolean): void;
    /**
     * 更新数据源并重新渲染
     * @param data 新数据
     */
    setData(data: T[]): void;
    /**
     * 更新总条数（数据由 renderItem 按 index 提供时使用）
     * @param total 新总条数
     */
    setTotal(total: number): void;
    /**
     * 重新计算并强制重渲染（数据/高度变化后调用）
     */
    refresh(): void;
    /**
     * 更新配置
     * @param options 新配置
     */
    updateOptions(options: Partial<VirtualScrollOptions<T>>): void;
    /**
     * 监听事件
     * @param event 事件名（见 VirtualScroll.EVENTS）
     * @param callback 回调
     */
    on(event: string, callback: VirtualScrollListener): void;
    /**
     * 取消监听
     * @param event 事件名
     * @param callback 回调
     */
    off(event: string, callback?: VirtualScrollListener): void;
    /**
     * 销毁，移除事件与 DOM
     */
    destroy(): void;
    private _resolveContainer;
    /** 是否启用动态测量行高 */
    private get _dynamic();
    /** 是否为不固定高度模式（动态测量 或 itemHeight 为函数） */
    private get _variable();
    /** 固定高度值（仅固定模式有效） */
    private get _fixedHeight();
    private get _buffer();
    /** 动态模式下未测量项的预估高度 */
    private _estimated;
    /** 某项的基础高度：函数模式取函数返回值；动态模式取预估值 */
    private _baseHeightAt;
    /** 初始化每项高度与前缀和（仅不固定高度模式构建数组；固定模式清空以节省内存） */
    private _initHeights;
    /** 按需重建前缀和（O(n)，仅在高度变化后触发） */
    private _ensurePrefix;
    /** 第 index 项的顶部偏移（px） */
    private _offsetOf;
    /** 第 index 项的高度（px） */
    private _heightOf;
    /** 列表总高度（px） */
    private _totalHeight;
    /**
     * 根据滚动位置查找其所在项索引（不固定高度模式：前缀和二分查找；固定模式：除法）。
     * @param scrollTop 滚动位置（px）
     */
    private _findStartIndex;
    private _syncContentHeight;
    private _onScroll;
    private _setupResizeObserver;
    private _onResize;
    /** 计算可视范围并按需更新 DOM */
    private _compute;
    /**
     * 动态模式：测量当前活动项的真实高度，若与记录不一致则校正高度、前缀和、总高度与各项定位，
     * 并对滚动位置做锚定，避免上方项高度变化导致的视觉跳动。
     * @returns 是否发生了高度变化
     */
    private _measureAndAdjust;
    /** 按当前偏移重新定位所有活动项（前缀和变化后调用） */
    private _repositionActive;
    /** 复用池 + 增删，使视口仅保留 [start, end] 行 */
    private _updateRange;
    private _createItemEl;
    /** 用 renderItem 填充行内容 */
    private _fillItem;
    /** 清空所有行与池 */
    private _reset;
}

/**
 * VirtualScroll 事件常量，所有合法事件名必须在此声明。
 */
declare const EVENTS: {
    /** 可视范围渲染变化，回调 { startIndex, endIndex } */
    readonly render: "render";
    /** 滚动，回调 scrollTop */
    readonly scroll: "scroll";
    /** 滚动到顶部 */
    readonly reachTop: "reachTop";
    /** 滚动到底部 */
    readonly reachBottom: "reachBottom";
};
/** 事件名联合类型 */
type VirtualScrollEventName = (typeof EVENTS)[keyof typeof EVENTS];

export { VirtualScroll as default };
export type { VirtualScrollEventName, VirtualScrollOptions, VirtualScrollRange };
