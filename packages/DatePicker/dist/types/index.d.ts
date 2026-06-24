import { DateTime } from '@ezuikit/utils-tools';
import { DelegateEvent } from '@skax/delegate';
import Picker, { PickerOptions } from '@skax/picker';

interface CalendarLocale {
    year: string;
    month: string;
    weeks: string[];
    months: string[];
    today: string;
    ok: string;
    /** 时间选择「此刻」文案 */
    now: string;
    /** 时间选择「取消」文案 */
    cancel: string;
}

/**
 * Header component for the container.
 * It can be used to render custom content at the bottom of the container.
 * @interface FooterOptions
 * @property {string} [className] - Optional class name to be added to the footer element for custom styling.
 * @property {string | (() => string)} content - The content to be rendered in the footer.
 *
 * It can be a string or a function that returns a string.
 */
interface HeaderOptions {
    /**
     * Optional class name to be added to the footer element for custom styling.
     */
    className?: string;
    /**
     * Prefix class name to be added to the footer element for custom styling.
     */
    prefixCls?: string;
    /**
     * 自定义 super prev 按钮图标
     */
    renderSuperPrevIcon?: string | (() => string);
    /**
     * 自定义 super next 按钮图标
     */
    renderSuperNextIcon?: string | (() => string);
    /**
     * 显示 super prev 按钮图标
     */
    showSuperPrevIcon?: boolean;
    /**
     * 显示 super next 按钮图标
     */
    showSuperNextIcon?: boolean;
    /**
     * 自定义 prev 按钮图标
     */
    renderPrevIcon?: string | ((locale?: CalendarLocale) => string);
    /**
     * 自定义 next 按钮图标
     */
    renderNextIcon?: string | ((locale?: CalendarLocale) => string);
    /**
     * 显示 prev 按钮图标
     */
    showPrevIcon?: boolean;
    /**
     * 显示 next 按钮图标
     */
    showNextIcon?: boolean;
    /**
     * 显示 header close 按钮图标
     */
    showHeaderClose?: boolean;
    /**
     * 自定义 header close 按钮图标
     */
    renderHeaderCloseIcon?: string | ((locale?: CalendarLocale) => string);
    /**
     * 显示 header ok 按钮图标
     */
    showHeaderOk?: boolean;
    /**
     * 自定义 header ok 按钮图标
     */
    renderHeaderOkIcon?: string | ((locale?: CalendarLocale) => string);
    /**
     * 点击Super prev 按钮图标回调
     * @param date
     * @param prev
     */
    onSuperPrev?: (date?: Date, prev?: Date) => void;
    /**
     * 点击Super next 按钮图标回调
     * @param date
     * @param prev
     */
    onSuperNext?: (date?: Date, prev?: Date) => void;
    /**
     * 点击 prev 按钮图标回调
     * @param date
     * @param prev
     */
    onPrev?: (date?: Date, prev?: Date) => void;
    /**
     * 点击 next 按钮图标回调
     * @param date 当前选中日期
     * @param next
     */
    onNext?: (date?: Date, next?: Date) => void;
    /**
     * 点击 close 按钮图标回调
     * @param date 当前选中日期
     */
    onClose?: (date?: Date) => void;
    /**
     * 点击 ok 按钮图标回调
     * @param date 当前选中日期
     */
    onOk?: (date?: Date) => void;
    /** 多语言 */
    locale?: CalendarLocale;
}
/**
 * 公共头部组件
 * @param options - Options for the header component.
 * @param {string} options.className - Optional class name to be added to the header element for custom styling.
 * @param {string | (() => string)} options.content - The content to be rendered in the header.
 * It can be a string or a function that returns a string.
 * This function creates a header element with the specified class name and content.
 * It returns a string representing the HTML structure of the header.
 * @example
 * ```ts
 * import Header from "./header";
 * const header = new Header({
 *   className: "custom-header",
 *   prefixCls: "prefix",
 *   content: () => "<h1>Header Content</h1>"
 * })
 * @returns {string} The HTML string representing the header element.
 *
 */
declare class Header {
    options: Required<HeaderOptions>;
    $header: HTMLElement | null;
    /** 头部内部事件委托集合，destroy 时统一解绑（修复监听泄漏 P0）。 */
    private _delegations;
    constructor(options: HeaderOptions);
    private _render;
    private _getStrOrFunToStr;
    /**
     * 渲染内容
     * @param html 内容
     * @returns
     */
    renderContent(html: string): void;
    destroy(): void;
    private _eventListeners;
}

type PopupContainerEle = HTMLElement | (() => HTMLElement);
/**
 * ContainerOptions interface for defining options for the Container class.
 */
interface ContainerOptions extends HeaderOptions {
    /**
     * A class name to be added to the wrapper element of the content.
     * This allows for custom styling of the container.
     */
    wrapClassName?: string;
    /**
     * A prefix class name to be added to the container element.
     * This is useful for styling and avoiding class name conflicts.
     */
    prefixCls?: string;
    /**
     * The locale to be used for localization.
     * It can be a string representing the language code (e.g., "en-US", "zh-CN") or an object containing localized strings.
     * If not provided, it defaults to "en-US".
     */
    language?: 'en' | 'zh' | string;
    /**
     * An object containing locale strings for different languages.
     * The keys should be language codes (e.g., "en-US", "zh-CN") and the values should be objects containing localized strings.
     */
    locales?: Record<string, CalendarLocale>;
    /**
     * Whether to render the component in mobile mode.
     */
    isMobile?: boolean;
    /**
     * Whether to show the header in the container.
     */
    showHeader?: boolean;
}
/**
 * Container class for creating a content container with options for locale and styling.
 * @example
 * ```ts
 * import Container from "./Container";
 * const container = new Container({
 *   getContainer: document.body,
 *   wrapClassName: "custom-wrap",
 *   prefixCls: "custom-prefix",
 *   language: "zh-CN",
 *   locales: {
 *     "en-US": { today: "Today", cancel: "Cancel" },
 *     "zh-CN": { today: "今天", cancel: "取消" },
 *   },
 * });
 */
declare class Container<T extends ContainerOptions> {
    /**
     * Options for the Container class, including wrapClassName, prefixCls, locale, and LOCALES.
     */
    readonly options: T;
    /**
     * The popup container element.
     */
    $popupContainer: HTMLElement;
    /**
     * panel element node.
     */
    $panel: HTMLDivElement;
    /**
     * body element node.
     */
    $body: HTMLDivElement;
    /**
     * The container element where the container's content will be appended.
     */
    $container: HTMLElement;
    /**
     * The language used for localization.
     */
    language: string;
    /**
     * header.
     */
    header: Header | null;
    /**
     * 该容器注册的事件委托集合，destroy 时统一解绑（修复监听泄漏 P0）。
     */
    protected _delegations: Array<{
        destroy: () => void;
    }>;
    /**
     * The locale object for the current language.
     */
    locale: CalendarLocale;
    constructor(popupContainer: PopupContainerEle | null, options: ContainerOptions);
    /**
     * set locale
     * @private
     * @returns {void}
     */
    private _setLocale;
    /**
     * 注册事件委托并登记，便于 destroy 统一解绑（修复 delegate 监听不解绑导致的泄漏 P0）。
     * 子类应使用本方法替代直接调用 delegate。
     * @returns {{ destroy: () => void }} delegate 句柄
     */
    protected _delegate(el: Element, selector: string, type: string, cb: (e: DelegateEvent) => void, useCapture?: boolean): any;
    /**
     * destroy content node
     * @example
     * ```ts
     * container.destroy();
     * ```
     * @returns {void}
     */
    destroy(): void;
    /**
     * set locale
     * @param {"en-US" | "zh-CN" | L} locale  locale
     * @example
     * ```ts
     * container.setLocale("zh-CN");
     * container.setLocale({ today: "今天" });
     * ```
     * @returns {void}
     */
    setLocale(locale: 'en-US' | 'zh-CN' | string): void;
    protected _onSuperPrev(): void;
    protected _onSuperNext(): void;
    protected _onPrev(): void;
    protected _onNext(): void;
    protected _onClose(): void;
    protected _onOk(): void;
}

interface CalendarOptions extends ContainerOptions, Omit<HeaderOptions, "prefixCls" | "content"> {
    /** 当前选中日期 new Date() | "2025-01-01" | "2025-01-01T00:00:00.000Z" | "2025/01/01" */
    current?: Date | string;
    /** 周起始位置 0-6  0:周日 1:周一 2:周二 3:周三 4:周四 5:周五 6:周六 */
    startOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    /** 是否展示头部 */
    showHeader?: boolean;
    /** 自定义 super prev 按钮图标 */
    renderSuperPrevIcon?: HeaderOptions["renderSuperPrevIcon"];
    /** 自定义 super next 按钮图标 */
    renderSuperNextIcon?: HeaderOptions["renderSuperNextIcon"];
    /** 自定义 prev 按钮图标 */
    renderPrevIcon?: HeaderOptions["renderPrevIcon"];
    /** 自定义 next 按钮图标 */
    renderNextIcon?: HeaderOptions["renderNextIcon"];
    /** 展示前一年按钮图标 */
    showSuperPrevIcon?: boolean;
    /** 展示下一年按钮图标 */
    showSuperNextIcon?: boolean;
    /** 展示前一月按钮图标 */
    showPrevIcon?: boolean;
    /** 展示下一月按钮图标 */
    showNextIcon?: boolean;
    /** 徽章点标记日期列表，默认 [], 格式 [new Date(), "2025-01-01", "2025-01-02", "2025-01-03"] */
    badges?: Array<string | Date>;
    /**
     * 自定义徽章点标记 dom 字符串
     */
    renderBadge?: string | ((date: Date, dateStr: string) => string);
    /**
     * 徽章点标记日期列表，默认 [], 默认true展示徽章点
     * @param date 日期
     * @param dateStr 日期字符串
     * @returns true 展示徽章点，false不展示徽章点
     */
    showBadge?: (date: Date, dateStr: string) => boolean;
    /**
     * 自定义year cell render
     * @param date 日期
     * @param dateStr 日期字符串
     */
    renderDate?: (date: Date, dateStr: string) => string;
    /**
     * 禁用日期
     *  @param date 日期
     *  @param dateStr 日期字符串
     */
    disabledDate?: (date: Date, dateStr: string) => boolean;
    /**
     * 日期变换回调
     * @param date 日期变化
     * @param dateStr 日期字符串
    */
    onChange?: (date: Date, dateStr: string) => void;
    /**
     * 点击日期日回调
     * @param date 点击的日期
     * @param renderDate 渲染日期
    */
    onCell?: (date: Date, renderDate: string, disabled: boolean) => void;
    /**
     * 点击上一年回调
     * @param current 当前选中的日期
     * @param prev 上一年日期
     */
    onPrevYear?: (current: Date, prev: Date) => void;
    /**
     * 点击下一年回调
     * @param current 当前选中的日期
     * @param next 下一年日期
     */
    onNextYear?: (current: Date, next: Date) => void;
    /**
     * 点击上一月回调
     * @param current 当前选中的日期
     * @param prev 上一月日期
     */
    onPrevMonth?: (current: Date, prev: Date) => void;
    /**
     * 点击下一月回调
     * @param current 当前选中的日期
     * @param next 下一月日期
     */
    onNextMonth?: (current: Date, next: Date) => void;
    /**
     * 点击年回调，仅当有值才可以触发
     * @param current 当前选中的日期
     * @param renderDate 渲染日期
     */
    onYear?: (current: Date, renderDate: Date) => void;
    /**
     * 点击月回调，仅当有值才可以触发
     * @param current 当前选中的日期
     * @param renderDate 渲染日期
     * @returns
     */
    onMonth?: (current: Date, renderDate: Date) => void;
}

/**
 * 日历
 * @param {CalendarOptions} options
 * @example
 * ```ts
 *  const calendar = new Calendar(document.getElementById('container'), {
 *     startOfWeek: 0,
 *     language: 'en',
 *  })
 *
 * calendar.setCurrent(new Date());
 * calendar.setCurrent(new Date('2025-01-01'));
 * ```
 */
declare class Calendar extends Container<CalendarOptions> {
    private _current;
    private _renderCurrent;
    static DateTime: typeof DateTime;
    badges: Array<string | Date>;
    /**
     * 日历
     * @param container 容器节点
     * @param options 日历配置项
     */
    constructor(container: PopupContainerEle, options: CalendarOptions);
    /**
     * 当前选择的日期
     */
    get current(): Date;
    /**
     * 设置当前设置的日期
     * @param {Date | string} date 当前选择的日期
     * @param {boolean} change 是否触发 onChange， 默认 true
     * @returns {void}
     * @example
     * ```ts
     * calendar.setCurrent(new Date()); // 设置当前选择的日期 支持多种时间格式
     * ```
     */
    setCurrent(date?: Date | string, change?: boolean): void;
    /**
     * 更新徽章点
     * @param {Array<string | Date>} badges 徽章点列表
     * @returns {void}
     * @example
     * ```ts
     * calendar.updateBadges([new Date(), new Date('2025-01-01')]);
     * ```
     */
    updateBadges(badges: Array<string | Date>): void;
    /**
     * 更新徽章点
     * @param {Array<string | Date>} badges 徽章点列表
     * @returns {void}
     * @example
     * ```ts
     * calendar.updateBadges([new Date(), new Date('2025-01-01')]);
     * ```
     */
    private _updateBadges;
    private _setRenderCurrent;
    private _onCell;
    /**
     * 上一年
     * @override 重写 Container 的 _onSuperPrev
     */
    protected _onSuperPrev(): void;
    /**
     * 下一年
     * @override 重写 Container 的 _onSuperNext
     */
    protected _onSuperNext(): void;
    /**
     * 上一月
     * @override 重写 Container 的 _onPrev
     */
    protected _onPrev(): void;
    /**
     * 下一月
     * @override 重写 Container 的 _onNext
     */
    protected _onNext(): void;
    /**
     * 头部点击事件
     */
    private _onHeader;
    /**
     * 点击确定
     * @override 覆盖Container的 _onOk
     */
    protected _onOk(): void;
    /**
     * 点击关闭
     * @override 覆盖Container的 _onClose
     */
    protected _onClose(): void;
    /**
     * 渲染
     */
    private _render;
    /**
     * 渲染日期
     */
    private _renderDate;
    /**
     * 渲染徽章
     * @param date
     * @param dateStr
     * @returns
     */
    private _renderBadge;
}

/**
 * 月份选择器配置项
 */
interface MonthOptions extends Omit<ContainerOptions, 'showPrevIcon' | 'showNextIcon' | 'renderPrevIcon' | 'renderNextIcon' | 'content'> {
    /** 当前时间 或当前年月份 new Date() | "2025-01" | "2025-01-01" | "2025/01" | "2025/01/01" */
    current?: Date | string;
    /** cell 高度 */
    cellHeight?: number;
    /** cell 宽度 */
    cellWidth?: number;
    /** 展示header */
    showHeader?: boolean;
    /** 自定义 render month cell */
    monthRender?: (date: Date, dateStr: string) => string;
    /** 年份变化时触发 */
    onChange?: (currentDate: Date, currentDateStr: string) => void;
    /** 点击月份触发 */
    onCell?: (currentDate: Date, currentDateStr: string, disabled: boolean) => void;
    /** 禁用月份, true 禁用 */
    disabledMonth?: (date: Date, month: string) => boolean;
    /**
     * @param currentDate 当前选中的日期
     * @param renderDate 渲染的日期
     */
    onYear?: (currentDate: Date, renderDate: Date) => void;
}
/**
 * 月历 （12 月）
 * @param popupContainer
 * @param options
 * @returns
 * @example
 * ```ts
 * const month = new Month(document.body, {
 *   onChange: (date: Date) => {}
 * })
 * month.setCurrent("2025-01")
 * ```
 */
declare class Month extends Container<MonthOptions> {
    private _current;
    private _renderCurrent;
    /**
     * @param popupContainer 容器节点
     * @param options 配置
     */
    constructor(popupContainer: PopupContainerEle, options: MonthOptions);
    /**
     * 设置选中月份
     * @param date 日期
     * @param {boolean} change 是否触发 onChange 事件
     * @example
     * ```ts
     * month.setCurrent("2025-01")
     * ```
     */
    setCurrent(date?: string | Date, change?: boolean): void;
    /**
     * 当前选中的月份日期
     * @example
     * ```ts
     * month.current
     * ```
     * @returns {Date}
     */
    get current(): Date;
    /**
     * 设置选中月份
     * @param date 日期
     * @param {boolean} change 是否触发 onChange 事件
     */
    private _setCurrent;
    private _setRenderCurrent;
    /**
     * 点击确定
     * @override 重写 Container 的 _onOk
     */
    protected _onOk(): void;
    /**
     * 点击关闭
     * @override 重写 Container 的 _onClose
     */
    protected _onClose(): void;
    /**
     * 点击月份
     */
    private _onCell;
    /**
     * 上一年
     * @override 重写 Container 的 _onSuperPrev
     */
    protected _onSuperPrev(): void;
    /**
     * 下一年
     * @override 重写 Container 的 _onSuperNext
     */
    protected _onSuperNext(): void;
    /**
     * 点击头部标题
     */
    private _onHeaderTitle;
    private _setHeader;
    private _setDisabled;
    private _render;
    private _renderMonths;
}

/**
 * 年历 （12 年）配置项
 */
interface YearOptions extends Omit<ContainerOptions, 'prefixCls' | 'showPrevIcon' | 'showNextIcon' | 'renderPrevIcon' | 'renderNextIcon'> {
    /** 当前时间 或当前年份 */
    current?: Date | number;
    /** 是否展示头部, 默认 true */
    showHeader?: boolean;
    /**
     * 自定义year cell render
     * @param year 年份
     * @param yearStr 年份字符串
     */
    yearRender?: (year: Date, yearStr: number) => string;
    /**
     * 年份变化时触发
     * @param year 变化年份（禁用年份不会触发）
     */
    onChange?: (year: Date) => void;
    /**
     * 点击年份触发
     * @param year 点击年份（包括禁用年份）
     */
    onCell?: (year: Date, yearStr: string, disabled: boolean) => void;
    /**
     * 禁用年份, true 禁用
     * @param year 当前年份
     * @param yearStr 当前年份字符串
     */
    disabledYear?: (year: Date, yearStr: number) => boolean;
    /**
     * 点击上一年回调
     * @param current 当前选中的日期
     * @param years 上一个12年
     */
    onPrevYear?: (current: Date, years: number[]) => void;
    /**
     * 点击下一年回调
     * @param current 当前选中的日期
     * @param years 下一个12年
     */
    onNextYear?: (current: Date, years: number[]) => void;
}
/**
 * 年历 （12 年）
 * @example
 * ```ts
 * const year = new Year(document.body, {
 *    onChange: (date: Date) => {}
 * })
 * year.setCurrent(2023)
 * ```
 */
declare class Year extends Container<YearOptions> {
    _current: Date;
    _renderTenYear: number;
    /**
     *
     * @param popupContainer 容器节点
     * @param options 年历配置项
     */
    constructor(popupContainer: PopupContainerEle, options: YearOptions);
    /**
     * 设置当前年份
     * @param year
     * @param change 是否触发 onChange 事件
     * @returns
     * @example
     * ```ts
     * year.setCurrent(2023)
     * ```
     */
    setCurrent(year: number | Date, change?: boolean): void;
    /**
     * 当前年份
     * @example
     * ```ts
     * year.current
     * ```
     */
    get current(): Date;
    private _setCurrent;
    /**
     * 点击确定
     * @override 重写 Container 的 _onOk
     */
    protected _onOk(): void;
    /**
     * 点击关闭
     * @override 重写 Container 的 _onClose
     */
    protected _onClose(): void;
    /**
     * 点击年份
     */
    private _onCell;
    /**
     * 上十年
     * @override 重写 Container 的 _onSuperPrev
     */
    protected _onSuperPrev(): void;
    /**
     * 下十年
     * @override 重写 Container 的 _onSuperNext
     */
    protected _onSuperNext(): void;
    private _render;
    private _renderYearList;
}

/**
 * 支持模型类型
 * date: 日期
 * month: 月份
 * year: 年
 */
type DatePickerModeType = 'date' | 'month' | 'year';
interface DatePickerOptions extends PickerOptions, Omit<CalendarOptions, "onChange" | "onCell" | "onOk" | "onClose"> {
    /**
     * 当点击时间变化时触发
     * @param date 选中 date
     * @param mode 当前模式
     */
    onChange?: (date: Date, mode: string) => void;
    /**
     * 当点击 cell 时触发
     * @param date cell date
     * @param mode 当前模式
     */
    onCell?: (date: Date, mode: string) => void;
    /**
     * 当点击确定时时触发
     * @param date current date
     * @param mode 当前模式
     */
    onOk?: (date: Date, mode: DatePickerModeType) => void;
    /**
     * 窗口关闭时触发
     * @param date current date
     * @param mode 当前模式
     */
    onClose?: (date: Date, mode: DatePickerModeType) => void;
    /**
     * 当前模式
     * @default 'date'
     */
    mode?: DatePickerModeType;
}
/**
 * date picker
 * @example
 * ```ts
 * const datePicker = new DatePicker(document.getElementById('picker'), {
 *    onChange: (date) => {}
 * })
 * datePicker.setCurrent(new Date())
 * ```
 */
declare class DatePicker extends Picker {
    options: DatePickerOptions;
    current: Date | null;
    _current: Date | null;
    private _calendar;
    private _month;
    private _year;
    private _currentMode;
    constructor(container: HTMLElement | (() => HTMLElement) | null, options: DatePickerOptions);
    /**
     * 设置选中日期
     * @param date 日期
     * @param {boolean} change 是否触发 onChange 事件
     * @example
     * ```ts
     * datePicker.setCurrent(2025)
     * datePicker.setCurrent(new Date())
     * datePicker.setCurrent(new Date(), false)
     * ```
     */
    setCurrent(date: Date, change?: boolean): void;
    /**
     * 更新徽章点
     * @param {Array<string | Date>} badges 徽章点列表
     * @example
     * ```ts
     * datePicker.updateBadges([new Date(), "2025-01-01"])
     * ```
     */
    updateBadges(badges: Array<string | Date>): void;
    /**
     * 销毁
     * @example
     * ```ts
     * datePicker.destroy()
     * ```
     */
    destroy(): void;
    /**
     * 当前最小模式索引, 当模式下标是最小的， 不可以再小
     */
    private get _minModeIndex();
    /**
     * 设置选中日期
     * @param date 日期
     * @param {boolean} change 是否触发 onChange 事件
     */
    private _setCurrent;
    private _switchMode;
    hide(): void;
    /**
     * @overload 重置
     * @param open 是否打开
     */
    protected _onOpenChange(open: boolean): void;
    private _initCalendar;
    private _initMonth;
    private _initYear;
    private _onOk;
    private _onClose;
    private _onChange;
    private _onCell;
    private _prvMode;
    private _onYear;
    private _onMonth;
    private _removeCurrentTypeClass;
}

/**
 * @zh 时间选择器配置
 * @en time options
 */
interface TimeOptions extends ContainerOptions {
    /** 当前时分秒 00:00:00 */
    current?: string;
    /** 自定义行高， 默认 208px */
    columnHeight?: number;
    /** 自定义行宽， 默认 120 */
    width?: number;
    /** 自定义cell高， 默认 30 */
    cellHeight?: number;
    /** 是否显示头部, 默认 true */
    showHeader?: boolean;
    /** 是否显示底部, 默认 true */
    showFooter?: boolean;
    /** 是否显示底部「取消」按钮，默认 false */
    showCancel?: boolean;
    /** 是否显示底部「确定」按钮，默认 false */
    showOk?: boolean;
    /** 禁用小时, true 禁用小时 */
    disabledHour?: (time: number) => boolean;
    /** 禁用分钟, true 禁用分钟 */
    disabledMinute?: (time: number) => boolean;
    /** 禁用秒, true 禁用秒 */
    disabledSecond?: (time: number) => boolean;
    /** 点击 单元格 cell  */
    onCell?: (type: string, time: string, times: string[]) => void;
    /** time 变换后 */
    onChange?: (type: string, time: string, times: string[]) => void;
    /** 点击底部「取消」回调 */
    onCancel?: () => void;
}
/**
 * 时分秒控件
 *
 * 滚动交互采用 **CSS transform: translateY 平移**（不依赖原生 overflow 滚动）：
 *  - 鼠标滚轮：实时跟随平移，停止后吸附到最近单元格；
 *  - 点击单元格：选中并平移到列顶部；
 *  - 移动端：触摸拖拽平移 + 抬手惯性吸附；
 *  - 平移过渡使用 transform + transition，开启 will-change 保证丝滑；
 *  - 事件监听做被动模式能力检测，兼容主流浏览器与旧环境。
 */
declare class Time extends Container<TimeOptions> {
    options: Required<TimeOptions>;
    private _current;
    /** 已绑定的平移事件清理函数集合，destroy 时统一解绑 */
    private _panCleanups;
    constructor(container: PopupContainerEle, options: TimeOptions);
    /**
     * 获取时分秒数组 ["21", "30", "37"]
     * @returns {[string, string, string]}
     */
    get _currentTimes(): string[];
    /**
     * 获取当前时间
     * @returns {string} "00:00:00"
     */
    get current(): string | undefined;
    /**
     * set current time
     * @param {string | [string, string, string]} time 设置激活时间
     */
    setCurrent(time?: string | [string, string, string]): void;
    /**
     * 销毁：先解绑平移事件再销毁容器。
     */
    destroy(): void;
    private _events;
    /** 当前三列（视口）元素 */
    private get _columns();
    /** 取某列内的轨道（被平移的 ul） */
    private _trackOf;
    /** 测量单元格高度：优先取真实渲染高度，无布局（如测试 / 样式未加载）时回退到选项值 */
    private _measureCellHeight;
    /** 单元格最大索引（用于钳制平移范围） */
    private _maxIndex;
    private _clamp;
    /** 读取轨道当前平移量（px，<=0） */
    private _getTrackOffset;
    /**
     * 设置轨道平移量并钳制到合法区间 [-(maxIndex*cellH), 0]。
     * @param smooth 是否启用过渡动画（点击 / 吸附为 true；拖拽 / 滚轮跟随为 false）
     */
    private _setTrackOffset;
    /** 把指定单元格平移到列顶部 */
    private _panCellToTop;
    /** 吸附到最近的单元格边界 */
    private _snapColumn;
    /**
     * 根据当前时间把各列选中项平移到顶部。
     * @param behavior 'smooth' 带过渡（默认）；'auto' 立即定位（用于首帧）
     * @private 内部方法：由 setCurrent / 构造 / 点击等流程驱动，不对外暴露
     */
    private activeItem;
    /** 被动监听能力检测（兼容旧浏览器；支持时用 {passive:false} 以允许 preventDefault） */
    private _supportsPassive;
    private _bindPanEvents;
    /** 鼠标滚轮：实时跟随平移，停止后吸附 */
    private _bindColumnWheel;
    /** 触摸拖拽（移动端）：拖动跟随 + 抬手惯性吸附 */
    private _bindColumnTouch;
    private _render;
    /**
     * 渲染底部 footer（取消 / 确定），默认不展示（showCancel / showOk 均为 false）。
     * @private
     */
    private _renderFooter;
    private _renderTimeBody;
    /**
     * 生成时分秒列：外层 .etime-column 为定高视口（overflow hidden），
     * 内层 .etime-track（ul）承载单元格并被 transform 平移。
     * @param { "hour" | "minute" | "second"} type
     * @param {string[]} times 时间数组
     * @returns {string} 列 dom 字符串
     */
    private _generateList;
    /**
     * 检查时分秒格式化是否正确
     * @param {string | [string, string, string]} time 时间字符串 HH:mm:ss
     * @returns {boolean} true 正确 false 不正确
     */
    private _checkTimeFmt;
}

/**
 * TimePicker 配置。footer（取消 / 确定）能力来自内嵌 `Time`：
 * `showCancel` / `showOk` / `onOk` / `onCancel` 透传给 Time，弹层默认展示 footer。
 */
interface TimePickerOptions extends PickerOptions, Omit<TimeOptions, 'onOk' | 'onChange'> {
    /** 点击底部「确定」回调，参数为当前时间 HH:mm:ss */
    onOk?: (time: string) => void;
    /**
     *
     * @param type
     * @param time
     * @param times
     * @returns
     */
    onChange: (time: string, times: string[]) => void;
}
/**
 * 时分秒选择弹层
 *
 * 在 `Time` 面板外层包一层 `@skax/picker` 弹层，提供触发、定位与显隐控制。
 * `Time` 面板在弹层首次打开时懒创建并挂载到 `this.$body`；footer 的「取消 / 确定」
 * 由 `Time` 渲染，TimePicker 仅在其回调中补充「关闭弹层」行为。
 */
declare class TimePicker extends Picker {
    options: TimePickerOptions;
    /** 内嵌时分秒面板，弹层首次打开时懒创建 */
    time: Time | null;
    private _current;
    constructor(container: HTMLElement | (() => HTMLElement) | null, options: TimePickerOptions);
    /**
     * 获取当前时间
     * @returns {string} "00:00:00"
     */
    get current(): string;
    /**
     * set current time
     * @param {string | [string, string, string]} time 设置激活时间
     */
    setCurrent(time?: string | [string, string, string]): void;
    /**
     * 收起弹层
     */
    hide(): void;
    /**
     * 销毁：先销毁内嵌面板再销毁弹层。
     */
    destroy(): void;
    /**
     * Picker 的 onOpenChange，在 open=true 时懒创建面板（含 footer）并定位到选中时间。
     * @param {boolean} open
     */
    protected _onOpenChange(open: boolean): void;
}

export { Calendar, DatePicker, Header, Month, Time, TimePicker, Year };
export type { CalendarLocale, CalendarOptions, ContainerOptions, DatePickerModeType, DatePickerOptions, HeaderOptions, MonthOptions, PopupContainerEle, TimeOptions, TimePickerOptions, YearOptions };
