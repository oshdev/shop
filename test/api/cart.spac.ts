import request from 'supertest'

describe('items collection', () => {
  const server = request('http://localhost:3000')

  beforeEach(async () => await server.delete('/api/cart'))

  it('empties cart', async () => {
    await server.delete('/api/cart').expect(202)
  })

  it('adds an item and returns it', async () => {
    const itemName = 'apple'

    const quantity = 1
    await server
      .post('/api/cart')
      .send({ itemName, quantity })
      .expect(200, { cart: [{ itemName, quantity }] })
  })

  it('adds multiple items consecutively and returns them', async () => {
    const itemName = 'apple'

    await server
      .post('/api/cart')
      .send({ itemName, quantity: 1 })
      .expect(200, { cart: [{ itemName, quantity: 1 }] })

    await server
      .post('/api/cart')
      .send({ itemName, quantity: 2 })
      .expect(200, { cart: [{ itemName, quantity: 3 }] })
  })

  it('removes an item and returns it', async () => {
    const itemName = 'apple'
    const quantity = 2

    await server
      .post('/api/cart')
      .send({ itemName, quantity })
      .expect(200, { cart: [{ itemName, quantity }] })
  })

  it('adds and removes multiple items consecutively and returns them', async () => {
    const itemName = 'apple'

    await server
      .post('/api/cart')
      .send({ itemName, quantity: 2 })
      .expect(200, { cart: [{ itemName, quantity: 2 }] })

    await server
      .post('/api/cart')
      .send({ itemName, quantity: -1 })
      .expect(200, { cart: [{ itemName, quantity: 1 }] })
  })

  it('handles unexpected HTTP methods', async () => {
    await server.get('/api/cart').expect(405)
  })

  it.each<[body: any]>([
    [{ oops: 'not expected' }],
    [{ itemName: { not: 'expected' } }],
    [{ itemName: 'no quantity' }],
    [{ itemName: 'no quantity', quantity: 'not a number' }],
  ])('handles unexpected body', async (body) => {
    await server.post('/api/cart').send(body).expect(400)
  })
})
