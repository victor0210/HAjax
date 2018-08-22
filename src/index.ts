import MAJAX from './core/majax'

const majax = new MAJAX().create()

console.log(majax)
majax.get('https://www.baidu.com')

