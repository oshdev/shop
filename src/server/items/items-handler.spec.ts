import { handlerFactory, Item } from './items-handler'

describe('items handler', () => {
  it('returns list of items', () => {
    const items: Item[] = []
    const handler = handlerFactory(items)

    expect(handler()).toEqual(items)
  })
})
