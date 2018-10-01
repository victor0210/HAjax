/* eslint-disable no-undef,no-tabs,no-mixed-spaces-and-tabs */
import hx from '../../dist/modules/hx.es'

describe('specs::get', () => {
  it('do some config fix with resposne interceptor', done => {
    let success = false
    hx.setResponseInterceptor((resp) => {
      if (resp.status === 200) success = true
    })

    const callback = (data) => {
      expect(data.data.id).toEqual(1)
      expect(success).toBe(true)
      done()
    }

    // test url
    hx.get('http://jsonplaceholder.typicode.com/users/1')
      .then(resp => {
        callback(resp)
      })
      .catch(() => done())
  })
})
