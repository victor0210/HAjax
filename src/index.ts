import mx from './core/mx'

const majax = new mx()

console.log(majax)
majax.get('http://baike.baidu.com/api/openapi/BaikeLemmaCardApi', {
    params: {
        scope: 103,
        format: 'json',
        appid: 379020,
        bk_key: '关键字',
        bk_length: 600
    }
})

majax.post('http://baike.baidu.com/api/openapi/BaikeLemmaCardApi', {
    data: {
        scope: 103,
        format: 'json',
        appid: 379020,
        bk_key: '关键字',
        bk_length: 600
    }
})