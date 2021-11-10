import { NextApiHandler } from 'next'
import { CartItem } from '../../server/cart/cart'
import cartHandler from '../../server/cart/cart-handler'

interface CartSuccessResponse {
  cart: CartItem[]
}
interface CartFailureResponse {
  error: string
}
type CartResponse = CartSuccessResponse | CartFailureResponse

const handler: NextApiHandler<CartResponse> = (req, res) => {
  if (!['POST', 'DELETE'].includes(req.method ?? '')) return void res.status(405).end()

  try {
    if (req.method === 'DELETE') {
      const cart = cartHandler({ type: 'empty' })
      return void res.status(202).json({ cart })
    }

    const itemName = req.body.itemName
    if (typeof itemName !== 'string')
      return void res.status(400).json({ error: 'Expected body to be { itemName: string, quantity: number }' })
    const quantity = req.body.quantity
    if (typeof quantity !== 'number')
      return void res.status(400).json({ error: 'Expected body to be { itemName: string, quantity: number }' })

    const cart = cartHandler({ type: 'add', itemName, quantity })
    return void res.json({ cart })
  } catch (e) {
    console.log('error:', e)
    if ((e as Error)?.message === 'item not found') return void res.status(404).json({ error: 'item not found' })
    return void res.status(500).json({ error: 'server error' })
  }
}

export default handler
