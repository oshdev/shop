import items from './items.json'

export interface Item {
  name: string
  price: number
}

type ItemsHandler = () => Item[]
type ItemsHandlerFactory = (items: Item[]) => ItemsHandler

export const handlerFactory: ItemsHandlerFactory =
  (items: Item[]): ItemsHandler =>
  () =>
    items

const itemsHandler: ItemsHandler = handlerFactory(items)

export default itemsHandler
