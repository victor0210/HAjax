import mx from './core/Majax'

mx.setRequestInterceptor((req) => {
    // console.log('req intercepter', req)
})

mx.setResponseInterceptor(resp => {
    // console.log('response intercepter', resp)
})

mx.get('http://majax.test/').then(resp => {
    console.log('success baidu', resp)
}).catch(resp => {
    console.log('failed baidu', resp)
})


mx.get('http://majax.test/').then(resp => {
    console.log('success baidu', resp)
}).catch(resp => {
    console.log('failed baidu', resp)
})


mx.get('http://majax.test/').then(resp => {
    console.log('success baidu', resp)
}).catch(resp => {
    console.log('failed baidu', resp)
})

console.log(mx, 'mx initial')