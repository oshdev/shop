import InMemoryCart, { Cart, CartItem } from './cart'
import items from '../items/items.json'
import { Item } from '../items/items-handler'

type CartAction = AddAction | EmptyAction
type AddAction = {
  type: 'add'
  itemName: Item['name']
  quantity: number
}
type EmptyAction = {
  type: 'empty'
}
type CartHandler = (action: CartAction) => CartItem[]
type CartHandlerFactory = (cart: Cart, items: Item[]) => CartHandler

export const cart = new InMemoryCart()

export const handlerFactory: CartHandlerFactory =
  (cart, items): CartHandler =>
  (action: CartAction) =>
    handler(cart, items, action)

const handler = (cart: Cart, items: Item[], action: CartAction): CartItem[] => {
  if (action.type === 'empty') {
    cart.empty()
    return []
  }

  const item = items.find((i) => i.name === action.itemName)
  if (!item) throw new Error('item not found')

  cart.add(item!, action.quantity)
  return cart.getItems()
}

const cartHandler: CartHandler = handlerFactory(cart, items)

export default cartHandler
