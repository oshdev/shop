import { Cart } from './cart'
import offers from './offers.json'
import { CartProcessingOutput, CartProcessor, SimpleCartProcessor } from './cart-processor'
import { SimpleOfferProcessor } from './offer-processor'
import { cart } from './cart-handler'

type CheckoutHandler = () => CartProcessingOutput
type CheckoutHandlerFactory = (cart: Cart, cartProcessor: CartProcessor) => CheckoutHandler

const cartProcessor = new SimpleCartProcessor(new SimpleOfferProcessor(offers), { vat: 0.14 })

export const handlerFactory: CheckoutHandlerFactory =
  (cart, cartProcessor): CheckoutHandler =>
  () =>
    handler(cart, cartProcessor)

const handler = (cart: Cart, cartProcessor: CartProcessor): CartProcessingOutput => cartProcessor.process(cart)

const checkoutHandler: CheckoutHandler = handlerFactory(cart, cartProcessor)

export default checkoutHandler
