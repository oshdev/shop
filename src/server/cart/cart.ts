export interface Item {
  name: string
  price: number
}

export interface Cart {
  add(item: Item, quantity: number): void
  produceOutput(): CartOutput
}

export interface CartOptions {
  vat: number
  discounts: Discount[]
}

export interface CartOutput {
  items: ItemCollection
  discountsApplied: DiscountApplied[]
  vatApplied: VatApplied
  total: number
}

interface DiscountApplied {
  discount: Discount['name']
  amount: number
}

export interface Discount {
  name: string
  requiredItem: Item['name']
  requiredCount: number
  discountedItem: Item['name']
  priceModifier: number
}

export interface PriceBreakdown {
  item: Item['name']
  quantity: number
  price: number
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

  produceOutput(): CartOutput {
    const { discountsApplied, leftoverItems, processedItems } = this.applyDiscounts()
    const subtotal = this.tallyUp(leftoverItems) + this.tallyUp(processedItems)
    const vatApplied = this.applyVat(subtotal)

    return {
      items: this.items,
      discountsApplied,
      vatApplied,
      total: subtotal + vatApplied.amount,
    }
  }

  private applyDiscounts(): {
    discountsApplied: DiscountApplied[]
    processedItems: ItemCollection
    leftoverItems: ItemCollection
  } {
    const processedItems: ItemCollection = {}
    const leftoverItems: ItemCollection = JSON.parse(JSON.stringify(this.items))
    const discountsApplied: DiscountApplied[] = []

    for (const discount of this.options.discounts) {
      const isSelfDiscount = discount.requiredItem === discount.discountedItem
      const hasItem = (collection: ItemCollection, item: Item['name'], quantity: number) =>
        item in collection && collection[item].quantity >= quantity

      const canApplyDiscount = () =>
        isSelfDiscount
          ? hasItem(leftoverItems, discount.requiredItem, discount.requiredCount)
          : hasItem(leftoverItems, discount.requiredItem, discount.requiredCount) &&
          hasItem(leftoverItems, discount.discountedItem, 1)

      let amount = 0
      const newPrice = leftoverItems[discount.discountedItem].price * discount.priceModifier

      while (canApplyDiscount()) {
        leftoverItems[discount.requiredItem].quantity -= discount.requiredCount
        processedItems[discount.requiredItem] = {
          price: isSelfDiscount ? newPrice : leftoverItems[discount.requiredItem].price,
          quantity: (processedItems[discount.requiredItem]?.quantity ?? 0) + discount.requiredCount,
        }
        if (!isSelfDiscount) {
          leftoverItems[discount.discountedItem].quantity -= 1
          processedItems[discount.discountedItem] = {
            price: newPrice,
            quantity: (processedItems[discount.discountedItem]?.quantity ?? 0) + 1,
          }
        }
        amount += leftoverItems[discount.discountedItem].price - newPrice
      }

      discountsApplied.push({
        amount,
        discount: discount.name,
      })
    }

    return {
      discountsApplied,
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
