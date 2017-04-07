import test from 'ava'
import resettableReducer from '../lib/resettableReducer'

const TRIGGER_TYPE = 'fun'
const RESET_TYPE = 'RESET'
const MISS_ACTION = { type: 'miss' }
const HIT_ACTION = { type: TRIGGER_TYPE }
const RESET_ACTION = { type: RESET_TYPE }
const DEFAULT_STATE = 'hi'

const sampleReducer = (state = DEFAULT_STATE, action) => {
  return action.type === TRIGGER_TYPE ? 'yes' : state
}

test('validation', t => {
  t.throws(() => resettableReducer(null, sampleReducer))
  t.throws(() => resettableReducer('', sampleReducer))
  t.throws(() => resettableReducer(RESET_TYPE, null))
  t.is(typeof resettableReducer(RESET_TYPE, sampleReducer), 'function')
})

test('runs reducers as expected', t => {
  const reducer = resettableReducer(RESET_TYPE, sampleReducer)
  t.is(reducer(undefined, MISS_ACTION), DEFAULT_STATE)
  t.is(reducer('no', MISS_ACTION), 'no')
  t.is(reducer('no', HIT_ACTION), 'yes')
})

test('can be reset', t => {
  const resettable = resettableReducer(RESET_TYPE)
  const reducer = resettable(sampleReducer)
  t.is(reducer(undefined, RESET_ACTION), DEFAULT_STATE)
  t.is(reducer(DEFAULT_STATE, RESET_ACTION), DEFAULT_STATE)
  t.is(reducer('something', RESET_ACTION), DEFAULT_STATE)
})
