import InMemoryCart, { Cart, Item } from '../cart/cart'
import items from '../items/items.json'

type CartHandler = (itemName: Item['name'], quantity: number) => void
type CartHandlerFactory = (cart: Cart, items: Item[]) => CartHandler

const cart = new InMemoryCart()

export const handlerFactory: CartHandlerFactory =
  (cart, items): CartHandler => (itemName, quantity) => handler(cart, items, itemName, quantity)

const handler = (cart: Cart, items: Item[], itemName: Item['name'], quantity: number) => {
  const item = items.find(i => i.name === itemName)

  cart.add(item!, quantity)
}

const cartHandler: CartHandler = handlerFactory(cart, items)

export default cartHandler
