/**
 * @description 事件发射器
 * @author Ezviz-OpenBiz
 * @since 2026-01-19
 */
type EventCallback = (data: any) => void;
/**
 * 事件发射器类
 */
declare class EventEmitter {
    private events;
    constructor();
    /**
     * 监听事件
     * @param event 事件名称
     * @param callback 回调函数
     */
    on(event: string, callback: EventCallback): void;
    /**
     * 移除事件监听
     * @param event 事件名称
     * @param callback 回调函数
     */
    off(event: string, callback: EventCallback): void;
    /**
     * 触发事件
     * @param event 事件名称
     * @param data 事件数据
     */
    emit(event: string, data?: any): void;
    /**
     * 移除所有事件监听
     */
    removeAllListeners(): void;
}

/**
 * @description 类型定义
 * @author Ezviz-OpenBiz
 * @since 2026-01-19
 */
/**
 * 视频项
 */
interface VideoItem {
    /** 视频ID */
    segId: string;
    /** 视频缩略图URL */
    coverPic: string;
    /** 视频播放URL */
    playUrl: string;
    /** 开始时间 */
    startTime: string;
    /** 结束时间 */
    endTime: string;
    /** 时长（秒） */
    videoLong: number;
    /** 描述 */
    description?: string;
}
/**
 * 重点事件
 */
interface HighlightEvent {
    /** 事件ID */
    eventId: string;
    /** 事件标题 */
    title: string;
    /** 事件描述 */
    description?: string;
    /** 相关视频列表 */
    videos: VideoItem[];
    /** 视频数量 */
    videoCount: number;
}
/**
 * 消息类型
 */
declare enum MessageType {
    /** 用户消息 */
    User = "user",
    /** AI消息 */
    AI = "ai",
    /** 系统消息 */
    System = "system"
}
/**
 * 消息项
 */
interface MessageItem {
    /** 消息ID */
    id: string;
    /** 消息类型 */
    type: MessageType;
    /** 消息内容 */
    content: string;
    /** 时间戳 */
    timestamp: number;
    /** 附加数据（如搜索结果、视频列表等） */
    data?: any;
}

/**
 * @description 服务层类型定义
 * @author Ezviz-OpenBiz
 * @since 2026-01-29
 */
/**
 * 服务配置
 */
interface ServicesOptions {
    /** API 基础路径 */
    baseURL?: string;
    /** 访问令牌 */
    accessToken?: string;
    /** 设备序列号 */
    deviceSerial?: string;
    /** 通道号 */
    channelNo?: number | string;
}
/**
 * 接口响应
 */
interface ApiResponse<T = any> {
    /** 状态码 */
    code: string | number;
    /** 提示信息 */
    msg?: string;
    message?: string;
    /** 数据 */
    data?: T;
}
/**
 * 快捷搜索关键词项
 */
interface SearchKeywordItem {
    /** 序号 */
    sequenceNo: number;
    /** 图标URL */
    iconUrl: string;
    /** 搜索关键词 */
    searchKeyWord: string;
    /** 消息内容 */
    messageContent: string;
}
/**
 * 快捷操作项
 */
interface ActionItem {
    /** 序号 */
    sequenceNo: number;
    /** 操作名称 */
    actionName: string;
    /** 操作类型 */
    actionType: string;
    /** 消息内容 */
    messageContent: string;
}
/**
 * AI对话推荐内容数据
 */
interface ChatSuggestedData {
    /** 标题名称 */
    titleName: string;
    /** 标题图标URL */
    titleUrl: string;
    /** 消息内容 */
    messageContent: string;
    /** 快捷搜索关键词列表 */
    searchKeywordList: SearchKeywordItem[];
    /** 快捷操作列表 */
    actionList: ActionItem[];
}

/**
 * @description AI对话UI控制器
 * @author Ezviz-OpenBiz
 * @since 2026-01-19
 */

/**
 * UI配置选项
 */
interface AIChatUIOptions {
    /** 语言 */
    language: 'zh' | 'en';
    /** 是否移动端 */
    isMobile: boolean;
    /** AI云存储是否已开通 */
    isAICloudEnabled: boolean;
    /** 关闭回调 */
    onClose: () => void;
    /** 发送消息回调 */
    onSendMessage: (message: string) => void;
    /** 快捷操作回调 */
    onQuickAction: (actionType: string, messageContent?: string) => void;
    /** 视频播放回调 */
    onVideoPlay: (video: VideoItem) => void;
    /** 查看全部回调 */
    onViewAll: (videos: VideoItem[]) => void;
    /** 升级服务回调（可选） */
    onUpgradeService?: () => void;
}
/**
 * AI对话UI控制器类
 */
declare class AIChatUI {
    private container;
    private options;
    private rootElement;
    private messageContainer;
    private inputElement;
    private currentView;
    private locale;
    private loadingElement;
    private isDragging;
    private dragStartX;
    private dragStartY;
    private containerStartX;
    private containerStartY;
    private chatSuggestedData;
    private welcomeExamplesContainer;
    private quickActionsContainer;
    private fullscreenChangeHandler;
    private originalParent;
    /**
     * 构造函数
     * @param container 容器元素（用于位置参考）
     * @param options 配置选项
     */
    constructor(container: string | HTMLElement, options: AIChatUIOptions);
    /**
     * 创建UI结构
     */
    private createUI;
    /**
     * 设置全屏监听器
     */
    private setupFullscreenListener;
    /**
     * 调整全屏模式下的位置
     */
    private adjustPositionForFullscreen;
    /**
     * 根据 container 位置更新弹窗位置
     */
    private updatePosition;
    /**
     * 处理拖动开始
     */
    private handleDragStart;
    /**
     * 处理拖动移动
     */
    private handleDragMove;
    /**
     * 处理拖动结束
     */
    private handleDragEnd;
    /**
     * 创建欢迎界面
     */
    private createWelcomeView;
    /**
     * 创建对话界面
     */
    private createChatView;
    /**
     * 创建底部操作栏
     */
    private createFooter;
    /**
     * 处理发送消息
     */
    private handleSendMessage;
    /**
     * 滚动到底部
     */
    private scrollToBottom;
    /**
     * 显示UI
     */
    show(): void;
    /**
     * 隐藏UI
     */
    hide(): void;
    /**
     * 处理窗口大小变化
     */
    private handleResize;
    /**
     * 添加消息
     * @param message 消息项
     */
    addMessage(message: MessageItem): void;
    /**
     * 显示搜索结果
     * @param videos 视频列表
     * @param query 搜索关键词
     */
    showSearchResult(videos: VideoItem[], query: string): void;
    /**
     * 显示视频列表视图
     */
    private showVideoListView;
    /**
     * 显示总结数据
     * @param summary 总结数据
     */
    showSummary(summary: any): void;
    /**
     * 显示错误信息
     * @param message 错误信息
     */
    showError(message: string): void;
    /**
     * 显示加载状态
     */
    showLoading(): void;
    /**
     * 隐藏加载状态
     */
    hideLoading(): void;
    /**
     * 切换视图
     * @param viewType 视图类型：'welcome' | 'chat' | 'summary'
     */
    switchView(viewType: string): void;
    /**
     * 销毁UI
     */
    destroy(): void;
    /**
     * 更新AI对话推荐内容
     * @param data 推荐内容数据
     */
    updateChatSuggested(data: ChatSuggestedData): void;
}

/**
 * @description 服务层导出
 * @author Ezviz-OpenBiz
 * @since 2026-01-29
 */

/**
 * 服务类
 */
declare class Services {
    private _options;
    private controllers;
    constructor(options: ServicesOptions);
    /**
     * 更新配置
     */
    updateOptions(options: Partial<ServicesOptions>): void;
    /**
     * fetch 请求封装
     */
    _fetch(url: string, options?: RequestInit): Promise<Response>;
    /**
     * GET 请求
     */
    get(url: string, options?: {}): Promise<Response>;
    /**
     * POST 请求
     */
    post(url: string, options?: {}): Promise<Response>;
    /**
     * 取消所有请求
     */
    abortAll(): void;
    /**
     * 获取AI对话默认推荐内容
     */
    getChatSuggested(): Promise<ApiResponse<ChatSuggestedData>>;
    /**
     * 发送AI对话内容
     */
    sendAIChatCompletions(message: string): Promise<ApiResponse<void>>;
}

/**
 * @description AI视频搜索对话控制模块
 * @author Ezviz-OpenBiz
 * @since 2026-01-19
 */

/**
 * AI对话配置选项
 */
interface AIChatOptions {
    /** 语言，默认zh */
    language?: 'zh' | 'en';
    /** 容器，支持传入字符串ID或HTMLElement节点 */
    container?: string | HTMLElement;
    /** 是否移动端 */
    isMobile?: boolean;
    /** 初始消息列表 */
    initialMessages?: any[];
    /** 预设问题列表 */
    suggestedQueries?: string[];
    /** AI云存储是否已开通 */
    isAICloudEnabled?: boolean;
    /** 升级服务回调（可选） */
    onUpgradeService?: () => void;
    /** API基础路径 */
    baseURL?: string;
    /** 访问令牌 */
    accessToken?: string;
    /** 设备序列号 */
    deviceSerial?: string;
    /** 通道号 */
    channelNo?: number | string;
}
/**
 * AI视频搜索对话控制类
 */
declare class AIChat {
    /** 版本号 */
    static VERSION: string;
    /** 事件常量 */
    static EVENTS: {
        /** 打开AI对话界面 */
        open: string;
        /** 关闭AI对话界面 */
        close: string;
        /** 用户发送消息（上层需要监听并调用AI接口） */
        messageSent: string;
        /** 快捷操作点击（上层需要监听并处理） */
        quickAction: string;
        /** 视频播放请求 */
        videoPlay: string;
        /** 查看全部视频列表 */
        viewAll: string;
        /** 升级服务点击 */
        upgradeService: string;
        /** 错误事件 */
        error: string;
    };
    /** 配置选项 */
    options: AIChatOptions;
    /** 事件发射器 */
    eventEmitter: EventEmitter;
    /** UI控制器 */
    aiChatUI: AIChatUI;
    /** 服务实例 */
    services: Services | null;
    /** 是否已打开 */
    isOpen: boolean;
    /** 对话历史 */
    messageHistory: any[];
    /** 当前搜索结果 */
    currentSearchResult: VideoItem[];
    /** AI对话推荐内容 */
    chatSuggestedData: ChatSuggestedData | null;
    /**
     * 构造函数
     * @param options 配置选项
     */
    constructor(options: AIChatOptions);
    /**
     * 处理用户消息
     * @param message 消息内容
     */
    private handleUserMessage;
    /**
     * 将响应数据转换为 SummaryData 格式
     * @param data 响应数据
     * @param query 查询关键词
     * @returns SummaryData
     */
    private convertToSummaryData;
    /**
     * 按 videoKeywordInt 的值对数据进行分组
     * @param data 原始数据数组
     * @returns 分组后的数据数组
     */
    private groupByVideoKeywordInt;
    /**
     * 处理快捷操作
     * @param actionType 操作类型
     * @param messageContent 消息内容（可选）
     */
    private handleQuickAction;
    /**
     * 处理视频播放
     * @param video 视频项
     */
    private handleVideoPlay;
    /**
     * 处理查看全部
     * @param videos 视频列表
     */
    private handleViewAll;
    /**
     * 处理升级服务
     */
    private handleUpgradeService;
    /**
     * 加载AI对话推荐内容
     */
    private loadChatSuggested;
    /**
     * 打开AI对话界面
     */
    open(): void;
    /**
     * 关闭AI对话界面
     */
    close(): void;
    /**
     * 添加用户消息（由上层调用）
     * @param message 消息内容
     */
    addUserMessage(message: string): void;
    /**
     * 添加AI消息（由上层调用）
     * @param message 消息内容
     * @param data 附加数据
     */
    addAIMessage(message: string, data?: any): void;
    /**
     * 显示搜索结果（由上层调用）
     * @param videos 视频列表
     * @param query 搜索关键词
     */
    showSearchResult(videos: VideoItem[], query: string): void;
    /**
     * 显示总结数据（由上层调用）
     * @param summary 总结数据
     */
    showSummary(summary: any): void;
    /**
     * 显示重点事件（由上层调用）
     * @param highlights 重点事件列表
     */
    showHighlights(highlights: HighlightEvent[]): void;
    /**
     * 显示错误信息（由上层调用）
     * @param message 错误信息
     */
    showError(message: string): void;
    /**
     * 显示加载状态（由上层调用）
     */
    showLoading(): void;
    /**
     * 隐藏加载状态（由上层调用）
     */
    hideLoading(): void;
    /**
     * 更新配置
     * @param options 新的配置选项
     */
    updateOptions(options: Partial<AIChatOptions>): void;
    /**
     * 监听事件
     * @param event 事件名称
     * @param callback 回调函数
     */
    on(event: string, callback: (data: any) => void): void;
    /**
     * 移除事件监听
     * @param event 事件名称
     * @param callback 回调函数
     */
    off(event: string, callback: (data: any) => void): void;
    /**
     * 销毁实例
     */
    destroy(): void;
}

export { AIChat as default };
export type { AIChatOptions };
