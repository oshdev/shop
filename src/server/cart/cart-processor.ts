import { OfferApplied, OffersProcessor } from './offer-processor'
import { Cart, ItemCollection } from './cart'

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

export interface CartProcessor {
  process(cart: Cart): CartProcessingOutput
}

export interface CartOptions {
  vat: number
}

export class SimpleCartProcessor implements CartProcessor {
  constructor(private offersProcessor: OffersProcessor, private options: CartOptions) {}

  process(cart: Cart): CartProcessingOutput {
    const { offersApplied, leftoverItems, processedItems } = this.offersProcessor.applyOffers(cart.getCollection())
    const subtotal = this.tallyUp(leftoverItems) + this.tallyUp(processedItems)
    const vatApplied = this.applyVat(subtotal)

    return {
      items: cart.getCollection(),
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
