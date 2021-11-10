import { handlerFactory } from './cart-handler'
import { Cart } from './cart'

describe('cart handler', () => {
  it('allows to add items to the cart', () => {
    const addSpy = jest.fn()
    const cart: Cart = { add: addSpy, getItems: jest.fn() }
    const item = { name: 'foo', price: 1 }
    const handler = handlerFactory(cart, [item])

    handler('foo', 1)

    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenCalledWith(item, 1)
  })

  it('allows to add multiple items to the cart', () => {
    const addSpy = jest.fn()
    const cart: Cart = { add: addSpy, getItems: jest.fn() }
    const item = { name: 'foo', price: 1 }
    const handler = handlerFactory(cart, [item])

    handler('foo', 3)

    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenCalledWith(item, 3)
  })
})
