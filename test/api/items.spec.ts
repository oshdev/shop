import items from '../../src/server/items/items.json'
import request from 'supertest'

describe('items collection', () => {
  const server = request('http://localhost:3000')

  it('returns list of items', async () => {
    await server.get('/api/items').expect(200, items)
  })

  it('handles not allowed HTTP method', async () => {
    await server.post('/api/items').expect(405)
  })
})
