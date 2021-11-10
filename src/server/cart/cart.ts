import { Item } from '../items/items-handler'

export interface CartItem {
  itemName: string
  quantity: number
}

export interface Cart {
  add(item: Item, quantity: number): void
  getCollection(): ItemCollection
  getItems(): CartItem[]
  empty(): void
}

export type ItemCollection = Record<Item['name'], { price: number; quantity: number }>

export default class InMemoryCart implements Cart {
  private items: ItemCollection = {}

  add(item: Item, quantity: number): void {
    this.items[item.name] = {
      price: item.price,
      quantity: (this.items[item.name]?.quantity ?? 0) + quantity,
    }
  }

  getCollection(): ItemCollection {
    return this.items
  }

  getItems(): CartItem[] {
    return Object.entries(this.items).reduce<CartItem[]>(
      (acc, [name, { quantity }]) => [...acc, { itemName: name, quantity }],
      [],
    )
  }

  empty(): void {
    this.items = {}
  }
}
