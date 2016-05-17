import test from 'ava'
import createTypes from '../lib/createTypes'
import R from 'ramda'

test('responds with violence if not passed a string', (t) => {
  t.throws(() => createTypes())
})

test('creates an object when passed a string', (t) => {
  const types = createTypes('one')
  t.truthy(types)
  t.true(R.is(Object, types))
})

test('creates an object with the right keys and values', (t) => {
  const types = createTypes('one')
  const keys = R.keys(types)
  const values = R.values(types)
  t.is(keys[0], 'one')
  t.is(values[0], 'one')
})

test('handles space delimited', (t) => {
  const types = createTypes('one two three')
  const keys = R.keys(types)
  const values = R.values(types)
  t.is(keys.length, 3)
  t.is(keys[2], 'three')
  t.is(values[2], 'three')
})

test('handles multiple space delimiters', (t) => {
  const types = createTypes('one two     three')
  const keys = R.keys(types)
  const values = R.values(types)
  t.is(keys.length, 3)
  t.is(keys[2], 'three')
  t.is(values[2], 'three')
})

test('handles multiple tab delimiters', (t) => {
  const types = createTypes('one two\t\t\t\tthree')
  const keys = R.keys(types)
  const values = R.values(types)
  t.is(keys.length, 3)
  t.is(keys[2], 'three')
  t.is(values[2], 'three')
})

test('handles multiple <CR> delimiters', (t) => {
  const types = createTypes(`
    ONE
    2
    THREE
  `)
  const keys = R.keys(types)
  const values = R.values(types)
  t.is(keys.length, 3)
  t.is(keys[2], 'THREE')
  t.is(values[2], 'THREE')
})

