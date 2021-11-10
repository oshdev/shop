import InMemoryCart, { Cart, CartOptions, Item, ItemCollection, SimpleCartProcessor } from './cart'
import { Offer, OffersProcessor, SimpleOfferProcessor } from './offer-processor'

describe('In Memory Cart', () => {
  const opt: CartOptions = { vat: 0 }
  const dummyOffersProcessor: () => OffersProcessor = () => ({
    applyOffers: jest.fn((items) => ({ offersApplied: [], leftoverItems: items, processedItems: {} })),
  })
  const dummyCart: (items?: ItemCollection) => Cart = (items: ItemCollection = {}) => ({
    add: jest.fn(),
    getCollection: jest.fn(() => items),
    getItems: jest.fn(),
    empty: jest.fn(),
  })

  it('allows to add a single item', () => {
    const item: Item = {
      name: 'Apple',
      price: 123,
    }
    const sut = new InMemoryCart()

    sut.add(item, 1)
  })

  it('allows to add multiple items', () => {
    const item: Item = {
      name: 'Apple',
      price: 123,
    }
    const sut = new InMemoryCart()

    sut.add(item, 2)
  })

  it('returns item collection', () => {
    const price = 123
    const name = 'Apple'
    const quantity = 2

    const item: Item = {
      name: name,
      price,
    }

    const sut = new InMemoryCart()
    sut.add(item, quantity)

    expect(sut.getCollection()).toEqual({ [name]: { price, quantity } })
  })

  it('returns cart items', () => {
    const price = 123
    const name = 'Apple'
    const quantity = 2

    const item: Item = {
      name,
      price,
    }

    const sut = new InMemoryCart()
    sut.add(item, quantity)

    expect(sut.getItems()).toEqual([{ itemName: name, quantity }])
  })

  describe('output', () => {
    it('produces output', () => {
      const sut = new SimpleCartProcessor(dummyOffersProcessor(), opt)
      expect(Object.keys(sut.process(dummyCart()))).toEqual(['items', 'offersApplied', 'vatApplied', 'total'])
    })

    it('applies self-item offer', () => {
      const price = 100
      const items: ItemCollection = { Apple: { price, quantity: 1 } }
      const priceModifier = 0.9
      const offer: Offer = {
        name: '10% off apples',
        requiredItem: 'Apple',
        requiredCount: 1,
        itemOnOffer: 'Apple',
        priceModifier,
      }

      const sut = new SimpleCartProcessor(new SimpleOfferProcessor([offer]), opt)

      const stubCart = dummyCart(items)
      const output = sut.process(stubCart)

      expect(output.offersApplied).toHaveLength(1)
      const offerName = output.offersApplied[0].offer
      expect(offerName).toEqual(offer.name)
      const offerAmount = output.offersApplied[0].amount
      expect(offerAmount).toBeCloseTo(price * (1 - priceModifier))
      expect(output.total).toEqual(price * priceModifier)
    })

    it('applies another-item offer', () => {
      const price1 = 100
      const price2 = 300
      const items: ItemCollection = {
        Apple: { price: price1, quantity: 2 },
        Banana: { price: price2, quantity: 1 },
      }
      const priceModifier = 0.5
      const offer: Offer = {
        name: 'buy 2 apples get banana half price',
        requiredItem: 'Apple',
        requiredCount: 2,
        itemOnOffer: 'Banana',
        priceModifier,
      }

      const sut = new SimpleCartProcessor(new SimpleOfferProcessor([offer]), opt)
      const stubCart = dummyCart(items)

      const output = sut.process(stubCart)
      expect(output.offersApplied).toHaveLength(1)
      const offerName = output.offersApplied[0].offer
      expect(offerName).toEqual(offer.name)
      const offerAmount = output.offersApplied[0].amount
      expect(offerAmount).toBeCloseTo(price2 * (1 - priceModifier))
      expect(output.total).toEqual(price1 * 2 + price2 * priceModifier)
    })

    it('applies complex offer', () => {
      const price1 = 100
      const price2 = 200
      const price3 = 300
      const items: ItemCollection = {
        Apple: { price: price1, quantity: 5 },
        Banana: { price: price2, quantity: 3 },
        Chocolate: { price: price3, quantity: 3 },
      }
      const priceModifier1 = 0.5
      const offer1: Offer = {
        name: 'buy 2 apples get banana half price',
        requiredItem: 'Apple',
        requiredCount: 2,
        itemOnOffer: 'Banana',
        priceModifier: priceModifier1,
      }
      const priceModifier2 = 0.9
      const offer2: Offer = {
        name: '10% off chocolate',
        requiredItem: 'Chocolate',
        requiredCount: 1,
        itemOnOffer: 'Chocolate',
        priceModifier: priceModifier2,
      }

      const sut = new SimpleCartProcessor(new SimpleOfferProcessor([offer1, offer2]), opt)
      const stubCart = dummyCart(items)

      const output = sut.process(stubCart)

      expect(output.offersApplied).toHaveLength(2)
      const offerName1 = output.offersApplied[0].offer
      expect(offerName1).toEqual(offer1.name)
      const offerAmount1 = output.offersApplied[0].amount
      expect(offerAmount1).toBeCloseTo(price2 * 2 * (1 - priceModifier1))
      const offerName2 = output.offersApplied[1].offer
      expect(offerName2).toEqual(offer2.name)
      const offerAmount2 = output.offersApplied[1].amount
      expect(offerAmount2).toBeCloseTo(price3 * 3 * (1 - priceModifier2))
      expect(output.total).toEqual(price1 * 5 + price2 + price2 * 2 * priceModifier1 + price3 * 3 * priceModifier2)
    })

    it('calculates vat', () => {
      const price = 100
      const quantity = 10
      const items: ItemCollection = { Apple: { price, quantity } }

      const vat = 0.14
      const sut = new SimpleCartProcessor(dummyOffersProcessor(), { vat })
      const stubCart = dummyCart(items)

      expect(sut.process(stubCart).vatApplied).toEqual({ percent: vat, amount: price * quantity * vat })
    })

    it('calculates total', () => {
      const price1 = 100
      const price2 = 200
      const price3 = 300
      const items: ItemCollection = {
        Apple: { price: price1, quantity: 5 },
        Banana: { price: price2, quantity: 3 },
        Chocolate: { price: price3, quantity: 3 },
      }
      const priceModifier1 = 0.5
      const offer1: Offer = {
        name: 'buy 2 apples get banana half price',
        requiredItem: 'Apple',
        requiredCount: 2,
        itemOnOffer: 'Banana',
        priceModifier: priceModifier1,
      }
      const priceModifier2 = 0.9
      const offer2: Offer = {
        name: '10% off chocolate',
        requiredItem: 'Chocolate',
        requiredCount: 1,
        itemOnOffer: 'Chocolate',
        priceModifier: priceModifier2,
      }

      const vat = 0.14
      const sut = new SimpleCartProcessor(new SimpleOfferProcessor([offer1, offer2]), { vat })
      const stubCart = dummyCart(items)

      expect(sut.process(stubCart).total).toBeCloseTo(
        (price1 * 5 + price2 + price2 * 2 * priceModifier1 + price3 * 3 * priceModifier2) * (1 + vat),
      )
    })
  })
})
