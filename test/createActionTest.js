import test from 'ava'
import createAction from '../lib/createAction'

test('fails when not passing a type', (t) => {
  t.throws(createAction)
})

test('fails when passing params that isn\'t an object', (t) => {
  const go = () => createAction('hi', 'foo')
  t.throws(go)
})

test('params cannot contain a type key', (t) => {
  const go = () => createAction('hi', { type: 'bye' })
  t.throws(go)
})

test('makes actions without params', (t) => {
  t.deepEqual(createAction('hi'), {type: 'hi'})
})

test('makes actions with params', (t) => {
  t.deepEqual(createAction('hi', { hello: 'there' }), {type: 'hi', hello: 'there'})
})

