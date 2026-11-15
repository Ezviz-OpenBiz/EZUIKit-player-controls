# Changelog

All notable changes to this project will be documented in this file.

## [0.0.1-beta.1] - 2026-11-15

### Added

- `ControlCore`：控件公共能力的基类（控件以继承的方式使用，构造参数 `(options, config)`），统一处理 `language` / `i18n` / `prefixLocaleKey` / `locales` / `logger` / `deviceSerial` / `channelNo` / `accessToken` / `token` / `env.domain`
  - 日志：以控件名为上下文（`logger.context(name)`），没有 `context()` 的 logger 直接使用
  - 多语言：内置文案（`config.locales`）与宿主 `locales` 以追加的方式写入 I18n（宿主传入的实例或按 `language` 新建），放在命名空间 `prefixLocaleKey` 下；`t()` 支持插值与兜底语言（兜底文案含宿主 `locales` 与运行期 `appendLocales` 追加的同语言文案），`messages` 返回当前语言的全部文案；追加时数组整体替换；`language` 为 I18n 的当前语言
  - 设备与鉴权：配置保存在实例的 `services` 中（`services.options` / `deviceSerial` / `channelNo` / `accessToken` / `token` / `domain`），实例上用 `updateServiceOptions()` 运行期更新；`config.defaults` 提供缺省值
  - token 优先级：`accessToken` 优先于小权限 token（`token.*`），未传 `accessToken` 时才按接口类型使用小权限 token：`accessToken || token?.deviceToken?.video || ''`
- `ControlCoreMixin(Base)`：给已有父类的控件（继承 Drawer、EventEmitter 等）混入 ControlCore，构造参数 `(options, config, ...Base 的构造参数)`；`Base` 可以是 ES5 构造函数或原生 ES6 class（用 `Reflect.construct` 构造父类）；`isControlCore(value)` 识别两种方式的实例
- `Services`（`src/services.ts`）：保存设备与鉴权配置并发出请求，继承后的实例通过 `this.services` 使用（每个实例一个），也可以单独 `new Services(options)`
  - 地址拼接 `domain`；默认携带 `clientType` / `accessToken` / `deviceSerial` / `localIndex` 请求头，`headers: null` 不携带任何请求头（开放平台表单接口）
  - `get` / `post` / `put` / `delete` / `request`，返回原始 `Response`；`abortAll()` / `destroy()` 取消进行中的请求，`setSignal = false` 的请求不受影响
  - 控件可用 `config.createServices` 换成扩展了业务接口的子类（如 AIChat），子类可重写 `updateOptions`
- 工具函数：`createControlLogger`、`mergeOptions`（`deepmerge.all`，`clone: false`：只在一侧出现的类实例按引用保留；同名属性两侧都是类实例时会被合并成普通对象，默认配置里不要放类实例）、`mergeTranslations`、`prefixLocales`、`getByPath`、`interpolate`；常量 `DOMAIN` / `DEFAULT_LANGUAGE` / `DEFAULT_FALLBACK_LANGUAGE`
- 类型（集中在 `src/interface.ts`）：`ControlCoreOptions`、`ControlCoreConfig`、`ControlCoreApi`、`ControlCoreMixinClass`、`ControlServiceOptions`、`ServicesRequestInit`、`ControlLocales`、`ControlToken`（含 `streamToken.live` / `rec`）、`ControlEnv` 等；各类型、成员与工具函数的 JSDoc 均带示例
- UMD 产物 `dist/index.umd.js`（全局变量 `EzuikitControlCore`，导出全部公共 API）
- 示例 `public/index.html`：全部配置项与 API 的交互演示（`pnpm dev`，端口 3016）；区块标题可折叠，实例状态中的 `messages` / `services.options` / `services.token` / `i18n.translations` 可折叠
- 单元测试（`pnpm test`，按模块拆分为 `ControlCore` / `mixin` / `services` / `utils` / `index` 五个文件，公共工具在 `helpers.ts`），覆盖率 100%，`pnpm test:coverage` 要求各项不低于 98%
