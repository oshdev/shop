import InMemoryCart, { Cart, ItemCollection } from './cart'
import { OffersProcessor } from './offer-processor'
import { Item } from '../items/items-handler'
import { CartOptions } from './cart-processor'

describe('In Memory Cart', () => {
  it('allows to add a single item', () => {
    const item: Item = {
      name: 'Apple',
      price: 123,
    }
    const sut = new InMemoryCart()

    sut.add(item, 1)
  })

  it('allows to add multiple items', () => {
    const item: Item = {
      name: 'Apple',
      price: 123,
    }
    const sut = new InMemoryCart()

    sut.add(item, 2)
  })

  it('returns item collection', () => {
    const price = 123
    const name = 'Apple'
    const quantity = 2

    const item: Item = {
      name: name,
      price,
    }

    const sut = new InMemoryCart()
    sut.add(item, quantity)

    expect(sut.getCollection()).toEqual({ [name]: { price, quantity } })
  })

  it('returns cart items', () => {
    const price = 123
    const name = 'Apple'
    const quantity = 2

    const item: Item = {
      name,
      price,
    }

    const sut = new InMemoryCart()
    sut.add(item, quantity)

    expect(sut.getItems()).toEqual([{ itemName: name, quantity }])
  })
})
