import { NextApiHandler } from 'next'
import itemsHandler, { Item } from '../../server/items/items-handler'

const handler: NextApiHandler<Item[]> = (req, res) => {
  if (req.method !== 'GET') return void res.status(405).end()
  res.json(itemsHandler())
}

export default handler
