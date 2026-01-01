import I18n, { I18nTranslation } from '@ezuikit/utils-i18n';

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
    private _isCtrlKeyDown;
    private _lastTouchDist;
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
    /**
     * 绘制
     */
    private _draw;
    /**
     * 绘制刻度
     */
    private _drawScale;
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
     * 合并相邻两个时间区间
     * @param timeSections - 时间区间数组
     *
     * @returns 合并后的时间区间
     */
    private _mergeTimeSections;
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
    /**
     * 鼠标抬起事件监听
     * @returns
     */
    private _mouseUpFun;
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
     * ctrl键按下事件
     * @param e - 键盘按下事件
     */
    private _ctrlKeyDownFun;
    /**
     * ctrl键抬起事件
     * @param e - 键盘按下事件
     */
    private _ctrlKeyUpFun;
    /**
     * 触摸距离
     * @param touches - 两指触摸点
     * @returns
     */
    _getTouchDistance(touches: TouchList): number;
    /**
     * 触摸开始
     * @param e - 触摸事件
     * @returns
     */
    _touchstartFun(e: TouchEvent): void;
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
    _moveEndOrTouchEndFun(e: MouseEvent | TouchEvent): void;
    /**
     * 移动更新时间
     * @param x - 移动的x坐标
     * @returns
     */
    _moveUpdateFun(x: number): void;
}

export { BaseTimeLine, MobileTimeLine, TimeLine };
export type { BaseTimeLineOptions, MobileTimeLineOptions, MobileTimeLineTimeArr, TimeLineOptions, TimeLineTimeSection, TimeLineTimeWidth };
