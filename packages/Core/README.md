# @ezuikit/control-core

控件公共能力：AlarmMessage、Broadcast、Talk、TimeLine、AIChat、DatePicker、Ptz 等控件共用的日志、多语言、设备与鉴权配置和接口请求。

控件以**继承**的方式使用：没有父类的控件直接 `extends ControlCore`；已有父类的控件（如继承 Drawer 的 Broadcast / AlarmMessage、继承 EventEmitter 的 AIChat）用 `extends ControlCoreMixin(Base)`。控件实例因此直接具有 `t()`、`logger`、`i18n`、`services` 等成员，宿主侧的配置项在各控件中保持一致：

| 配置项            | 说明                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `language`        | 语言，默认 `'zh'`；传入 `i18n` 时忽略（使用 `i18n` 当前的语言）                                                                                  |
| `i18n`            | 多语言实例（`@ezuikit/utils-i18n`），如与播放器共用；控件以追加的方式（`appendTranslations`）写入文案，不切换它的语言                            |
| `prefixLocaleKey` | 文案在 I18n 中的命名空间（key 前缀），缺省为控件的默认值（如 `broadcast`）；传空串表示不加前缀，支持 `a.b` 多级                                  |
| `locales`         | 自定义文案 `{ [语言]: { key: text } }`（不带前缀），在内置文案之后追加：覆盖同名 key，也可以增加新语言                                           |
| `logger`          | 日志实例（`@ezuikit/utils-logger`），以控件名为上下文（`logger.context(name)`，前缀 `[name]`）；缺省时内部创建                                   |
| `deviceSerial`    | 设备序列号                                                                                                                                       |
| `channelNo`       | 通道号                                                                                                                                           |
| `accessToken`     | 访问令牌                                                                                                                                         |
| `token`           | 小权限 token：`deviceToken.video` / `deviceToken.global` / `streamToken.talk`（`live` / `rec`）/ `httpToken.url`；`accessToken` 优先，未传时使用 |
| `env.domain`      | 接口域名，默认 `https://open.ys7.com`，末尾的 `/` 会被去掉                                                                                       |

`language` / `i18n` / `prefixLocaleKey` / `locales` / `logger` 只在构造时生效；设备与鉴权字段（`deviceSerial` / `channelNo` / `accessToken` / `token` / `env`）保存在实例的 `services` 中，可用 `updateServiceOptions` 在运行期更新（控件的 `updateOptions` 中调用）。

## 安装

```bash
pnpm add @ezuikit/control-core
```

## 在控件中使用

### 没有父类：继承 ControlCore

构造参数为 `(options, config)`：`options` 是宿主传入的配置（可直接传控件的完整配置，只读取公共字段），`config` 是控件自身的配置。

```ts
import { ControlCore, type ControlCoreOptions } from '@ezuikit/control-core';
import zh from './locales/zh_CN'; // { title: '对讲', remaining: '还可录制 {{time}} 秒' }
import en from './locales/en_US';

const LOCALES = { zh, en };

export interface TalkOptions extends ControlCoreOptions {
  deviceSerial: string;
  onOpen?: () => void;
}

class Talk extends ControlCore<typeof LOCALES> {
  constructor(options: TalkOptions) {
    super(options, {
      name: 'Talk', // 日志上下文
      prefixLocaleKey: 'talk', // 默认命名空间，宿主可用 options.prefixLocaleKey 覆盖
      locales: LOCALES, // 内置文案（不带前缀），类型参数 L 用于 t() 的 key 提示
      defaults: { channelNo: 1 }, // 设备与鉴权的缺省值
    });

    this.logger.log('init');
    this.t('title'); // '对讲'
    this.t('remaining', { time: 12 }); // '还可录制 12 秒'
  }

  async send(fileUrl: string) {
    // 设备与鉴权配置保存在 services 中；accessToken 优先，未传时按接口类型使用小权限 token
    const { accessToken, token, deviceSerial, channelNo } = this.services;
    const body = new FormData();
    body.append('accessToken', accessToken || token?.deviceToken?.video || '');
    body.append('deviceSerial', deviceSerial ?? '');
    body.append('channelNo', String(channelNo));
    body.append('fileUrl', fileUrl);
    await this.services.post('/api/lapp/voice/send', { body, headers: null });
  }

  updateOptions(options: Partial<TalkOptions>) {
    this.updateServiceOptions(options); // 只处理设备与鉴权字段，下次请求生效
  }

  destroy() {
    this.services.destroy(); // 取消进行中的请求（ControlCore 不会自动调用）
  }
}
```

### 已有父类：继承 ControlCoreMixin(Base)

`ControlCoreMixin(Base)` 返回继承 `Base` 的类，构造参数为 `(options, config, ...Base 的构造参数)`。`Base` 的构造函数先执行，此时 `t()`、`logger`、`services` 等还不可用，依赖它们的部分放到 `super()` 之后：

```ts
import Drawer from '@ezuikit/control-drawer';
import { ControlCoreMixin } from '@ezuikit/control-core';

class Broadcast extends ControlCoreMixin(Drawer)<typeof LOCALES> {
  constructor(container: string | HTMLElement, options: BroadcastOptions) {
    super(options, { name: 'Broadcast', prefixLocaleKey: 'broadcast', locales: LOCALES }, container, { placement: 'right' });
    this.setTitle(this.t('title')); // Drawer 的方法与 ControlCore 的成员共存
  }

  // Drawer 也有 updateOptions，ControlCore 的方法名为 updateServiceOptions，不冲突
  updateOptions(options: Partial<BroadcastOptions>) {
    this.updateServiceOptions(options);
  }
}
```

混入的实例不是 `ControlCore` 的实例（`instanceof` 为 false），需要识别时用 `isControlCore(value)`。`Base` 可以是 ES5 构造函数，也可以是未编译的原生 ES6 class（内部用 `Reflect.construct` 构造父类）。

继承后控件实例上会出现下列公共成员（类型见 `ControlCoreApi`），控件自身不要再声明同名成员（如 `language` 字段、`logger` / `services` 私有字段）。`t` 等是原型方法，作为回调传出时需要绑定：`(key, v) => this.t(key, v)`。

## 成员速查

### 日志

| 成员     | 说明                                                                                 | 示例                                                  |
| -------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------- |
| `name`   | 控件名（`config.name`），即日志上下文                                                | `this.name // 'Broadcast'`                            |
| `logger` | 宿主 `options.logger.context(name)` 或内部创建的 Logger；没有 `context()` 时直接使用 | `this.logger.warn('slow') // [Broadcast] [WARN] slow` |

### 多语言

| 成员                 | 说明                                                                   | 示例                                                     |
| -------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------- |
| `i18n`               | 多语言实例：宿主的 `options.i18n` 或按 `language` 新建                 | `this.i18n.switchLocale('en')`                           |
| `isExternalI18n`     | `i18n` 是否由宿主传入                                                  | `if (!this.isExternalI18n) this.i18n.switchLocale('en')` |
| `language`           | 当前语言（`i18n.locale`）；按语言分支时读它，不要读 `options.language` | `/^zh/i.test(this.language)`                             |
| `prefixLocaleKey`    | 文案命名空间                                                           | `this.prefixLocaleKey // 'broadcast'`                    |
| `localeKey(key)`     | 完整 key                                                               | `this.localeKey('title') // 'broadcast.title'`           |
| `t(key, variables?)` | 取文案，`{{name}}` 插值，缺少时用兜底语言                              | `this.t('remaining', { time: 12 }) // '还可录制 12 秒'`  |
| `messages`           | 当前语言的全部文案（兜底语言在下，新对象），适合数组等非字符串文案     | `const { months } = this.messages`                       |
| `appendLocales(...)` | 运行期追加文案（自动加命名空间，数组整体替换）                         | `this.appendLocales({ zh: { extra: '额外' } })`          |

### 设备与鉴权、接口请求

| 成员                     | 说明                                                                                                                              | 示例                                                        |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `services`               | 接口请求服务（`Services`），同时保存设备与鉴权配置：`options` / `deviceSerial` / `channelNo` / `accessToken` / `token` / `domain` | `this.services.get('/api/x')`、`this.services.deviceSerial` |
| `updateServiceOptions()` | 更新设备与鉴权配置（即 `services.updateOptions`），在控件的 `updateOptions` 中调用                                                | `this.updateServiceOptions({ accessToken: 'at.new' })`      |

详见下文 [设备与鉴权](#设备与鉴权) 与 [接口请求](#接口请求)。每个成员的完整说明与示例见 `src/interface.ts` 中的 `ControlCoreApi`（编辑器悬停可见）。

## 多语言

内置文案与宿主的 `locales` 合并后，一次性以**追加**的方式写入 I18n 实例，放在命名空间 `prefixLocaleKey` 下：

```text
未传 i18n：new I18n({}, { defaultLocale: language })  →  appendTranslations({ zh: { broadcast: {...} }, en: {...} })
传入 i18n：直接使用它（不切换语言）                    →  appendTranslations(...)，宿主其它命名空间（player.* 等）不受影响
```

- `t(key, variables)` 取 `${prefixLocaleKey}.${key}`，支持 `{{name}}` 插值。当前语言缺少该文案，或当前语言完全没有文案（宿主处于控件不支持的语言）时，用兜底语言（默认 `zh`，可用 `fallbackLanguage` 修改）的文案，不展示 `[missing ...]`；兜底文案包含内置文案、宿主 `locales` 与运行期 `appendLocales` 追加的同语言文案。
- `messages` 返回当前语言的全部文案对象（兜底语言的文案在下），适用于文案中有数组等非字符串的控件（如 DatePicker 的 `months`）。
- 追加时数组整体替换而不是拼接：`appendTranslations` 内部的 deepmerge 默认会拼接数组，多个控件共用一个 I18n 时会出现重复。
- 追加后命名空间下的同名 key 以控件的文案为准（内置文案 + `locales`）；需要定制文案时用 `options.locales`。
- `appendLocales(locales)` 可在运行期补充文案。
- `language` 是 I18n 的当前语言：宿主传入 `i18n` 时 `options.language` 被忽略，宿主切换 I18n 语言后 `language` / `t()` / `messages` 随之变化。控件里按语言分支（如表头「年 月」与「月 年」的顺序）时读 `this.language`，不要读 `options.language`。

```ts
import I18n from '@ezuikit/utils-i18n';

// 与播放器共用一个多语言实例，并覆盖广播标题
const i18n = new I18n({ zh: { player: { play: '播放' } } }, { defaultLocale: 'zh' });

new Broadcast('player', { deviceSerial: '<serial>', accessToken: '<token>', i18n, locales: { zh: { title: '对讲喊话' } } });

i18n.t('player.play'); // '播放'
i18n.t('broadcast.title'); // '对讲喊话'
```

## 设备与鉴权

设备与鉴权配置保存在实例的 `services`（`Services`）中，控件实例上不再有 `deviceSerial` / `accessToken` 等 getter：

```ts
const talk = new Talk({ deviceSerial: 'BC1234567', accessToken: 'at.xxx', token: { deviceToken: { video: 'dt.video' } }, env: { domain: 'https://open.ys7.com/' } });

talk.services.domain; // 'https://open.ys7.com'（去掉末尾 /）
talk.services.accessToken || talk.services.token?.deviceToken?.video; // 'at.xxx'（accessToken 优先）
new Talk({ token: { deviceToken: { video: 'dt.video' } } }).services.token?.deviceToken?.video; // 未传 accessToken 时使用小权限 token

talk.updateOptions({ accessToken: 'at.new', token: undefined }); // 控件内调用 updateServiceOptions
talk.services.options; // { channelNo: 1, deviceSerial: 'BC1234567', accessToken: 'at.new', token: undefined, env: {...} }
```

| 成员 | 说明 |
| --- | --- |
| `services.options` | 当前的设备与鉴权配置（副本） |
| `services.deviceSerial` / `services.channelNo` / `services.accessToken` | 对应字段（`accessToken` 未传时为空串） |
| `services.token` | 小权限 token 对象，`accessToken` 优先，未传时按接口类型取用：`accessToken \|\| token?.deviceToken?.video \|\| ''`（`deviceToken.global` / `httpToken.url` / `streamToken.talk` 同理）；默认请求头只带 `accessToken`，小权限 token 需要自己放进请求头或表单 |
| `services.domain` | 接口域名（去掉末尾 `/`），缺省 `https://open.ys7.com` |
| `updateServiceOptions(options)` | 实例方法，即 `services.updateOptions`：浅合并（`token` / `env` 整体替换），只处理设备与鉴权字段；传 `undefined` 可清除字段 |

## 接口请求

继承后的实例带有 `services`（`Services` 实例，每个实例一个），它同时保存设备与鉴权配置，`updateServiceOptions` 会更新它：

- 地址：相对路径前加 `domain`（`env.domain`，缺省 `https://open.ys7.com`），开头的 `/` 可省略，`http(s)://` 开头的地址原样使用；
- 请求头：默认携带 `clientType: 'ezuikit'` 与已配置的 `accessToken`、`deviceSerial`、`localIndex`（通道号），`options.headers`（对象 / 数组 / `Headers`）中的同名字段优先；`headers: null` 表示不携带任何请求头。开放平台的表单接口（`/api/lapp/...`）请用 `headers: null`，保持简单请求、避免跨域预检；
- 方法：`get` / `post` / `put` / `delete` 覆盖 `options.method`；`request` 使用 `options.method`（不传时为 fetch 默认的 GET）；其它 fetch 参数（`body` / `keepalive` / `credentials` 等）原样传出；
- 取消：`abortAll()` / `destroy()` 以 `abort('abort fetch')` 取消进行中的请求，被取消的请求 reject（原因为 `signal.reason`）；第三个参数 `setSignal = false` 的请求不受影响，可自行传 `signal`（如超时控制）；
- 返回原始 `Response`，由调用方解析；网络错误原样 reject。

```ts
class Talk extends ControlCore<typeof LOCALES> {
  async getTalkMode() {
    const res = await this.services.get(`/api/service/device/talkMode?deviceSerial=${this.services.deviceSerial}`);
    return await res.json();
  }

  async sendVoice(fileUrl: string) {
    const { accessToken, token, deviceSerial } = this.services;
    const body = new FormData();
    body.append('accessToken', accessToken || token?.deviceToken?.video || '');
    body.append('deviceSerial', deviceSerial ?? '');
    body.append('fileUrl', fileUrl);
    const res = await this.services.post('/api/lapp/voice/send', { body, headers: null });
    return await res.json();
  }

  destroy() {
    this.services.destroy(); // 取消进行中的请求
  }
}
```

| 成员                                                   | 说明                                                                             |
| ------------------------------------------------------ | -------------------------------------------------------------------------------- |
| `get / post / put / delete(url, options?, setSignal?)` | 对应方法的请求，返回 `Promise<Response>`                                         |
| `request(url, options?, setSignal?)`                   | 通用请求（方法由 `options.method` 指定）                                         |
| `options` / `domain` / `headers` / `pending`           | 当前配置（副本）、域名、默认请求头、进行中（可取消）的请求数                     |
| `deviceSerial` / `channelNo` / `accessToken` / `token` | 设备与鉴权字段（见 [设备与鉴权](#设备与鉴权)）                                   |
| `updateOptions(options)`                               | 浅合并设备与鉴权配置（`token` / `env` 整体替换），由 `updateServiceOptions` 调用 |
| `abortAll()` / `destroy()`                             | 取消进行中的请求；之后仍可发请求，配置保留                                       |

`Services` 也可以单独使用：`new Services({ deviceSerial, channelNo, accessToken, env })`。

需要在接口服务上扩展业务方法时，继承 `Services` 并通过 `config.createServices` 传入，子类中用 `declare readonly services: XxxServices` 收窄类型（AIChat 即如此）。`createServices` 收到 `defaults` 与宿主配置合并后的初始配置；子类可重写 `updateOptions`（如把 `baseURL` 作为 `env.domain`），`updateServiceOptions` 会经过它：

```ts
import EventEmitter from 'eventemitter3';
import { ControlCoreMixin, Services } from '@ezuikit/control-core';

class AIChatServices extends Services {
  // 兼容旧配置：baseURL 作为接口域名
  updateOptions(options?: Partial<ControlServiceOptions> & { baseURL?: string }) {
    const { baseURL, ...rest } = options ?? {};
    super.updateOptions({ ...rest, ...(baseURL !== undefined ? { env: { domain: baseURL } } : {}) });
  }

  async getChatSuggested() {
    const res = await this.get(`/api/service/open/cloud/intelligent/storage/chat/suggested?accessToken=${this.accessToken}`);
    return await res.json();
  }
}

class AIChat extends ControlCoreMixin(EventEmitter)<typeof LOCALES> {
  declare readonly services: AIChatServices; // 实例上的 services 即 AIChatServices

  constructor(options: AIChatOptions) {
    super(options, { name: 'AIChat', prefixLocaleKey: 'aichat', locales: LOCALES, createServices: (o) => new AIChatServices(o) });
    if (this.services.accessToken) void this.services.getChatSuggested();
  }

  updateOptions(options: Partial<AIChatOptions>) {
    this.updateServiceOptions(options); // 经过 AIChatServices.updateOptions
  }
}
```

## 工具函数

| 函数 | 说明 |
| --- | --- |
| `isControlCore(value)` | 是否为 ControlCore 的实例（含 `ControlCoreMixin` 混入的控件） |
| `createControlLogger(name, logger?)` | 创建以控件名为上下文的日志实例 |
| `mergeOptions(...sources)` | 深度合并配置项（`deepmerge.all`，`clone: false`）：普通对象递归合并、数组拼接；只在某一侧出现的类实例（`I18n`、logger、DOM 节点）按引用保留，`Date` / `RegExp` 后者覆盖。同名属性两侧都是类实例时会被当作普通对象合并，默认配置里不要放类实例 |
| `mergeTranslations(...sources)` | 深度合并多语言字典，返回新对象，数组整体替换 |
| `prefixLocales(locales, prefix)` | 给每种语言的文案加上命名空间 |
| `getByPath(source, 'a.b')` | 按点分路径取值 |
| `interpolate(text, variables)` | `{{name}}` 插值，缺少的变量保留占位符 |

```ts
import { createControlLogger, getByPath, interpolate, isControlCore, mergeOptions, mergeTranslations, prefixLocales } from '@ezuikit/control-core';

isControlCore(broadcast); // true
createControlLogger('MyControl').log('init'); // [MyControl] [LOG] init

const options = mergeOptions<MyOptions>(DEFAULT_OPTIONS, { env: { domain: 'https://a.com' }, i18n });
options.i18n === i18n; // true（只在宿主一侧，按引用保留）

mergeTranslations({ a: { b: '1', c: '2' }, list: ['x'] }, { a: { b: '3' }, list: ['y'] }); // { a: { b: '3', c: '2' }, list: ['y'] }
prefixLocales({ zh: { a: '1' } }, 'p.q'); // { zh: { p: { q: { a: '1' } } } }
getByPath({ a: { b: 'x' } }, 'a.b'); // 'x'
interpolate('{{name}} 还可录制 {{time}} 秒', { time: 30 }); // '{{name}} 还可录制 30 秒'
```

常量：`DOMAIN`（`'https://open.ys7.com'`）、`DEFAULT_LANGUAGE`（`'zh'`）、`DEFAULT_FALLBACK_LANGUAGE`（`'zh'`）。

## 类型

全部类型定义在 `src/interface.ts`，从包入口导出：

| 类型                                                                | 说明                                                                                                          |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `ControlCoreOptions`                                                | 宿主配置（控件配置类型继承它）                                                                                |
| `ControlServiceOptions` / `ControlToken` / `ControlEnv`             | 设备与鉴权配置、小权限 token、环境配置                                                                        |
| `ServicesRequestInit`                                               | `Services` 的请求参数（`RequestInit`，`headers` 支持 `null`）                                                 |
| `ControlCoreConfig<L>`                                              | 控件自身的配置（`name` / `prefixLocaleKey` / `locales` / `fallbackLanguage` / `defaults` / `createServices`） |
| `ControlCoreApi<L>`                                                 | 继承后获得的公共成员                                                                                          |
| `ControlCoreMixinClass<TBase>` / `Constructor`                      | `ControlCoreMixin` 的返回类型与父类约束                                                                       |
| `ControlLocales` / `ControlLocaleMessages` / `ControlMessageRecord` | 多语言字典、某一语言的文案、文案对象                                                                          |
| `ControlLocaleKey<L>` / `ControlLanguage` / `TranslateVariables`    | 文案 key、语言、插值变量                                                                                      |
| `I18n` / `I18nTranslation` / `LoggerCls`                            | 依赖包类型的转出                                                                                              |

## 目录结构

```text
src/
├── index.ts         包入口（ESM / CJS）：ControlCore / ControlCoreMixin / isControlCore / Services / 工具函数 / 常量 / 类型
├── main.ts          UMD 入口（全局变量 EzuikitControlCore，导出与 index.ts 相同）
├── ControlCore.ts   ControlCore / ControlCoreMixin / isControlCore
├── services.ts      Services：设备与鉴权配置 + 接口请求（实例上的 services）
├── interface.ts     全部类型与接口
├── utils.ts         工具函数
├── constant.ts      常量
└── __tests__/       单元测试（见下文「测试」，覆盖率 100%）
public/index.html    交互示例
```

## 各控件的默认命名空间

| 控件         | 继承方式                            | 日志上下文     | `prefixLocaleKey` 默认值 |
| ------------ | ----------------------------------- | -------------- | ------------------------ |
| AlarmMessage | `ControlCoreMixin(Drawer)`          | `AlarmMessage` | `alarm`                  |
| Broadcast    | `ControlCoreMixin(Drawer)`          | `Broadcast`    | `broadcast`              |
| Talk         | `ControlCore`                       | `Talk`         | `talk`（对讲错误码文案） |
| TimeLine     | `ControlCore`（基类 BaseTimeLine）  | `TimeLine`     | `timeline`               |
| AIChat       | `ControlCoreMixin(EventEmitter)`    | `AIChat`       | `aichat`                 |
| DatePicker   | `ControlCore`（面板基类 Container） | `DatePicker`   | `datePicker`             |
| Ptz          | `ControlCore`（基类 BasePtz）       | `Ptz`          | `ptz`                    |

## 示例

`public/index.html` 演示全部配置与 API：左侧填写宿主配置（`language` / `i18n` / `prefixLocaleKey` / `locales` / `logger` / 设备与鉴权）与控件配置（`name` / `prefixLocaleKey` / `fallbackLanguage` / `locales` / `defaults`），选择继承方式（`ControlCore` 或 `ControlCoreMixin(Panel)`）后创建实例；右侧显示实例状态，并可调用 `t()` / `localeKey()` / `appendLocales()` / `i18n.switchLocale()` / `services` 的设备与鉴权字段 / `updateServiceOptions()` / `services.*` 请求（模拟接口回显请求，可演示 `abortAll()`）/ `logger.*` 与全部工具函数，console 输出同步显示在页面上。各区块标题可点击折叠 / 展开（顶部有「全部展开 / 全部折叠」，状态保存在 localStorage），实例状态中的 `messages` / `services.options` / `services.token` / `i18n.translations` 可单独折叠。

```bash
pnpm dev    # http://localhost:3016
```

开发服务器提供 `public/`、`dist/` 与 `node_modules/`：示例加载本包的 UMD 产物 `index.umd.js`（全局变量 `EzuikitControlCore`）以及 `@ezuikit/utils-i18n`、`@ezuikit/utils-logger` 的 UMD 产物（全局变量 `I18n`、`Logger`）。

## 注意事项

- 构造顺序：`ControlCoreMixin(Base)` 中 `Base` 的构造函数先执行，此时 `t()`、`logger`、`services` 等还不可用，依赖它们的初始化（如设置标题）放到 `super()` 之后。
- 命名冲突：控件自身不要声明与公共成员同名的成员（`name` / `logger` / `i18n` / `language` / `messages` / `t` / `services` 等）；父类已有同名方法（如 Drawer 的 `updateOptions`）不受影响，ControlCore 的更新方法叫 `updateServiceOptions`。需要扩展 `services` 时用 `config.createServices` 换成子类，不要自己再声明 `services` 字段。
- 回调绑定：`t` 等是原型方法，作为回调传出时需要绑定：`(key, v) => this.t(key, v)`。
- 只在构造时生效：`language` / `i18n` / `prefixLocaleKey` / `locales` / `logger`；设备与鉴权字段可用 `updateServiceOptions` 运行期更新，下次请求生效。
- 当前语言：按语言分支时读 `this.language`，不要读 `options.language`（控件默认配置里常带 `language: 'zh'`，且传入 `i18n` 时它被忽略）。
- 内置文案：通过 `config.locales` 传给 ControlCore，不要再放进控件的默认配置（`options.locales`）里：默认配置经 `mergeOptions` 与宿主配置合并时，`months` 等数组会被拼接。
- token 优先级：`accessToken` 优先，未传 `accessToken` 时才按接口类型使用小权限 token；没有任何 token 时用 `|| ''` 兜底，避免把 `undefined` 传给 `FormData` / 请求头。
- 请求头：开放平台表单接口（`/api/lapp/...`）用 `headers: null`；其它接口带默认请求头时，确认服务端的跨域规则允许 `clientType` / `accessToken` / `deviceSerial` / `localIndex`。
- 销毁：ControlCore 没有 `destroy()`，控件销毁时自己调用 `this.services.destroy()` 取消进行中的请求。
- `mergeOptions`：默认配置里不要放类实例（`I18n`、logger 等），由宿主单侧传入；两侧都有同名类实例时会被合并成普通对象。
