import request from 'supertest'

describe('cart checkout', () => {
  const server = request('http://localhost:3000')

  beforeEach(async () => await server.delete('/api/cart'))

  it('checks out', async () => {
    await server
      .post('/api/cart')
      .send({ itemName: 'apple', quantity: 5 })
      .expect(200)

    await server
      .post('/api/cart')
      .send({ itemName: 'banana', quantity: 3 })
      .expect(200)

    await server
      .post('/api/cart')
      .send({ itemName: 'chocolate', quantity: 2 })
      .expect(200)

    await server
      .get('/api/cart/checkout')
      .expect(200, {
        items: {
          apple: { price: 100, quantity: 5 },
          banana: { price: 200, quantity: 3 },
          chocolate: { price: 300, quantity: 2 }
        },
        offersApplied: [
          { amount: 60, offer: 'chocolate 10% off' },
          { amount: 300, offer: 'buy 2 apples get banana half price' }
        ],
        vatApplied: { percent: 0.14, amount: 187.60000000000002 },
        total: 1527.6
      })
  })

  it('handles unexpected HTTP methods', async () => {
    await server.post('/api/cart/checkout').expect(405)
  })
})
