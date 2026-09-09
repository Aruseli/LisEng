import { describe, expect, it } from 'vitest'
import { answersMatch } from './verb-answer'

describe('answersMatch', () => {
  it('accepts exact forms', () => {
    expect(answersMatch('went gone', ['went', 'gone'])).toBe(true)
  })

  it('does not accept substring of another form', () => {
    expect(answersMatch('go', ['gone'])).toBe(false)
    expect(answersMatch('gone', ['go'])).toBe(false)
  })

  it('accepts was or were', () => {
    expect(answersMatch('was been', ['was/were', 'been'])).toBe(true)
    expect(answersMatch('were been', ['was/were', 'been'])).toBe(true)
    expect(answersMatch('was/were been', ['was/were', 'been'])).toBe(true)
  })
})
