/**
 * Zoom position
 *
 */
interface ZoomPosition {
    posX: number;
    posY: number;
}
/**
 * Zoom options
 */
interface ZoomOptions {
    /** 初始化缩放倍数, 默认 1 */
    initialZoom?: number;
    /** 默认光标，默认 auto */
    defaultCursor?: string;
    /** 滚动速度, 默认 0.1 */
    scrollVelocity?: number;
    /** 过渡持续时间，默认 0.25 单位秒 */
    animDuration?: number;
    /** 允许缩放， 默认 true */
    allowZoom?: boolean;
    /** 是否允许滚轮， 默认 true */
    allowWheel: boolean;
    /** 是否允许触屏移动(mousemove, touchmove)，默认 true */
    allowPan?: boolean;
    /**
     * 缩放倍数变化
     * @param zoom - 缩放倍数
     * @param reset - 是否重置
     */
    onChange?: (zoom: number, reset?: boolean) => void;
    /**
     * 内容平移的位置变化，（值时放大后的偏移量）
     * @param pos - 位置
     */
    onTranslateChange?: (pos: ZoomPosition) => void;
    onTap?: () => void;
    /** 最大缩放倍数， 默认 8 */
    max?: number;
    /** 最小缩放倍数， 默认 1 */
    min?: number;
    /** 缩放倍数步数大小， 默认 0.1  */
    zoomStep?: number;
    /** 允许 event.preventDefault ,默认 false */
    allowTouchEvents?: boolean;
    /**
     * 鼠标按钮，0：主按钮（通常为左键）， 1：辅助按钮（通常为中键/滚轮） 2：次按钮（通常为右键） 3：后退按钮（浏览器后退功能） 4：前进按钮（浏览器前进功能）
     * @default []
     */
    ignoredMouseButtons?: number[];
    /** 双击最大延时, 默认 300 单位ms, 仅移动端支持 */
    doubleTouchMaxDelay?: number;
    /** 减速持续时间, 默认 750 单位 ms */
    decelerationDuration?: number;
}
/**
 * dom 节点放大和拖动
 *
 */
declare class Zoom {
    static VERSION: string;
    container: HTMLElement;
    options: Required<ZoomOptions>;
    percentPos: [number, number];
    transition: number;
    zoom: number;
    cursor: string;
    lastCursor: [number, number] | null;
    lastShift: [number, number] | null;
    lastTouchDistance: number | null;
    lastRequestAnimationId: number | null;
    lastTouchTime: number | null;
    lastDoubleTapTime: number | null;
    /** 是否旋转了 90度 */
    transform: boolean;
    isMultiTouch: number | 0;
    private _tapStartTime;
    private _dragging;
    constructor(container: HTMLElement, options?: Partial<ZoomOptions>);
    get pos(): [number, number];
    /**
     * 销毁
     * destroy
     */
    destroy: () => void;
    /**
     * 设置是否旋转
     * @param trans - 是否transform
     */
    setTransform: (trans: boolean) => void;
    /**
     * 获取是否旋转
     * @returns
     */
    getTransform: () => boolean;
    /**
     * 更新x轴和Y轴平移值
     */
    updateTranslate: () => void;
    /**
     * 更新容器样式
     */
    update: () => void;
    /**
     * 设置支持缩放
     * @param allow
     */
    setAllowZoom: (allow: boolean) => void;
    /**
     * 设置缩放值
     * @param zoom - 缩放值
     * @param reset - 是否重置
     */
    setZoom: (zoom: number, reset?: boolean | false) => void;
    /**
     * 获取缩放值
     * @returns
     */
    getZoom: () => number;
    /**
     * 设置位置
     * @param pos - 位置 [X轴坐标转换， Y轴坐标转换]
     */
    setPos: (pos: [number, number]) => void;
    /**
     * 设置过渡时间
     * @param duration - 过渡时间, 单位秒
     */
    setTransitionDuration: (duration: number) => void;
    /**
     * 设置鼠标样式
     * @param cursor
     * @returns
     */
    setCursor: (cursor: string) => void;
    zoomIn: (value: number) => void;
    zoomOut: (value: number) => void;
    zoomToZone: (relX: number, relY: number, relWidth: number, relHeight: number) => void;
    getNewPosition: (x: number, y: number, newZoom: number) => [number, number];
    /**
     * 缩放到最大
     * @param x - 点击点X坐标
     * @param y - 点击点Y坐标
     */
    fullZoomInOnPosition: (x: number, y: number) => void;
    getLimitedShift: (shift: number, minLimit: number, maxLimit: number, minElement: number, maxElement: number) => number;
    getCursor: (canMoveOnX: boolean, canMoveOnY: boolean) => "auto" | "move" | "ew-resize" | "ns-resize";
    move: (shiftX: number, shiftY: number, transitionDuration?: number) => void;
    /**
     * 移动端双击
     * @returns
     */
    isDoubleTapping: () => boolean;
    startDeceleration: (lastShiftOnX: number, lastShiftOnY: number) => void;
    reset: () => void;
    setUpEventListeners(): void;
    removeEventListeners(): void;
    getPrecision(value?: number): number;
    addScale: (scale?: number) => void;
    handleZoomAdd: (scale?: number) => void;
    subScale: (scale?: number) => void;
    handleZoomSub: (scale?: number) => void;
    handleMouseWheel: (event: WheelEvent) => void;
    handleMouseStart: (event: MouseEvent) => void;
    handleMouseMove: (event: MouseEvent) => void;
    handleMouseStop: (event: MouseEvent) => void;
    /**
     * 获取坐标 (伪横屏X、Y轴坐标转换, 相对值)
     * @param event
     * @returns
     */
    getCoordinates(event: Touch | MouseEvent): [number, number];
    handleTouchStart: (event: TouchEvent) => void;
    handleTouchMove: (event: TouchEvent) => void;
    handleTouchStop: () => void;
    private _touchOrMouseDrag;
}

export { Zoom as default };
export type { ZoomOptions };
