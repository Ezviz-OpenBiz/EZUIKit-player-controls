interface BasePtzOptions {
    language?: 'zh' | 'en';
    env?: {
        domain: string;
    };
    /** 不再减容 ptzSpeed, 请配置 ptzOptions.speed */
    speed?: 1 | 2 | 3;
    accessToken?: string;
    token?: {
        deviceToken: {
            video?: string;
        };
    };
    deviceSerial?: string;
    channelNo?: number | string;
    locales?: Record<string, Record<string, string>>;
    onDirection?: (info: Record<string, any>) => (result?: any) => void;
    onSpeedChange?: (speed: number) => void;
}
declare class BasePtz<T extends BasePtzOptions> {
    $container: HTMLElement;
    options: T;
    locale: Record<string, string>;
    speed: 1 | 3 | 7;
    constructor(container: HTMLElement, options?: BasePtzOptions);
    updateOptions(options: Pick<BasePtzOptions, 'accessToken' | 'channelNo' | 'deviceSerial' | 'token' | 'env'>): void;
    destroy(): void;
}

declare class MobilePtz extends BasePtz<BasePtzOptions> {
    $content: HTMLElement;
    constructor(container: HTMLElement, options: BasePtzOptions);
    destroy(): void;
    _render(): void;
    _addEventListener(): void;
    _touchstart(e: PointerEvent | TouchEvent): void;
    _touchend(e: PointerEvent | TouchEvent): void;
    _removeEventListener(): void;
    _handlePtzTouch(e: PointerEvent | TouchEvent, type: 'start' | 'stop'): void;
}

/**
 * @class Ptz
 * @classdesc 云台控制
 *
 * @example
 * // 初始化云台控制
 * // 显示云台控制
 * ptz.show()
 * // 隐藏云台控制
 * ptz.hide()
 */
declare class Ptz extends BasePtz<BasePtzOptions> {
    private _ptzQueue;
    pluginStatus: any;
    private _ptzOperation;
    private readonly _isMobile;
    private _$wrapper;
    private _$directionCircleContainer;
    private _$speedContainer;
    private _$btnContainer;
    private _isRotate;
    private _clearTimer;
    private _onSwitchSpeed;
    constructor(container: HTMLElement, options?: Partial<BasePtzOptions>);
    get isRotate(): boolean;
    /**
     * 是否旋转了
     */
    set isRotate(isRotate: boolean);
    destroy(): void;
    _handlePtzTouch(e: TouchEvent | MouseEvent, type: string): void;
    _handleBtnTouch(btn: string, option: string, type: 'stop' | 'start'): void;
}

export { BasePtz, MobilePtz, Ptz };
export type { BasePtzOptions };
