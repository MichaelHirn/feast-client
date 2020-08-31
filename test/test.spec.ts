import { Test } from '../src'

test('hello with correct name', () => {
  const test = new Test('Jon')
  expect(test.hello()).toBe('Hello Jon')
})
