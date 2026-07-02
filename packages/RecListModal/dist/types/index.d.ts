import Modal, { ModalOptions } from '@ezuikit/control-modal';

/**
 * 录像片段数据项。
 *
 * 结构与时间轴的录像片段兼容，调用方可直接传入时间轴的片段数组。
 */
interface Segment {
    /** 开始时间（毫秒时间戳） */
    startTime: number;
    /** 结束时间（毫秒时间戳） */
    endTime: number;
    /** 封面图片地址 */
    coverPic?: string;
    /** 其它自定义字段（如 recType、count 等） */
    [key: string]: number | string | undefined;
}
/**
 * 录像片段列表弹框配置项。
 *
 * 继承自 {@link ModalOptions}，并扩展了录像列表渲染相关的配置。
 */
interface RecListModalOptions extends ModalOptions {
    /** 录像片段列表（按 startTime 升序展示，内部会自动排序并按小时分组） */
    sections?: Segment[];
    /**
     * 激活态对应的时间（毫秒时间戳）。当该时间落在某卡片的 [startTime, endTime] 范围内时，
     * 该卡片高亮为激活态；未设置或不在任何卡片范围内时无激活卡片。可用 {@link setActiveTime} 动态更新。
     */
    activeTime?: number;
    /**
     * 弹框高度（继承自 {@link ModalOptions#height}），列表可视区高度 = 弹框高度 − 头部高度。
     * number 视为 px，默认 490（列表区约 442 + 头部 48）。
     */
    height?: number | string;
    /** 虚拟滚动上下额外渲染的缓冲行数，默认 3 */
    buffer?: number;
    /** 封面图片地址后追加的查询参数（需自带分隔符，如 `?token=xxx`），默认空 */
    coverQuery?: string;
    /** 卡片左上角开始时间格式，默认 'HH:mm' */
    startTimeFormat?: string;
    /** 小时分组标题格式，默认 'HH:00' */
    groupTitleFormat?: string;
    /** 列表为空时的占位文案，默认根据语言取“暂无录像”/“No recordings” */
    emptyText?: string;
    /** 是否在标题栏展示「事件」过滤勾选框，默认 true */
    showEventFilter?: boolean;
    /** 「事件片段」过滤勾选框文案，默认根据语言取“事件片段”/“Event clips” */
    eventFilterText?: string;
    /** 「事件」过滤勾选框默认是否勾选（勾选后仅展示事件录像），默认 false */
    eventFilterChecked?: boolean;
    /** 是否在卡片右下角展示类型图标，默认 true */
    showCardTypeIcon?: boolean;
    /**
     * 判定某录像片段是否为「事件」录像，用于「事件」过滤与卡片类型图标。
     * 默认：`recType === 1`。
     */
    isEvent?: (section: Segment) => boolean;
    /**
     * 自定义卡片右下角图标（返回 HTML 字符串）。缺省时按是否事件录像取内置图标。
     */
    renderCardIcon?: (section: Segment) => string;
    /** 卡片点击回调 */
    onCardClick?: (section: Segment, index: number) => void;
}

/**
 * 录像列表弹框。
 *
 * 特性：
 * 1. 继承 {@link Modal}（`@ezuikit/control-modal`），复用其拖动、关闭、遮罩、定位等能力；
 * 2. 录像图片列表使用 {@link VirtualScroll}（`@ezuikit/control-virtual-scroll`）渲染，支持大数据量；
 * 3. 录像图片使用 {@link ImageLazyLoader} 懒加载，滚动进入可视区才真正加载；
 * 4. 录像图片按「小时」分组展示，每组带分组标题；
 * 5. 每张卡片左上角展示开始时间，右上角展示时长（右下角展示类型图标）；
 * 6. 标题栏提供「事件」过滤勾选框，勾选后仅展示事件录像。
 *
 * @example
 * ```ts
 * const modal = new RecListModal(container, {
 *   sections,
 *   onCardClick: (section) => console.log(section),
 * });
 * modal.open();
 * ```
 */
declare class RecListModal extends Modal {
    /** 构建时由 Rollup 注入版本号 */
    static VERSION: string;
    /** 录像列表弹框配置项 */
    recordOptions: Required<Omit<RecListModalOptions, keyof ModalOptions | 'onCardClick' | 'isEvent' | 'renderCardIcon' | 'activeTime'>> & Pick<RecListModalOptions, 'onCardClick' | 'isEvent' | 'renderCardIcon'>;
    /** 标题文案 */
    private _titleText;
    /** 多语言实例（内置 zh/en，可通过 options.locales 扩展/覆盖，options.language 指定当前语言） */
    private _recI18n;
    /** 标题栏容器节点 */
    private _$titleWrap;
    /** 列表根节点（同时作为 VirtualScroll 的滚动容器） */
    private _$listRoot;
    /** 空列表占位节点 */
    private _$empty;
    /** 「事件」过滤复选框 */
    private _eventCheckbox;
    /** 虚拟滚动实例 */
    private _virtualScroll;
    /** 图片懒加载实例 */
    private _lazyLoader;
    /** 扁平化后的虚拟列表行 */
    private _rows;
    /** 过滤排序后的有效录像片段（卡片点击时按 index 回查） */
    private _sortedSections;
    /** 是否仅展示事件录像（「事件」过滤勾选框状态） */
    private _eventOnly;
    /** 虚拟滚动是否已初始化（首次 open 后才初始化，避免隐藏态测量高度为 0） */
    private _vsInited;
    /** 是否已销毁 */
    private _recordDestroyed;
    /** 激活态时间（毫秒时间戳）：落在某卡片时间范围内则该卡片高亮 */
    private _activeTime?;
    /** 当前激活卡片在 _sortedSections 中的索引（-1 表示无）：仅当其变化时才自动滚动 */
    private _activeIndex;
    /** 用户是否正在手动滚动（滚动期间暂停自动滚动到激活卡片） */
    private _userInteracting;
    /** 用户滚动后恢复自动滚动的计时器 */
    private _userScrollTimer;
    /**
     * @param container 挂载容器，支持 CSS 选择器字符串或 HTMLElement，默认 document.body
     * @param options 配置项
     */
    constructor(container?: string | HTMLElement, options?: RecListModalOptions);
    /**
     * 从配置中抽取并补齐 Modal 相关配置（content / title 由本类内部接管）。
     * @param options 录像弹框配置
     * @returns Modal 配置
     */
    private static _mergeModalOptions;
    /**
     * 打开弹框。隐藏态下 VirtualScroll 无法测量高度，这里在展示后再初始化/刷新。
     */
    open(): void;
    /**
     * 更新录像片段列表并重新渲染。
     * @param sections 新的录像片段列表
     */
    setSections(sections: Segment[]): void;
    /**
     * 设置激活态时间。落在某卡片 [startTime, endTime] 范围内时该卡片高亮；
     * 传入 undefined 或不在任何范围内则无激活卡片。仅更新已渲染卡片的高亮，不触发列表重建。
     * @param time 秒时间戳
     */
    setActiveTime(time?: number): void;
    /**
     * 动态控制「事件」过滤勾选框的展示与隐藏。
     * @param show 是否展示
     */
    showEventFilter(show: boolean): void;
    /**
     * 销毁，释放 VirtualScroll、懒加载与 DOM 事件。
     */
    destroy(): void;
    /** 卡片行高度：卡片高度 + 行间距 */
    private get _cardRowHeight();
    /** 某一行（虚拟列表项）的已知高度：分组标题为固定值，卡片行为卡片高度 + 行间距 */
    private _rowHeight;
    /** 构建标题栏内容（标题文案 + 可选「事件」过滤复选框） */
    private _buildHeaderTitle;
    /** 「事件」过滤复选框变化：切换过滤并重建列表 */
    private _onEventFilterChange;
    /**
     * 首次可见时初始化 VirtualScroll；已初始化则刷新（隐藏->显示后高度变化）。
     */
    private _ensureVirtualScroll;
    /** 根据是否有数据切换空占位显隐 */
    private _toggleEmpty;
    /** 判定录像片段是否为「事件」录像 */
    private _isEvent;
    /**
     * 将录像片段过滤、按 startTime 升序排序，并按「小时」分组扁平化为虚拟列表行。
     */
    private _buildRows;
    /**
     * 渲染单行（小时标题 或 一行卡片），返回 HTML 字符串。
     * @param _index 行索引
     * @param row 行数据
     */
    private _renderRow;
    /**
     * 渲染单张录像卡片。
     * @param section 录像片段
     * @param index 在排序后列表中的索引（用于点击回查）
     */
    private _renderCard;
    /** 判断某卡片是否处于激活态（激活时间落在其 [startTime, endTime] 范围内） */
    private _isActive;
    /** 根据当前激活时间，切换已渲染卡片的激活态类名（不重建列表，供播放时高频调用） */
    private _refreshActiveState;
    /** 查找当前激活卡片在排序列表中的索引（无则 -1） */
    private _findActiveIndex;
    /** 查找包含指定卡片的虚拟列表行索引（无则 -1） */
    private _rowIndexOfSection;
    /**
     * 滚动到激活卡片所在行。
     * @param force 为 true 时强制滚动（用于每次打开）：忽略「激活卡片未变化」与「用户正在手动滚动」的限制。
     */
    private _scrollToActive;
    /** 用户手动滚动（滚轮/触摸）：暂停自动滚动，静默一段时间后恢复 */
    private _onUserScroll;
    /** 渲染卡片右下角类型图标 */
    private _renderCardIcon;
    /** 观察当前可视区内尚未加载的图片（VirtualScroll 复用 DOM，需每次渲染后补观察） */
    private _observeVisibleImages;
    /** 列表点击委托：命中卡片则回调 onCardClick */
    private _onListClick;
    /** 转义 HTML 文本，避免注入 */
    private _escape;
    private _setImageScr;
}

export { RecListModal as default };
export type { RecListModalOptions, Segment };
