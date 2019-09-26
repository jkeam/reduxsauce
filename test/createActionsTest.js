import test from 'ava'
import createActions from '../lib/createActions'

test('throws an error if passed crap', t => {
  t.throws(() => createActions(null))
  t.throws(() => createActions())
  t.throws(() => createActions({}))
})

test('has Creators and Types', t => {
  const { Creators, Types } = createActions({ one: null })
  t.truthy(Creators)
  t.truthy(Types)
})

test('types are snake case', t => {
  const { Types } = createActions({ helloWorld: null })
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

test('{} produces a type-only action creator', t => {
  const { Creators } = createActions({ helloWorld: {} })
  t.is(typeof Creators.helloWorld, 'function')
  t.deepEqual(Creators.helloWorld(), { type: 'HELLO_WORLD' })
})

test('{"foo": 1, "bar": 2} produces a valid action creator', t => {
  const { Creators } = createActions({ helloWorld: {foo: 1, bar: 2} })
  t.is(typeof Creators.helloWorld, 'function')
  t.deepEqual(Creators.helloWorld({foo: 10, 'foobar': 3}), { type: 'HELLO_WORLD', foo: 10, bar: 2 })
})

test('custom action creators are supported', t => {
  const { Creators } = createActions({ custom: () => 123 })
  t.is(Creators.custom(), 123)
})

test('action types prefix is supported', t => {
  const { Types, Creators } = createActions({ helloWorld: null }, { prefix: 'SUPER_' })
  t.is(Types.HELLO_WORLD, 'SUPER_HELLO_WORLD')
  t.is('SUPER_HELLO_WORLD', Creators.helloWorld().type)
})

test('throws an error if custom action creator is junk', t => {
  t.throws(() => createActions({ custom: 'notSupportedType' }))
})
