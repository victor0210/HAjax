/* eslint-disable no-undef,no-tabs,no-mixed-spaces-and-tabs */
import hx from '../../dist/modules/hx.es'

describe('specs::get', () => {
  it('single request with get', done => {
    const callback = (data) => {
      expect(data.data.id).toEqual(1)
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
