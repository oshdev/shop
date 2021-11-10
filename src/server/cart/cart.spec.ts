import InMemoryCart, { CartOptions, Item, Offer } from './cart'

describe('In Memory Cart', () => {
  const opt: CartOptions = {
    vat: 0,
    offers: [],
  }

  it('allows to add a single item', () => {
    const item: Item = {
      name: 'Apple',
      price: 123,
    }
    const sut = new InMemoryCart(opt)

    sut.add(item, 1)
  })

  it('allows to add multiple items', () => {
    const item: Item = {
      name: 'Apple',
      price: 123,
    }
    const sut = new InMemoryCart(opt)

    sut.add(item, 2)
  })

  describe('output', () => {
    it('produces output', () => {
      const sut = new InMemoryCart(opt)
      expect(Object.keys(sut.produceOutput())).toEqual(['items', 'offersApplied', 'vatApplied', 'total'])
    })

    it('applies self-item offer', () => {
      const item: Item = {
        name: 'Apple',
        price: 100,
      }
      const offer: Offer = {
        name: '10% off apples',
        requiredItem: 'Apple',
        requiredCount: 1,
        itemOnOffer: 'Apple',
        priceModifier: 0.9,
      }

      const sut = new InMemoryCart({ ...opt, offers: [offer] })

      sut.add(item, 1)

      const output = sut.produceOutput()

      expect(output.offersApplied).toEqual([{ offer: offer.name, amount: 10 }])
      expect(output.total).toEqual(item.price * 0.9)
    })

    it('applies another-item offer', () => {
      const item1: Item = {
        name: 'Apple',
        price: 100,
      }
      const item2: Item = {
        name: 'Banana',
        price: 100,
      }
      const offer: Offer = {
        name: 'buy 2 apples get banana half price',
        requiredItem: 'Apple',
        requiredCount: 2,
        itemOnOffer: 'Banana',
        priceModifier: 0.5,
      }

      const sut = new InMemoryCart({ ...opt, offers: [offer] })

      sut.add(item1, 2)
      sut.add(item2, 1)

      const output = sut.produceOutput()

      expect(output.offersApplied).toEqual([{ offer: offer.name, amount: 50 }])
      expect(output.total).toEqual(item1.price * 2 + item2.price * 0.5)
    })

    it('applies complex offer', () => {
      const item1: Item = {
        name: 'Apple',
        price: 100,
      }
      const item2: Item = {
        name: 'Banana',
        price: 100,
      }
      const item3: Item = {
        name: 'Chocolate',
        price: 100,
      }
      const offer1: Offer = {
        name: 'buy 2 apples get banana half price',
        requiredItem: 'Apple',
        requiredCount: 2,
        itemOnOffer: 'Banana',
        priceModifier: 0.5,
      }
      const offer2: Offer = {
        name: '10% off chocolate',
        requiredItem: 'Chocolate',
        requiredCount: 1,
        itemOnOffer: 'Chocolate',
        priceModifier: 0.9,
      }

      const sut = new InMemoryCart({ ...opt, offers: [offer1, offer2] })

      sut.add(item1, 5)
      sut.add(item2, 3)
      sut.add(item3, 3)

      expect(sut.produceOutput().offersApplied).toEqual([
        { offer: offer1.name, amount: 100 * 2 * 0.5 },
        { offer: offer2.name, amount: 100 * 3 * 0.1 },
      ])
      expect(sut.produceOutput().total).toEqual(
        item1.price * 5 + item2.price + item2.price * 2 * 0.5 + item3.price * 3 * 0.9,
      )
    })

    it('calculates vat', () => {
      const item: Item = {
        name: 'Apple',
        price: 100,
      }

      const sut = new InMemoryCart({ ...opt, vat: 0.14 })

      sut.add(item, 10)

      expect(sut.produceOutput().vatApplied).toEqual({ percent: 0.14, amount: 140 })
    })

    it('calculates total', () => {
      const item1: Item = {
        name: 'Apple',
        price: 100,
      }
      const item2: Item = {
        name: 'Banana',
        price: 100,
      }
      const item3: Item = {
        name: 'Chocolate',
        price: 100,
      }
      const offer1: Offer = {
        name: 'buy 2 apples get banana half price',
        requiredItem: 'Apple',
        requiredCount: 2,
        itemOnOffer: 'Banana',
        priceModifier: 0.5,
      }
      const offer2: Offer = {
        name: '10% off chocolate',
        requiredItem: 'Chocolate',
        requiredCount: 1,
        itemOnOffer: 'Chocolate',
        priceModifier: 0.9,
      }

      const sut = new InMemoryCart({ vat: 0.14, offers: [offer1, offer2] })

      sut.add(item1, 5)
      sut.add(item2, 3)
      sut.add(item3, 3)

      expect(sut.produceOutput().total).toEqual(
        (item1.price * 5 + item2.price + item2.price * 2 * 0.5 + item3.price * 3 * 0.9) * 1.14,
      )
    })
  })
})
