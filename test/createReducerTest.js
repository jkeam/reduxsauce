import test from 'ava'
import createReducer from '../lib/createReducer'
import * as Types from '../lib/Types'

test('throws an error when initial state is missing', (t) => {
  t.throws(() => createReducer(null))
  t.throws(() => createReducer())
})

test('throws an error when the handlers are not an object', (t) => {
  t.throws(() => createReducer(1, 0))
  t.throws(() => createReducer(1, null))
  t.throws(() => createReducer(1))
})

test('throws an error when the handlers have an undefined key', (t) => {
  const a = (state, action) => state
  t.throws(() => createReducer(1, { [undefined]: a }))
  t.throws(() => createReducer(1, { [void 0]: a }))
})

test('creates a reducer function', (t) => {
  t.truthy(createReducer(1, {}))
})

test('dodges the wrong actions', (t) => {
  const a = (state, action) => state + 1
  const r = createReducer(0, { 'hi': a })
  const v = r(5, {type: 'wrong'})
  t.is(v, 5)
})

test('dodges null actions', (t) => {
  const a = (state, action) => state + 1
  const r = createReducer(0, { 'hi': a })
  const v = r(5, null)
  t.is(v, 5)
})

test('dodges actions with no type', (t) => {
  const a = (state, action) => state + 1
  const r = createReducer(0, { 'hi': a })
  const v = r(5, { bad: 'type' })
  t.is(v, 5)
})

test('invokes the correct actions', (t) => {
  const i = 5
  const a = (state, action) => state + 1
  const r = createReducer(i, { 'hi': a })
  const v = r(i, {type: 'hi'})
  t.is(v, 6)
})

test('falls down to default handler', (t) => {
  const i = 5
  const a = (state, action) => state + 1
  const b = (state, action) => state + 2
  const r = createReducer(i, { 'hi': a, [Types.DEFAULT]: b })
  const v1 = r(i, {type: 'hi'})
  t.is(v1, 6)
  const v2 = r(i, {type: 'unknown action'})
  t.is(v2, 7)
})

test('invokes the correct action on an object', (t) => {
  const i = { i: 5 }
  const a = (state, action) => ({ i: state.i + 1 })
  const r = createReducer(i, { 'hi': a })
  const v = r(i, { type: 'hi' })
  t.deepEqual(v, { i: 6 })
})
