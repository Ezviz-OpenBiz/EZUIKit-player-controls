import I18n, { I18nTranslation } from '@ezuikit/utils-i18n';

/**
 * Theme type model for the TimeLine library.
 *
 * This module is intentionally DOM-free so the theme resolution pipeline can be
 * shared by both renderers and independently unit/property tested.
 *
 * Task 1.2 declares the type model only. Presets, the resolution pipeline, and
 * serialization helpers are added in later tasks.
 */
/** A canvas color value. DOM tokens are always strings. */
type CanvasColor = string | CanvasGradient | CanvasPattern;
/** Color tokens shared by both renderers. */
interface ThemeColors {
    /** Current-time pointer line color (canvas) / current tip line (mobile). */
    timePoint: CanvasColor;
    /** Scale text color. */
    timeText: CanvasColor;
    /** Scale line color (PC). Mobile uses 'transparent'. */
    timeScale: CanvasColor;
    /** Recorded-section fill color. */
    timeSection: CanvasColor;
    /** Axis background color (PC fill / mobile axis border color). */
    timeAxisBg: CanvasColor;
    /** Current-time label background/content color (mobile). */
    currentTimeBg: string;
    /** Current-time label text color (mobile). */
    currentTime: string;
    /** ---- DOM-only tokens (drive CSS custom properties in index.scss) ---- */
    /** Operation +/- button border color. */
    opBtnBorder: string;
    /** Operation +/- button active (pressed) color. */
    opBtnActive: string;
    /** Disabled operation button border color. */
    opBtnDisabledBorder: string;
    /** Picker header text color. */
    pickerHeader: string;
    /** Picker close icon color. */
    pickerClose: string;
    /** Picker close icon active color. */
    pickerCloseActive: string;
    /** Picker item title color. */
    pickerItemTitle: string;
    /** Cover-fold placeholder back layer color. */
    coverFoldPlaceholderBack: string;
    /** Cover-fold placeholder front layer color. */
    coverFoldPlaceholderFront: string;
    /** Cover-fold image overlay color. */
    coverFoldOverlay: string;
    /** Item-cover placeholder gradient start color. */
    itemCoverPlaceholderStart: string;
    /** Item-cover placeholder gradient end color. */
    itemCoverPlaceholderEnd: string;
    /** PC 鼠标悬停时间气泡背景色。 */
    hoverTipBg: string;
    /** PC 鼠标悬停时间气泡文字色。 */
    hoverTipColor: string;
    /** PC 鼠标悬停位置竖线颜色。 */
    hoverLineColor: string;
    /** PC 当前中心位置指示（竖线+三角）颜色，默认白色。 */
    centerLineColor: string;
}
/** Font tokens for the PC canvas. */
interface ThemeFont {
    /** Base font size in CSS pixels (before dpr scaling). Default 12. */
    canvasFontSize: number;
    /** Font family used for canvas text. Default 'serif'. */
    canvasFontFamily: string;
}
/** Size tokens. */
interface ThemeSizes {
    /** Line width (CSS px, before dpr scaling) for scale lines. Default 1. */
    scaleLineWidth: number;
    /** Mobile axis border width token (maps to $mobile-axis-width). Default 12. */
    mobileAxisWidth: number;
}
interface Theme {
    colors: ThemeColors;
    font: ThemeFont;
    sizes: ThemeSizes;
}
/** Deeply-partial theme accepted from users. */
interface PartialTheme {
    colors?: Partial<ThemeColors>;
    font?: Partial<ThemeFont>;
    sizes?: Partial<ThemeSizes>;
}
/** Built-in preset names. */
type PresetThemeName = 'light' | 'dark';
/**
 * The value accepted by the `theme` option and the Theme_API.
 * - a preset name ('light' | 'dark')
 * - a partial theme object (merged over the default preset)
 * - { preset, ...partial } to combine a named base with overrides
 */
type ThemeOption = PresetThemeName | PartialTheme | ({
    preset?: PresetThemeName;
} & PartialTheme);
/** Fully-populated theme — every token defined. */
type ResolvedTheme = Theme;
/** Registry of built-in preset themes, keyed by preset name. */
declare const PRESET_THEMES: Record<PresetThemeName, ResolvedTheme>;
/** All built-in preset names, so a developer can reference them. */
declare const PRESET_THEME_NAMES: PresetThemeName[];
/** Default preset used when no preset is named in a theme option. */
declare const DEFAULT_PRESET: PresetThemeName;

/**
 * 时间片段
 * @internal
 */
interface TimeLineTimeSection {
    /** 开始时间 */
    startTime: number;
    /** 结束时间 */
    endTime: number;
    /** 封面图片 */
    coverPic: string | undefined;
    [key: string]: number | string | undefined;
}
interface BaseTimeLineOptions {
    /** 默认当天 00:00:00 */
    current?: Date;
    /** 语言, 默认 zh */
    language?: 'zh' | 'en';
    /** 多语言 */
    locales?: I18nTranslation;
    /** 时间片段列表， 默认 [] */
    timeSections?: TimeLineTimeSection[];
    /** 时间轴刻度， 默认 0， [0, 4] */
    timeWidth?: number;
    /** 只读（不能拖动）， 默认 false */
    readOnly?: boolean;
    /** 容器类名 */
    className?: string;
    /** 画布宽度 */
    width?: number | string;
    /** 画布高度 */
    height?: number | string;
    /** 时间片段列表 */
    /** 当前时间针颜色（中间）， 默认 蓝色 #1890ff, 移动端不支持 CanvasGradient | CanvasPattern  */
    timePointColor?: string | CanvasGradient | CanvasPattern;
    /** 时间文本颜色， 默认 #fff， 移动端不支持 CanvasGradient | CanvasPattern */
    timeTextColor?: string | CanvasGradient | CanvasPattern;
    /** 刻度颜色， 默认 #fff， 移动端不支持 CanvasGradient | CanvasPattern */
    timeScaleColor?: string | CanvasGradient | CanvasPattern;
    /** 时间片段背景颜色， 默认 蓝色 #1890ff80， 移动端不支持 CanvasGradient | CanvasPattern */
    timeSectionColor?: string | CanvasGradient | CanvasPattern;
    /** 时间轴背景颜色， 默认 黑色 #000， 移动端不支持 CanvasGradient | CanvasPattern */
    timeAxisBgColor?: string | CanvasGradient | CanvasPattern;
    /** 当前时间背景颜色 */
    currentTimeBgColor?: string;
    /** 当前时间颜色 */
    currentTimeColor?: string;
    /** 结构化主题配置：预设名、部分主题对象，或两者组合。 */
    theme?: ThemeOption;
    /** 封面图片的额外参数， 默认空字符串 */
    coverQuery?: string;
    /**
     * 拖动最终结束回调（PC 端移出轴外不触发）
     * @param time 时间（移动端是 HH:mm:ss）
     */
    onChange?: (time: Date | string) => void;
    /**
     * 拖动开始回调
     * @param time - 时间 （移动端是 HH:mm:ss）
     */
    onDragStart?: (time: Date | string) => void;
    /**
     * 拖动中回调
     * @param time - 时间 （移动端是 HH:mm:ss）
     */
    onDragging?: (time: Date | string) => void;
    /**
     * 拖动结束回调
     * @param time - 时间 （移动端是 HH:mm:ss）
     * @param isOver - 鼠标是否在轴上（PC 有效）
     */
    onDragEnd?: (time: Date | string, isOver?: boolean) => void;
    /** 销毁 */
    onDestroy?: () => void;
}
/**
 * 时间轴基类
 * @internal
 */
declare class BaseTimeLine<T extends BaseTimeLineOptions> {
    /** 语言包 */
    static LOCALES: {
        zh: {
            title: string;
            foldTitle: string;
        };
        en: {
            title: string;
            foldTitle: string;
        };
    };
    private _current;
    /** 只读 */
    private _readOnly;
    private _width;
    private _height;
    private _destroyed;
    private _timeWidth;
    /** 配置项 */
    options: Required<T>;
    /** 挂载节点 */
    $container: HTMLElement;
    i18n: I18n;
    /** 片段列表 */
    private _timeSections;
    /** 解析后的完整主题（构造时由 {@link _resolveAndStoreTheme} 填充）。 */
    protected _resolvedTheme: ResolvedTheme;
    constructor(container: HTMLElement, options: T);
    /**
     * 当前时间
     */
    get current(): Date;
    /**
     * 当前时间
     */
    set current(current: Date);
    set readOnly(readOnly: boolean);
    /**
     * 只读状态
     */
    get readOnly(): boolean;
    /**
     * 时间片段
     */
    get timeSections(): TimeLineTimeSection[];
    /**
     * 当前渲染使用的完整主题。
     */
    get theme(): ResolvedTheme;
    /**
     * 渲染器级别的基础主题覆盖。基类返回空对象；移动端渲染器重写此方法以
     * 注入其默认调色板（叠加在 light 预设之上）。
     */
    protected _themeBaseOverride(): PartialTheme;
    /**
     * 解析并存储主题。读取 this.options 中的 legacy `*Color` 选项与
     * this.options.theme，结合渲染器的 {@link _themeBaseOverride} 进行合并，
     * 将结果存入 {@link _resolvedTheme}。
     *
     * @param option - 可选的主题选项；省略时使用 this.options.theme。
     * @returns 当引用了不存在的预设名时返回 `{ unknownPreset }`。
     */
    protected _resolveAndStoreTheme(option?: ThemeOption): {
        unknownPreset?: string;
    };
    /**
     * 将主题选项合并到当前生效的主题之上（用于 `updateTheme`）。
     *
     * 与 {@link _resolveAndStoreTheme} 的区别在于：此方法把 partial 合并到
     * **当前生效的** {@link _resolvedTheme} 之上，而不是重新从预设解析。这样
     * `updateTheme` 表现为对当前主题的增量更新。
     *
     * 若选项引用了不存在的预设名，则返回 `{ unknownPreset }` 并**不**改动
     * `_resolvedTheme`，从而保留当前生效的主题（需求 4.7）。
     *
     * @param option - 主题选项：预设名、部分主题对象，或两者组合。
     * @returns 当引用了不存在的预设名时返回 `{ unknownPreset }`。
     */
    protected _mergeActiveTheme(option: ThemeOption): {
        unknownPreset?: string;
    };
    /**
     * 设置只读或取消只读, 推荐使用 timeLine.readOnly = false
     * @param readOnly - 只读或取消只读
     * @returns
     */
    setReadOnly(readOnly: boolean): void;
    /**
     * 更新当前时间
     * @param current 能转成时间的值， 如 时间对象 Date, 时间戳，时间戳字符串
     */
    update(current: Date): void;
    /**
     * 更新时间片段
     * @param timeSections 片段数据
     */
    updateTimeSections(timeSections: TimeLineTimeSection[]): void;
    /**
     * 获取 TimeLine 的宽度
     * @returns
     */
    get width(): number;
    /**
     * 获取 TimeLine 的高度
     */
    get height(): number;
    /**
     * 重置尺寸
     */
    resize(width?: number | string, height?: number | string): void;
    private _resize;
    get timeWidth(): number;
    /**
     * 改变时间轴刻度
     * 移动端间距： 0：1分钟，1：10分钟，2：半小时，3：1小时，4：2小时, 5：4小时
     * PC间距：
     * @param timeWidth 时间轴刻度
     */
    setTimeWidth(timeWidth: number): void;
    /**
     * 销毁
     */
    destroy(): void;
}

/**
 * 是否支持 pointer event
 */
/**
 * 时间轴移动端参数
 */
interface MobileTimeLineOptions extends BaseTimeLineOptions {
    /**
     * 时间轴高度, 支持 number 和 string ("100px" | "100%" | "45rem")
     */
    height?: number | string;
    /** 展示切换时间宽度按钮， 仅移动端 */
    showTimeWidthBtn?: boolean;
    /**
     * 是否展示封面折叠，默认 true, 仅移动端
     * 图片可能会有实效性
     */
    showCoverFold?: boolean;
    /**
     * 弹框展开隐藏回调
     * @param open - 是否展开
     * @returns
     */
    onPickerOpenChange?: (open: boolean) => void;
    /**
     * 选中片段
     * @param item
     * @returns
     */
    onPickerSelect?: (item: TimeLineTimeSection) => void;
}
interface MobileTimeLineTimeArr {
    id: number;
    current: string;
    label: string;
    marginTop: number;
    marginBottom: number;
    recArr: any[];
    [key: string]: any;
}
declare class MobileTimeLine extends BaseTimeLine<MobileTimeLineOptions> {
    private _$currentTime;
    private _$itemContainer;
    private _$itemList;
    private _$op;
    private readonly _isTouchStart;
    private _scrollTimer;
    private _picker;
    private _delegateItemContent;
    private _delegatePickerClose;
    private _delegateCoverFold;
    private _dragScroll;
    private _moveStartX;
    private _moveStartY;
    private _imageLazyLoader;
    private _imageLazyLoaderPicker;
    state: {
        start: string;
        end: string;
        current: null;
        timeArr: MobileTimeLineTimeArr[];
        availTimeLine: never[];
        index: number;
    };
    constructor(container: HTMLElement, options: MobileTimeLineOptions);
    /**
     * 将已解析主题的 CSS 自定义属性写到实例容器（this.$container）上，
     * 使 `--ez-time-line-*` 变量作用域限定在当前实例。
     */
    private _applyCssVars;
    /**
     * 设置主题（替换式）。传入预设名、局部主题对象或二者组合。
     * 若预设名未知，则保留当前主题并告警。
     * @param option - 主题选项
     */
    setTheme(option: ThemeOption): void;
    /**
     * 更新主题（合并式）。将局部主题合并到当前激活的已解析主题之上。
     * 若预设名未知，则保留当前主题并告警。
     * @param partial - 局部主题选项
     */
    updateTheme(partial: ThemeOption): void;
    /**
     * 移动端默认调色板（叠加在 light 预设之上），复现移动端当前外观。
     * 由基类构造期间调用的 `_resolveAndStoreTheme` -> `_themeBaseOverride` 选取，
     * 因其是原型方法，构造时即可生效。
     */
    protected _themeBaseOverride(): PartialTheme;
    /**
     * 设置只读或取消只读
     * @param readOnly - 只读或取消只读
     * @returns
     */
    setReadOnly(readOnly: boolean): void;
    /**
     * 改变时间轴刻度
     * 0： 1分钟，
     * 1： 10分钟
     * 2： 半小时
     * 3： 1小时
     * 4： 2小时
     * @param timeWidth  // 120: 2小时， 60：1小时， 30：半小时，10：10分钟，1：1分钟
     */
    setTimeWidth(timeWidth: number): void;
    /**
     * 获取真实时间刻度（时间单位 分钟）
     */
    private get _scaleWidth();
    /**
     * 更新片段数组
     * @param timeSections
     * @param defaultIndex
     */
    updateTimeSections(timeSections: TimeLineTimeSection[], defaultIndex?: number): void;
    /**
     * 更新当前时间
     * @param time 能转成时间的值， 如 时间对象 Date, 时间戳，时间戳字符串
     */
    update(time: string | Date | number): void;
    /**
     * 销毁
     */
    destroy(): void;
    /**
     * 更新状态
     * @param obj
     */
    private _setState;
    private _setCurrentDOM;
    /**
     * 渲染时间轴刻度数组
     */
    private _matchTimeDot;
    private _matchRecTimeDot;
    private _renderDateLine;
    private _currentOffsetH;
    private _render;
    private _addEventListener;
    private _removeEventListener;
    private _plusClick;
    private _minusClick;
    private _timeSectionsToGroupsByHour;
    /**
     *
     * @param start 仅支持判断同一天的， 如果是多天的或出错
     */
    private _filterTimeSectionsByTime;
    /**
     * 渲染选择器内容
     */
    private _renderPickerContent;
    /**
     * 图片加载失败
     * @param e
     */
    private _onImageError;
    private _onPickerClose;
    private _onClickItem;
    private _onClickCoverFold;
    private _setImageScr;
    private _offsetYToTime;
}

/**
 * 时间刻度宽度 [刻度间隔秒数s, 刻度间隔宽度px, 长刻度间隔短刻度个数, 说明]
 * 需要满足 (24 * 60 * 60) % ([0] * [2]) = 0， 这样 0 点刻度才能正确显示
 */
type TimeLineTimeWidth = [number, number, number, string];

/**
 * 时间轴配置项
 */
interface TimeLineOptions extends BaseTimeLineOptions {
    /** 屏幕分辨率，默认 window.devicePixelRatio, 需要大于等于1 */
    dpr?: number;
    /** 刻度顶部偏移量, 默认 4px */
    scaleOffsetTop?: number;
    /** 是否显示年、月、日, 默认 true */
    showYearMonthDay?: boolean;
    /** 录像片段（timeSection）填充区域上下偏移量（CSS px）：[上偏移, 下偏移]，默认 [0, 0] */
    timeSectionOffset?: [number, number];
    /** 是否显示鼠标悬停时间气泡（PC），默认 true */
    showHoverTip?: boolean;
    /** 悬停气泡时间格式；缺省时按刻度自动选择（≥1分钟用 HH:mm，否则 HH:mm:ss） */
    hoverTipFormat?: string;
    /**
     * 悬停气泡位置：
     * - 'follow'（默认）：跟随光标右下角；
     * - 'top'：固定在 canvas 顶部，水平方向相对光标居中，并做左右边界限制。
     */
    hoverTipPlacement?: 'follow' | 'top';
    /**
     * 自定义悬停气泡内容（返回 HTML 字符串）
     * @param date 光标所在位置对应的时间
     */
    renderHoverTip?: (date: Date) => string;
    /** 是否支持点击时间轴跳转到点击时间点，默认 true */
    enabledClickToSeek?: boolean;
    /**
     * 点击跳转回调（enabledClickToSeek 开启且发生点击跳转时触发）
     * @param time 点击位置对应的时间
     */
    onClickSeek?: (time: Date) => void;
}
/**
 * 时间轴控件类， 支持PC/Mobile 拖动和缩放
 * @beta
 * @example
 * ```ts
 * import TimeLine from './TimeLine';
 * const timeLine = new TimeLine(document.getElementById('container'), {})
 * ```
 */
declare class TimeLine extends BaseTimeLine<TimeLineOptions> {
    static TIME_WIDTH: TimeLineTimeWidth[];
    $container: HTMLElement;
    private _$canvas;
    private _ctx;
    /** 时间刻度宽度 [刻度间隔秒数s, 刻度间隔宽度px, 长刻度间隔短刻度个数, 中文说明]  */
    private _timeWidthArray;
    private _centerPositionX;
    private _isMouseDown;
    private _mousePosition;
    private _oldTime;
    private _isOver;
    private _moved;
    private _lastTouchDist;
    /** hover tip（鼠标悬停时间气泡） */
    private _$hoverTip;
    private _hoverRafId;
    private _hoverX;
    private _hoverY;
    private _hoverActive;
    private _hoverLineX;
    private _dragMoved;
    private _containerRect;
    private _drawRafId;
    constructor(container: HTMLElement, options: TimeLineOptions);
    /**
     * 初始化 (canvas)
     */
    private _init;
    /**
     * 重置尺寸
     */
    resize(width?: number | string, height?: number | string): void;
    /**
     * 设置时间轴刻度宽度
     * @param timeWidth - 时间轴刻度宽度 [0, TIME_WIDTH.length - 1]
     * @returns
     */
    setTimeWidth(timeWidth: number): void;
    /**
     *  设置片段数组
     * @param timeSections - 片段数组
     * @returns
     */
    updateTimeSections(timeSections: TimeLineTimeSection[]): void;
    /**
     * 更新当前时间
     * @param time 能转成时间的值， 如 时间对象 Date, 时间戳，时间戳字符串
     */
    update(time: Date | number | string): void;
    /**
     * 更新
     * @param options - 更新参数
     * @returns
     */
    private _update;
    /**
     * 设置主题（整体替换）
     * @param option - 主题配置项（预设名称、部分主题对象或带 preset 的对象）
     */
    setTheme(option: ThemeOption): void;
    /**
     * 更新主题（在当前生效主题上合并）
     * @param partial - 部分主题配置项
     */
    updateTheme(partial: ThemeOption): void;
    setReadOnly(readOnly: boolean): void;
    /**
     * 销毁
     * @returns
     */
    destroy(): void;
    /**
     * 缩放时间轴 动态减少间距 （没处理 dpr）
     * @returns 刻度间距
     */
    private get _curScaleSpacing();
    /** 创建悬停气泡 DOM（仅 showHoverTip 时）。基础样式内联，避免依赖外部样式表。 */
    private _initHoverTip;
    /** 把悬停气泡的颜色 token 同步到容器 CSS 变量与气泡内联样式（随主题变化） */
    private _applyHoverTipVars;
    /** 根据光标 X（CSS px，相对容器左侧）计算对应时间 */
    private _hoverTimeAt;
    /**
     * 计算某秒级时间戳所在「当地自然日 0 点」的秒级时间戳。
     * 等价于原先 DateTime.format(ts,'YYYY-MM-DD') 再 toDate 的结果，但避免了
     * 字符串格式化 + 解析的高开销（刻度循环中每格都会用到）。
     */
    private _localDayStartSec;
    /** 获取容器位置（缓存，避免每次 mousemove 触发 reflow；mouseover/resize 时刷新） */
    private _getContainerRect;
    /** rAF 节流的重绘（用于高频悬停，避免一次 mousemove 多次全量重绘） */
    private _scheduleDraw;
    /** 悬停气泡文案 */
    private _formatHoverTime;
    /** 请求更新悬停气泡（rAF 节流） */
    private _showHoverTip;
    /** 渲染悬停气泡内容与位置（跟随光标右下角，限制在容器范围内） */
    private _renderHoverTip;
    /** 隐藏悬停气泡 */
    private _hideHoverTip;
    /**
     * 绘制
     */
    private _draw;
    /** 绘制鼠标悬停位置竖线（仅悬停、非拖拽时） */
    private _drawHoverLine;
    /**
     * 绘制刻度
     */
    private _drawScale;
    /**
     * 绘制当前中心位置指示（2px 竖线 + 顶部/底部 6px 三角）
     * @param centerX - 中心 X（已做 dpr 处理）
     * @param totalHeight - 画布总高度（已做 dpr 处理）
     */
    private _drawCenterIndicator;
    /**
     * 绘制线
     * @param startX - 线起点 x 坐标
     * @param startY - 线起点 y 坐标
     * @param endX - 线终点 x 坐标
     * @param endY - 线终点 y 坐标
     * @param lineWidth - 线宽度
     * @param color - 线颜色
     *
     */
    private _drawSolidLine;
    /**
     * 绘制刻度文字
     * @param text - 文本
     * @param x - X
     * @param y - Y
     * @param align - 文本对齐方式
     */
    private _drawTextString;
    /**
     * 画录像区间
     */
    private _drawSections;
    /**
     * 获取时间片段在时间轴中的x1 ,x2坐标 （已做 dpr 处理）
     * @param item - 时间片段
     * @returns {void}
     */
    private _findPosition;
    /**
     * 添加事件监听
     * @returns
     */
    private _addEventListener;
    /**
     * 移除事件监听
     * @returns
     */
    private _removeEventListener;
    /**
     * 鼠标按下事件监听
     * @param e - 鼠标事件
     * @returns
     */
    private _mousedownFun;
    /**
     * 鼠标移入事件监听
     * @returns
     */
    private _mouseoverFun;
    /**
     * 鼠标离开事件监听
     * @returns
     */
    private _mouseleaveFun;
    /** 容器滚轮：拦截默认滚动（具名，便于移除） */
    private _containerWheelFun;
    /**
     * 鼠标抬起事件监听
     * @returns
     */
    private _mouseUpFun;
    /**
     * 点击时间轴：跳转 current 到点击位置对应的时间（enabledClickToSeek 开启时）
     * @param e - 鼠标事件
     */
    private _clickFun;
    /**
     * 鼠标移动事件监听
     * @param e - 鼠标事件
     * @returns
     */
    private _mousemoveFun;
    /**
     * 鼠标滚轮滚动
     * @param e - 鼠标滚轮滚动事件
     * @returns
     */
    private _mousewheelFun;
    /**
     * 触摸开始
     * @param e - 触摸事件
     * @returns
     */
    private _touchstartFun;
    /**
     * 触摸移动
     * @param e - 触摸事件
     * @returns
     */
    private _touchmoveFun;
    /**
     * 触摸结束
     * @param e - 触摸事件
     * @returns
     */
    private _touchendFun;
    /**
     * 拖动结束
     * @returns
     */
    private _moveEndOrTouchEndFun;
    /**
     * 移动更新时间
     * @param x - 移动的x坐标
     * @returns
     */
    private _moveUpdateFun;
}

export { BaseTimeLine, DEFAULT_PRESET, MobileTimeLine, PRESET_THEMES, PRESET_THEME_NAMES, TimeLine };
export type { BaseTimeLineOptions, MobileTimeLineOptions, MobileTimeLineTimeArr, PartialTheme, PresetThemeName, ResolvedTheme, Theme, ThemeColors, ThemeFont, ThemeOption, ThemeSizes, TimeLineOptions, TimeLineTimeSection, TimeLineTimeWidth };
