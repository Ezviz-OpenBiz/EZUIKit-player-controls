interface SegmentProgressOptions {
    /** 当前片段起点（毫秒时间戳），已与播放区间求交 */
    begin?: number;
    /** 当前片段终点（毫秒时间戳），已与播放区间求交 */
    end?: number;
    /** 当前播放时间（毫秒时间戳） */
    current?: number;
    /** 是否禁用交互（拖动与点击） */
    disabled?: boolean;
    /**
     * 拖动结束或点击轨道时触发，返回目标时间
     *
     * 拖动过程中不触发，避免产生大量 seek
     */
    onChange?: (time: Date) => void;
    /** 开始拖动 */
    onDragStart?: () => void;
    /** 结束拖动 */
    onDragEnd?: () => void;
}

/**
 * 回放片段进度条
 *
 * 范围是当前录像片段（已与播放区间求交），因此不存在片段间隔的概念。
 * 拖动过程中只移动指示器与更新左侧时间，抬手才回调一次 seek。
 */
declare class SegmentProgress {
    private readonly _options;
    private readonly $root;
    private readonly $currentTime;
    private readonly $totalTime;
    private readonly $track;
    private readonly $played;
    private readonly $thumb;
    /** 片段起点（毫秒） */
    private _begin;
    /** 片段终点（毫秒） */
    private _end;
    /** 当前播放时间（毫秒） */
    private _current;
    /** 拖动中的目标时间（毫秒），非拖动状态为 null */
    private _dragMs;
    private _disabled;
    private _rafId;
    private _destroyed;
    constructor(container: HTMLElement, options?: SegmentProgressOptions);
    /** 根元素，供外部控制显隐 */
    get $container(): HTMLElement;
    /**
     * 切换当前片段（跨片段续播时调用）
     * @param begin 片段起点（毫秒）
     * @param end 片段终点（毫秒）
     */
    setSegment(begin: number, end: number): void;
    /**
     * 更新当前播放时间，超出片段范围会被夹住
     * @param timeMs 播放时间（毫秒）
     */
    setCurrent(timeMs: number): void;
    /**
     * 禁用/启用交互
     * @param disabled 是否禁用
     */
    setDisabled(disabled: boolean): void;
    destroy(): void;
    private _bindEvents;
    /** 按下：进入拖动态。点击轨道也走这里（按下即抬起，位置就是点击位置） */
    private readonly _onStart;
    private readonly _onMove;
    private readonly _onEnd;
    /** 触点横坐标 → 时间，超出轨道自动夹住（因此拖不出片段边界） */
    private _positionToTime;
    private _clamp;
    private _scheduleRender;
    private _render;
}

export { SegmentProgress as default };
export type { SegmentProgressOptions };
