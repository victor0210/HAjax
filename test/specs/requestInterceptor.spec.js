/* eslint-disable no-undef,no-tabs,no-mixed-spaces-and-tabs */
import hx from '../../release/dist/hx.es'

describe('specs::get', () => {
  it('do some config fix with request interceptor', done => {
    hx.setRequestInterceptor((config) => {
      config.url = 'http://jsonplaceholder.typicode.com/users/1'
    })

    const callback = (data) => {
      expect(data.data.id).toEqual(1)
      done()
    }

    // test url
    hx.get('/erroruri')
      .then(resp => {
        callback(resp)
      })
      .catch(() => done())
  })
})
