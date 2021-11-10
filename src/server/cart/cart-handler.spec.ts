import { handlerFactory } from './cart-handler'
import { Cart } from './cart'

describe('cart handler', () => {
  it('allows to add an item to the cart', () => {
    const addSpy = jest.fn()
    const cart: Cart = { add: addSpy, getCollection: jest.fn(), getItems: jest.fn(), empty: jest.fn() }
    const item = { name: 'foo', price: 1 }
    const handler = handlerFactory(cart, [item])

    handler({ type: 'add', itemName: 'foo', quantity: 1 })

    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenCalledWith(item, 1)
  })

  it('allows to add multiple items to the cart', () => {
    const addSpy = jest.fn()
    const cart: Cart = { add: addSpy, getCollection: jest.fn(), getItems: jest.fn(), empty: jest.fn() }
    const item = { name: 'foo', price: 1 }
    const handler = handlerFactory(cart, [item])

    handler({ type: 'add', itemName: 'foo', quantity: 3 })

    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenCalledWith(item, 3)
  })

  it('throws error when item was not found', () => {
    const addSpy = jest.fn()
    const cart: Cart = { add: addSpy, getCollection: jest.fn(), getItems: jest.fn(), empty: jest.fn() }
    const item = { name: 'foo', price: 1 }
    const handler = handlerFactory(cart, [item])

    expect(() => handler({ type: 'add', itemName: 'bar', quantity: 1 })).toThrow()
    expect(addSpy).not.toHaveBeenCalled()
  })
})
