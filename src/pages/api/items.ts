import { NextApiHandler } from 'next'
import itemsHandler, { Item } from '../../server/items/items-handler'

const handler: NextApiHandler<Item[]> = (req, res) => {
  res.json(itemsHandler())
}

export default handler
