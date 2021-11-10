export interface Item {
  name: string
  price: number
}

export interface Cart {
  add(item: Item, quantity: number): void
  getItems(): ItemCollection
  produceOutput(): CartOutput
}

export interface CartOptions {
  vat: number
  offers: Offer[]
}

export interface CartOutput {
  items: ItemCollection
  offersApplied: OfferApplied[]
  vatApplied: VatApplied
  total: number
}

interface OfferApplied {
  offer: Offer['name']
  amount: number
}

export interface Offer {
  name: string
  requiredItem: Item['name']
  requiredCount: number
  itemOnOffer: Item['name']
  priceModifier: number
}

interface VatApplied {
  percent: number
  amount: number
}

export type ItemCollection = Record<Item['name'], { price: number; quantity: number }>

export default class InMemoryCart implements Cart {
  private items: ItemCollection = {}

  constructor(private options: CartOptions) {}

  add(item: Item, quantity: number): void {
    this.items[item.name] = {
      price: item.price,
      quantity: (this.items[item.name]?.quantity ?? 0) + quantity,
    }
  }

  getItems(): ItemCollection {
    return this.items
  }

  produceOutput(): CartOutput {
    const { offersApplied, leftoverItems, processedItems } = this.applyOffers()
    const subtotal = this.tallyUp(leftoverItems) + this.tallyUp(processedItems)
    const vatApplied = this.applyVat(subtotal)

    return {
      items: this.items,
      offersApplied,
      vatApplied,
      total: subtotal + vatApplied.amount,
    }
  }

  private applyOffers(): {
    offersApplied: OfferApplied[]
    processedItems: ItemCollection
    leftoverItems: ItemCollection
  } {
    const processedItems: ItemCollection = {}
    const leftoverItems: ItemCollection = JSON.parse(JSON.stringify(this.items))
    const offersApplied: OfferApplied[] = []

    for (const offer of this.options.offers) {
      const isSelfOffer = offer.requiredItem === offer.itemOnOffer
      const hasItem = (collection: ItemCollection, item: Item['name'], quantity: number) =>
        item in collection && collection[item].quantity >= quantity

      const canApplyOffer = () =>
        isSelfOffer
          ? hasItem(leftoverItems, offer.requiredItem, offer.requiredCount)
          : hasItem(leftoverItems, offer.requiredItem, offer.requiredCount) &&
            hasItem(leftoverItems, offer.itemOnOffer, 1)

      let amount = 0
      const newPrice = leftoverItems[offer.itemOnOffer].price * offer.priceModifier

      while (canApplyOffer()) {
        leftoverItems[offer.requiredItem].quantity -= offer.requiredCount
        processedItems[offer.requiredItem] = {
          price: isSelfOffer ? newPrice : leftoverItems[offer.requiredItem].price,
          quantity: (processedItems[offer.requiredItem]?.quantity ?? 0) + offer.requiredCount,
        }
        if (!isSelfOffer) {
          leftoverItems[offer.itemOnOffer].quantity -= 1
          processedItems[offer.itemOnOffer] = {
            price: newPrice,
            quantity: (processedItems[offer.itemOnOffer]?.quantity ?? 0) + 1,
          }
        }
        amount += leftoverItems[offer.itemOnOffer].price - newPrice
      }

      offersApplied.push({
        amount,
        offer: offer.name,
      })
    }

    return {
      offersApplied,
      processedItems,
      leftoverItems,
    }
  }

  private tallyUp(items: ItemCollection): number {
    return Object.values(items).reduce<number>((tally, { quantity, price }) => tally + quantity * price, 0)
  }

  private applyVat(subtotal: number): VatApplied {
    return { percent: this.options.vat, amount: subtotal * this.options.vat }
  }
}
