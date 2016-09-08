import test from 'ava'
import createActions from '../lib/createActions'

test('throws an error if passed crap', t => {
  t.throws(() => createActions(null))
  t.throws(() => createReducer())
  t.throws(() => createReducer({}))
})

test('has Creators and Types', t => {
  const { Creators, Types } = createActions({ one: null })
  t.truthy(Creators)
  t.truthy(Types)
})

test('types are snake case', t => {
  const { Types } = createActions ({ helloWorld: null })
  t.is(Types.HELLO_WORLD, 'HELLO_WORLD')
})

test('null produces a type-only action creator', t => {
  const { Creators } = createActions({ helloWorld: null })
  t.is(typeof Creators.helloWorld, 'function')
  t.deepEqual(Creators.helloWorld(), { type: 'HELLO_WORLD' })
})

test('[] produces a type-only action creator', t => {
  const { Creators } = createActions({ helloWorld: [] })
  t.is(typeof Creators.helloWorld, 'function')
  t.deepEqual(Creators.helloWorld(), { type: 'HELLO_WORLD' })
})

test('[\'steve\'] produces a valid action creator', t => {
  const { Creators } = createActions({ helloWorld: ['steve'] })
  t.is(typeof Creators.helloWorld, 'function')
  t.deepEqual(Creators.helloWorld('hi'), { type: 'HELLO_WORLD', steve: 'hi' })
})

test('custom action creators are supported', t => {
  const { Creators }  = createActions({ custom: () => 123 })
  t.is(Creators.custom(), 123)
})
