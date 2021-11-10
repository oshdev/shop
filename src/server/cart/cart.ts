import { OfferApplied, OffersProcessor } from './offer-processor'

export interface Item {
  name: string
  price: number
}

export interface Cart {
  add(item: Item, quantity: number): void
  getItems(): ItemCollection
}

export interface CartOptions {
  vat: number
}

export interface CartProcessingOutput {
  items: ItemCollection
  offersApplied: OfferApplied[]
  vatApplied: VatApplied
  total: number
}

interface VatApplied {
  percent: number
  amount: number
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

  getItems(): ItemCollection {
    return this.items
  }
}

export interface CartProcessor {
  process(cart: Cart): CartProcessingOutput
}

export class SimpleCartProcessor implements CartProcessor {
  constructor(private offersProcessor: OffersProcessor, private options: CartOptions) {}

  process(cart: Cart): CartProcessingOutput {
    const { offersApplied, leftoverItems, processedItems } = this.offersProcessor.applyOffers(cart.getItems())
    const subtotal = this.tallyUp(leftoverItems) + this.tallyUp(processedItems)
    const vatApplied = this.applyVat(subtotal)

    return {
      items: cart.getItems(),
      offersApplied,
      vatApplied,
      total: subtotal + vatApplied.amount,
    }
  }

  private tallyUp(items: ItemCollection): number {
    return Object.values(items).reduce<number>((tally, { quantity, price }) => tally + quantity * price, 0)
  }

  private applyVat(subtotal: number): VatApplied {
    return { percent: this.options.vat, amount: subtotal * this.options.vat }
  }
}
