# HAjax

浏览器端高可用前端请求解决方案

[![npm version](https://img.shields.io/npm/v/hajax.svg?style=flat-square)](https://www.npmjs.org/package/hajax)
[![install size](https://packagephobia.now.sh/badge?p=hajax)](https://packagephobia.now.sh/result?p=hajax)
[![build status](https://travis-ci.org/Bennnis/HAjax.svg?branch=master)](https://travis-ci.org/bennnis/hajax)
[![gitter chat](https://img.shields.io/gitter/room/mzabriskie/hajax.svg?style=flat-square)](https://gitter.im/bennnis/Lobby)
[![Open Source Helpers](https://www.codetriage.com/bennnis/hajax/badges/users.svg)](https://www.codetriage.com/bennnis/hajax)

## 特性

- 轻松的处理Ajax缓存数据，前端请求并发
- 简便的debounce和throttle操作
- 请求拦截器和响应拦截器
- 请求取消
- 失败重试
- 类Promise的链式调用
- 自动转换JSON类型的响应数据

## 安装

使用 npm:

```bash
$ npm install hajax
```

标签引入

```html
<script src="hx.min.js"></script>
```

## 基本使用

执行一个 `GET` 请求

```js
import hx from 'hajax'

// 请求一个用于测试的 restful api
hx.get('http://jsonplaceholder.typicode.com/users/1')
  .then(function (response) {
    // 请求成功捕获
    console.log(response);
  })
  .catch(function (error) {
    // 请求失败捕获
    console.log(error);
  })
```

执行一个 `POST` 请求

```js
// 请求一个用于测试的 restful api
hx.post('/posturl')
  .then(function (response) {
    // 请求成功捕获
    console.log(response);
  })
  .catch(function (error) {
    // 请求失败捕获
    console.log(error);
  })
```

执行并发请求：`all`（阻塞型）

```js
function getOne() {
  return hx.get('/geturl1');
}

function getTwo() {
  return hx.get('/geturl2');
}

hx.all([getOne(), getTwo()])
  .then((function (responses) {
    // 当all方法里面的所有请求都执行成功的时候才会执行此处的方法
    // responses是一个包含了以上两个请求返回数据的有序数组，按入参顺序排列
    // 如果希望使用此API又不希望被某一个失败请求阻塞，可以尝试以下方法
  }));
```

执行并发请求：`all`（非阻塞型）

```js
function getOne() {
  return new Promise((resolve, reject) => {
    hx.get('/geturl1')
       .then(function (resp) {
         resolve(resp)
       })
       .catch(() => {
         resolve()
       })
  })
}

function getTwo() {
  return new Promise((resolve, reject) => {
    hx.get('/geturl2')
       .then(function (resp) {
         resolve(resp)
       })
       .catch(() => {
         resolve()
       })
  })
}

hx.all([getOne(), getTwo()])
  .then((function (responses) {
    // 在此处遍历处理responses参数，判断响应是否为undefined，是则表示请求失败
  }));
```

## 缓存配置

使用 `hajax` 更加方便地处理请求和数据缓存

### 正常情况

常规缓存：

运行过程：

1. 判断是否有缓存数据
2. 不存在则发送请求，获取响应数据后放入缓存
3. 后续请求读取缓存数据

缓存机制：

必须等第一个请求成功后，后续的请求才会使用缓存，在相同请求并发的场景下（一般是代码写得不好造成的），还是会同时发送多个相同的请求；过期时间一般从存入数据开始计算

不足：

使用不方便，方法需要自己封装，并发请求是缓存失效，增加维护成本。

---

hajax：

运行过程：

1. 判断是否有缓存数据
2. 判断是否满足缓存策略
3. 发送请求，如果满足缓存策略则将获取到的响应数据放入缓存
4. 下一个满足缓存策略的请求判断缓存是否过期
5. 如果未过期则直接读取缓存，过期则重新获取数据刷新缓存

缓存机制：

在第一个请求发送出去后，则开启缓存缓冲区，并开始计算缓存过期时间，在过期时间到达之前的所有请求都将会放入请求缓冲区的回调触发中，在第一个请求完成的时候将数据分发到回调缓冲区等待的请求进行处理

不足：

默认当第一个请求失败时，后续的所有请求都将会失败，这里的解决方案可能还有待讨论，目前可通过在第一个请求上面加上 `retryLimit` 增加失败重试机制（我的想法是准备一个自动重试的开关，重试次数为当前相同请求的个数）

### 使用方法

缓存策略的三种配置方案

1. 确定的url: 在字符串匹配模式下，http://www.api.com 不等同于 www.api.com，这种缓存的匹配策略还有很多可以改善的地方，如果你有什么想法，随时可以告诉我
2. 正则表达式
3. '*'

```js
//通过setStrategy配置缓存
//通过createStrategy生成缓存策略

hx.setStrategy(
	hx.createStrategy('http://majax.test/index.php', 4000)
)

//直接发送请求并将数据缓存
hx.get('http://majax.test/index.php').then(resp => {
	console.log('success', resp)
}).catch(resp => {
	console.log('failed', resp)
})

setTimeout(() => {
	//直接获取缓存数据
	hx.get('http://majax.test/index.php').then(resp => {
		console.log('success', resp)
	}).catch(resp => {
		console.log('failed', resp)
	})

	setTimeout(() => {
		//缓存过期，重新请求获取数据
		hx.get('http://majax.test/index.php').then(resp => {
			console.log('success', resp)
		}).catch(resp => {
			console.log('failed', resp)
		})
	}, 3000)
}, 3000)
```

## HAjax API

可以通过将相关配置传递给特定的请求来进行定制请求。

##### hx.request(config)

```js
// 使用 request 方法发送一个 POST 请求
hx.request({
  method: 'post',
  url: '/url',
  data: {
    name: 'bennnis'
  }
});

// 直接使用 post 方法
hx.post('/url', {
  data: {
    name: 'bennnis'
  }
});
```

### 请求方法别名

为了更方便的调用对应的请求方法，我为所有的请求方法都提供了对应的别名，目前只支持 `GET` 和 `POST`, 其他方法我会在后续加入

##### hx.request(config)
##### hx.get(url[, config])
##### hx.post(url[, config])

### 并发请求方法

使用一下函数可以更好的处理并发请求

##### hx.all(requests: Array\<Promise>)
##### hx.race(requests: Array\<Promise>)

### 创建实例

你可以创建一个拥有特定属性的全新实例用于可能在系统中出现的非常规情形
新实例和默认 `hx` 实例的使用完全相同

##### hx.create([config])

```js
//main.js
const hxDriver = hx.create({
  baseURL: 'http://www.domain.org/api/v1/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foo'}
});

export default hxDriver
```

```js
//app.js
import hxDriver from 'main'

hxDriver.request(config)
	.then(function (resp) {
		// handle success
	})
	.catch(function (err) {			       
		// handle error
	})
```

## Request Config 请求配置

除了 `url` 以外的参数都是非必须的

```js
{

    // `url`
    // 请求地址（必须）：可为相对路径和绝对路径
    public url: string

    // `method`
    // 请求的方法
    public method: string	// default: 'get'

    // `baseURL`
    // 请求地址前缀，当 'url' 为相对路径时，则会加上baseURL组装成最终请求地址
    public baseURL: string // default: '/'

    // `headers`
    // 请求头
    public headers: object // default: {'Content-Type': 'application/json'}

    // `params`
    // 最终请求url中的参数，为对象形式
    // 将会把对应的key-value拼接到请求url的后面
    public params: object

    // `data`
    // 要作为请求正文发送的数据，只在 'post' 时生效
    public data: object

    // `timeout`
    // 请求的超时时间：单位毫秒，超时的请求将会被自动终止
    public timeout: number

    // `withCredentials`
    // 是否该使用类似cookies,authorization headers(头部授权)或者TLS客户端证书这一类资格证书来创建一个跨站点访问控制（cross-site Access-Control）请求
    public withCredentials: boolean

    // `responseType`
    // 返回响应数据的类型。它允许手动的设置返回数据的类型。如果将它设置为一个空字符串，它将使用默认的"text"类型。
    // 枚举类型有下列六种 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    public responseType: string // default: 'text'
 
    // `aborted`
    // 请求终止的标识符
    public aborted: boolean

    // `retryLimit`
    // 失败请求的重试次数
    public retryLimit: number

    // `retryBuffer`
    // 失败请求的重试间隔
    public retryBuffer: number

    // `mode`
    // hx中的请求模式，一共有两种：默认无
    // 'deboucne': 在一定时间（debounceTime）内，只发送出最后一次请求
    // 'trottle': 当一个请求发送后，必须间隔一定时间（throttleTime）才可以发送下一个请求
    public mode: string

    // `debounceTime`
    // 'debounce' 模式下的间隔时间
    public debounceTime: number // default: 300

    // `throttleTime`
    // 'throttle' 模式下的间隔时间
    public throttleTime: number // default: 3000
}
```

## Response Schema 响应模式

The response for a request contains the following information.

```js
{
    // `data`
    // 被转换后的请求响应数据
    public data: any

    // `status`
    // 响应的状态码
    public status: number

    // `statusText`
    // 是来自服务器的HTTP状态消息
    public statusText: string

    // `headers`
    // 服务端返回的响应头
    public headers: object

    // `config`
    // 请求中的配置信息

    // `request`
    // 生成这个响应的对应请求实例
    public request: HRequest
}
```

你可以在响应成功和错误捕获的回调函数里面访问到这些参数

```js
hx.get('/api')
  .then(function (resp) {
    console.log(resp.data);
    console.log(resp.status);
    console.log(resp.statusText);
    console.log(resp.headers);
    console.log(resp.config);
  })
  .catch(function (resp) {
    // 这里同样能访问到响应对象，后续可能会考虑用其他更恰当的形式来处理这种操作
    console.log(resp.data);
    console.log(resp.status);
    console.log(resp.statusText);
    console.log(resp.headers);
    console.log(resp.config);
  });
```

## 全局配置

你可以通过配置全局实例来对默认的参数进行配置，这些配置参数会混入到每个请求中

### 实例驱动配置

```js
hx.config.baseURL = '/api';
hx.config.headers['Auth'] = 'request-auth-token';

// 考虑加入对指定请求类型的header配置
```

### 创建驱动配置

```js
// Set config defaults when creating the instance
const instance = hx.create({
  hx.config.baseURL = '/api'
});

// 继续在实例上进行配置
instance.config.headers['Auth'] = 'request-auth-token';
```

### 配置的优先级
在请求上的特定配置将会覆盖全局配置

```js
const instance = hx.create();

// 配置所有请求的超时时间
instance.defaults.timeout = 2500;

// 这个请求的最终超时时间为5000毫秒，覆盖了通用配置
instance.get('/longRequest', {
  timeout: 5000
});
```

## 拦截器

请求发送前和请求结束后被用户处理前，可以对请求做一些特定处理

```js
// 请求拦截
hx.setRequestInterceptor((config) => {
  config.url = 'http://jsonplaceholder.typicode.com/users/1'
})

// 响应拦截
hx.setResponseInterceptor((resp) => {
  if (resp.status === 401) window.location = '/login'
})
```

## 请求取消

你可以通过 `hx` 中提供的 `abort` 方法对正在发送或者未发送的请求进行终止操作

```js
// 获取返回的请求实例
const r = hx.get('http://majax.test/index.php')
				.then(resp => {
					// success handler
				}).catch(resp => {
					// error handler
				})

// 终端请求
r.abort()
```

## Promise支持

`HAjax`  中的 `all` 方法和 `race` 使用到了Promise，如果你需要使用这两个方法，确保执行环境中存在Promise的支持：原生或者使用[polyfill](https://github.com/stefanpenner/es6-promise)

## 相关资源

* Changelog
* Upgrade Guide
* Ecosystem
* Contributing Guide
* Code of Conduct

## 核心思想

解决企业级多人协作下多组件多请求开发产生的一些问题，整合一些请求中的最佳实践方案

## 发展计划

第一版主要是解决基本的请求使用场景，能够快速引入项目实现请求的优化，后面将持续完善并加入更多功能

## License

MIT
