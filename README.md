# HAjax

[![npm version](https://img.shields.io/npm/v/hajax.svg)](https://www.npmjs.org/package/hajax)
[![Github file size](https://img.shields.io/github/size/Bennnis/HAjax/release/dist/hx.min.js.svg)](https://github.com/Bennnis/HAjax/blob/master/release/dist/hx.min.js)
[![install size](https://packagephobia.now.sh/badge?p=hajax)](https://packagephobia.now.sh/result?p=hajax)
[![build status](https://travis-ci.org/Bennnis/HAjax.svg?branch=master)](https://travis-ci.org/bennnis/hajax)
[![Open Source Helpers](https://www.codetriage.com/bennnis/hajax/badges/users.svg)](https://www.codetriage.com/bennnis/hajax)
[![Join the chat at https://gitter.im/bennnis/Lobby](https://badges.gitter.im/bennnis/Lobby.svg)](https://gitter.im/bennnis/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Browser-side high availability front-end request solution

## Feature

- Easily handle Ajax cached data, front-end request concurrency
- Easy "debounce" and "throttle" operation
- Interceptor of request and response
- Request cancellation
- Failure retry
- Chained call of class Promise
- Automatically convert JSON type response data

## Documents

[Chinese](./CHINESE.md)

## Install

use npm:

```bash
$ npm install hajax
```

use script:

```html
<script src="hx.min.js"></script>
```

## Basic

Execute `GET` request

```js
import hx from 'hajax'

// Request a restful api for testing
hx.get('http://jsonplaceholder.typicode.com/users/1')
  .then(function (response) {
    // success handler
    console.log(response);
  })
  .catch(function (error) {
    // error handler
    console.log(error);
  })
```

Execute `POST` request

```js
// Request a restful api for testing
hx.post('/posturl')
  .then(function (response) {
    // success handler
    console.log(response);
  })
  .catch(function (error) {
    // error handler
    console.log(error);
  })
```

Execute concurrent requests: `all` (blocking)

```js
function getOne() {
  return hx.get('/geturl1');
}

function getTwo() {
  return hx.get('/geturl2');
}

hx.all([getOne(), getTwo()])
  .then((function (responses) {
    // The method here will be executed when all the requests in the all method are executed successfully.
    // "responses" is an ordered array containing the data returned by the above two requests, arranged in the order of the parameters
  }));
```

If you want to use this API and don't want to be blocked by a failed request, you can try the following
Execute concurrent requests: `all` (non-blocking)

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
    // Here, traversing the response parameters to determine whether the response is undefined, it means the request failed.
  }));
```

## Cache Config

Handle requests and data caching more easily with `hajax`

### Compare common caching strategies with hajax caching strategies

Normal

working process:

1. Determine if there is cached data
2. Send a request if it does not exist, and get the response data and put it in the cache
3. Subsequent requests to read cached data

Cache strategy:

After the first request is successful, subsequent requests will use the cache. In the same request concurrent scenario (generally caused by poor code writing), multiple identical requests will be sent at the same time; the expiration time is generally from Save data and start calculating

Disadvantage:

Inconvenient to use, the method needs to be encapsulated by itself, and the concurrent request is cache invalidation, which increases maintenance costs.

---

hajax:

working process:

1. Determine if there is cached data
2. Determine if the cache policy is met
3. Send a request, if the cache policy is satisfied, put the obtained response data into the cache
4. The next request that satisfies the cache policy determines whether the cache expires
5. Read the cache directly if it has not expired, and regain the data refresh cache when it expires

Cache strategy:

After the first request is sent, the cache buffer is opened and the cache expiration time is calculated. All requests before the expiration time will be placed in the callback trigger of the request buffer, after the first request is completed. Time to distribute data to the callback buffer waiting for requests to be processed

Disadvantage:

By default, when the first request fails, all subsequent requests will fail. The solution here may be for discussion. You can add the retry retry mechanism by adding `retryLimit` to the first request (my idea) Is to prepare an automatic retry switch, the number of retries is the current number of the same request)

### How To Use

Three configuration schemes for caching strategies

1. Determined url: In string matching mode, http://www.api.com is not equivalent to www.api.com, there are many improvements to this cache matching strategy, if you have any idea, feel free to Please let me know
2. Regular expression
3. '*'

```js
//Configuring the cache with "setStrategy"
//Generate a cache policy with "createStrategy"

hx.setStrategy(
	hx.createStrategy('http://majax.test/index.php', 4000)
)

//Send requests directly and cache data
hx.get('http://majax.test/index.php').then(resp => {
	console.log('success', resp)
}).catch(resp => {
	console.log('failed', resp)
})

setTimeout(() => {
	//Get cached data directly
	hx.get('http://majax.test/index.php').then(resp => {
		console.log('success', resp)
	}).catch(resp => {
		console.log('failed', resp)
	})

	setTimeout(() => {
		//Cache expired, re-requesting to get data
		hx.get('http://majax.test/index.php').then(resp => {
			console.log('success', resp)
		}).catch(resp => {
			console.log('failed', resp)
		})
	}, 3000)
}, 3000)
```

## HAjax API

Custom requests can be made by passing the relevant configuration to a specific request

##### hx.request(config)

```js
// Send a POST request using the "request" method
hx.request({
  method: 'post',
  url: '/url',
  data: {
    name: 'bennnis'
  }
});

// Use the post method directly
hx.post('/url', {
  data: {
    name: 'bennnis'
  }
});
```

### Request method alias

In order to more conveniently call the corresponding request method, I provide the corresponding alias for all the request methods. Currently, only `GET` and `POST` are supported. Other methods will be added later

##### hx.request(config)
##### hx.get(url[, config])
##### hx.post(url[, config])

### Concurrent request method

Use a function to handle concurrent requests better

##### hx.all(requests: Array\<Promise>)
##### hx.race(requests: Array\<Promise>)

### Create instance

You can create a new instance with a specific attribute to fit an unconventional situation that might appear in the system.
The new instance is identical to the default `hx` instance.

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

## Request Config

Parameters other than `url` are optional.

```js
{

    // `url`
    // Request address (required): can be relative and absolute
    public url: string

    // `method`
    // Request method
    public method: string	// default: 'get'

    // `baseURL`
    // Request address prefix. When 'url' is a relative path, baseURL is added to the final request address.
    public baseURL: string // default: '/'

    // `headers`
    // Request headers
    public headers: object // default: {'Content-Type': 'application/json'}

    // `params`
    // The final request to the parameters in the url, as an object type
    // Will stitch the corresponding key-value to the back of the request url
    public params: object

    // `data`
    // The data to be sent as the request body is only valid at "post"
    public data: object

    // `timeout`
    // Timeout of request: in milliseconds, the request for timeout will be automatically terminated
    public timeout: number

    // `withCredentials`
    // Whether to use a certificate similar to cookies, authorization headers or TLS client certificates to create a cross-site access-control request
    public withCredentials: boolean

    // `responseType`
    // Returns the type of response data. It allows manual settings to return the type of data. If it is set to an empty string, it will use the default "text" type.
    // The enumeration types have the following six types 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    public responseType: string // default: 'text'
 
    // `aborted`
    // Identifier requesting termination
    public aborted: boolean

    // `retryLimit`
    // Number of retries for failed requests
    public retryLimit: number

    // `retryBuffer`
    // Retry interval for failed requests
    public retryBuffer: number

    // `mode`
    // There are two request modes in hx: no default
    // 'deboucne': Only send the last request within a certain time (debounceTime)
    // 'trottle': When a request is sent, it must be separated by a certain time (throttleTime) before the next request can be sent.

    public mode: string

    // `debounceTime`
		// Interval in 'debounce' mode

    public debounceTime: number // default: 300

    // `throttleTime`
    // Interval in 'throttle' mode

    public throttleTime: number // default: 3000
}
```

## Response Schema

The response for a request contains the following information.

```js
{
    // `data`
    // is an object transformed by response schema data
    public data: any

    // `status`
    // is response status code
    public status: number

    // `statusText`
    // is the HTTP status message from the server response `statusText` is the HTTP status message from the server respo
    public statusText: string

    // `headers`
    // the headers that the server responded with
    // All header names are lower cased
    public headers: object

    // `config`
    // is the config that was provided to `hajax` for the request
    public config: object

    // `request`
    // HRequest instance which produce this response
    public request: HRequest
}
```

You can access these parameters in the callback function that responds to success and error catching.

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
    // The same response object can be accessed here, and subsequent operations may be considered in other more appropriate forms.
    console.log(resp.data);
    console.log(resp.status);
    console.log(resp.statusText);
    console.log(resp.headers);
    console.log(resp.config);
  });
```

## Global Config

You can configure the default parameters by configuring global instances, which are mixed into each request.

### Config With Instance

```js
hx.config.baseURL = '/api';
hx.config.headers['Auth'] = 'request-auth-token';

// Consider adding a header configuration for the specified request type:
// hx.config.headers.post['Auth'] = 'xxx';
```

### Config With Create

```js
// Configuration settings default settings at creation time
const instance = hx.create({
  baseURL: '/api'
});

// Continue to configure on the instance
instance.config.headers['Auth'] = 'request-auth-token';
```

### Configured Priority

The specific configuration on the request will override the global configuration

```js
const instance = hx.create();

// Configure timeouts for all requests
instance.defaults.timeout = 2500;

// The final timeout for this request is 5000 milliseconds, covering the common configuration
instance.get('/longRequest', {
  timeout: 5000
});
```

## Interceptor

Before the request is sent and after the request is processed by the user, some specific processing can be done on the request.

```js
// Request interceptor
hx.setRequestInterceptor((config) => {
  config.url = 'http://jsonplaceholder.typicode.com/users/1'
})

// Response interception
hx.setResponseInterceptor((resp) => {
  if (resp.status === 401) window.location = '/login'
})
```

## Request Cancellation

You can terminate a request that is being sent or not sent by the `abort` method provided in `hx`

```js
// Get the returned request instance
const r = hx.get('http://majax.test/index.php')
				.then(resp => {
					// success handler
				}).catch(resp => {
					// error handler
				})

// abort request
r.abort()
```

## Promise Support

The `all` method and `race` in `HAjax` use Promise. If you need to use these two methods, make sure that Promise support exists in the execution environment: native or use [polyfill] (https://github.com/ Stefanpenner/es6-promise)

## Related Resources

* Changelog
* Upgrade Guide
* Ecosystem
* Contributing Guide
* Code of Conduct

## Main Idea

Solve some problems caused by multi-component and multi-request development under enterprise-level multi-person collaboration, and integrate some best practices in requests

## Development Plan

The first edition is mainly to solve the basic request usage scenarios, and can quickly introduce optimization of project implementation requests, which will continue to improve and add more functions

## License

MIT
