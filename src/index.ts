import mx from './core/Majax'

mx.setRequestInterceptor((req) => {
    console.log('req intercepter', req)
})

mx.setResponseInterceptor(resp => {
    console.log('response intercepter', resp)
})

mx.get('https//www.baidu.com').then(resp => {
    console.log('success baidu', resp)
}).catch(resp => {
    console.log('failed baidu', resp)
})


mx.get('https//www.hhh.com').then(resp => {
    console.log('success hhh', resp)
}).catch(resp => {
    console.log('failed hhh', resp)
})

console.log(mx, 'mx initial')