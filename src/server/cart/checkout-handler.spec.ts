import { Cart } from './cart'
import { CartProcessor } from './cart-processor'
import { handlerFactory } from './checkout-handler'

describe('cart handler', () => {
  it('processes cart', () => {
    const cart = {} as Cart
    const cartProcessor: CartProcessor = { process: jest.fn() }
    const handler = handlerFactory(cart, cartProcessor)

    handler()

    expect(cartProcessor.process).toHaveBeenCalledTimes(1)
    expect(cartProcessor.process).toHaveBeenCalledWith(cart)
  })
})
