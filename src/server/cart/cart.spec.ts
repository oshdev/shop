import InMemoryCart, { CartOptions, Discount, Item } from './cart'

describe('In Memory Cart', () => {
  const opt: CartOptions = {
    vat: 0,
    discounts: [],
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
      expect(Object.keys(sut.produceOutput())).toEqual(['items', 'discountsApplied', 'vatApplied', 'total'])
    })

    it('applies self-item discount', () => {
      const item: Item = {
        name: 'Apple',
        price: 100,
      }
      const discount: Discount = {
        name: '10% off apples',
        requiredItem: 'Apple',
        requiredCount: 1,
        discountedItem: 'Apple',
        priceModifier: 0.9,
      }

      const sut = new InMemoryCart({ ...opt, discounts: [discount] })

      sut.add(item, 1)

      const output = sut.produceOutput()

      expect(output.discountsApplied).toEqual([{ discount: discount.name, amount: 10 }])
      expect(output.total).toEqual(item.price * 0.9)
    })

    it('applies another-item discount', () => {
      const item1: Item = {
        name: 'Apple',
        price: 100,
      }
      const item2: Item = {
        name: 'Banana',
        price: 100,
      }
      const discount: Discount = {
        name: 'buy 2 apples get banana half price',
        requiredItem: 'Apple',
        requiredCount: 2,
        discountedItem: 'Banana',
        priceModifier: 0.5,
      }

      const sut = new InMemoryCart({ ...opt, discounts: [discount] })

      sut.add(item1, 2)
      sut.add(item2, 1)

      const output = sut.produceOutput()

      expect(output.discountsApplied).toEqual([{ discount: discount.name, amount: 50 }])
      expect(output.total).toEqual(item1.price * 2 + item2.price * 0.5)
    })

    it('applies complex discount', () => {
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
      const discount1: Discount = {
        name: 'buy 2 apples get banana half price',
        requiredItem: 'Apple',
        requiredCount: 2,
        discountedItem: 'Banana',
        priceModifier: 0.5,
      }
      const discount2: Discount = {
        name: '10% off chocolate',
        requiredItem: 'Chocolate',
        requiredCount: 1,
        discountedItem: 'Chocolate',
        priceModifier: 0.9,
      }

      const sut = new InMemoryCart({ ...opt, discounts: [discount1, discount2] })

      sut.add(item1, 5)
      sut.add(item2, 3)
      sut.add(item3, 3)

      expect(sut.produceOutput().discountsApplied).toEqual([
        { discount: discount1.name, amount: 100 * 2 * 0.5 },
        { discount: discount2.name, amount: 100 * 3 * 0.1 },
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
      const discount1: Discount = {
        name: 'buy 2 apples get banana half price',
        requiredItem: 'Apple',
        requiredCount: 2,
        discountedItem: 'Banana',
        priceModifier: 0.5,
      }
      const discount2: Discount = {
        name: '10% off chocolate',
        requiredItem: 'Chocolate',
        requiredCount: 1,
        discountedItem: 'Chocolate',
        priceModifier: 0.9,
      }

      const sut = new InMemoryCart({ vat: 0.14, discounts: [discount1, discount2] })

      sut.add(item1, 5)
      sut.add(item2, 3)
      sut.add(item3, 3)

      expect(sut.produceOutput().total).toEqual(
        (item1.price * 5 + item2.price + item2.price * 2 * 0.5 + item3.price * 3 * 0.9) * 1.14,
      )
    })
  })
})
