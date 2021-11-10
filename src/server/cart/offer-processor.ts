import { Item, ItemCollection } from './cart'

export interface OfferApplied {
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

export interface OffersProcessor {
  /**
   * Applies offers to the provided cart; returns:
   * offersApplied - a list of offers with the amount deducted
   * processedItems - cart after relevant offer were applied
   * leftoverItems - cart after relevant offer were applied
   */
  applyOffers(cart: ItemCollection): {
    offersApplied: OfferApplied[]
    processedItems: ItemCollection
    leftoverItems: ItemCollection
  }
}

export class SimpleOfferProcessor implements OffersProcessor {
  constructor(private offers: Offer[]) {}

  applyOffers(cart: ItemCollection): {
    offersApplied: OfferApplied[]
    processedItems: ItemCollection
    leftoverItems: ItemCollection
  } {
    const processedItems: ItemCollection = {}
    const leftoverItems: ItemCollection = JSON.parse(JSON.stringify(cart))
    const offersApplied: OfferApplied[] = []

    for (const offer of this.offers) {
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
}
