import { NextApiHandler } from 'next'
import checkoutHandler from '../../../server/cart/checkout-handler'
import { CartProcessingOutput } from '../../../server/cart/cart-processor'

interface CartCheckoutSuccessResponse extends CartProcessingOutput {}
interface CartCheckoutFailureResponse {
  error: string
}
type CartCheckoutResponse = CartCheckoutSuccessResponse | CartCheckoutFailureResponse

const handler: NextApiHandler<CartCheckoutResponse> = (req, res) => {
  if (req.method !== 'GET') return void res.status(405).end()

  try {
    return void res.json(checkoutHandler())
  } catch (e) {
    console.log('error:', e)
    return void res.status(500).json({ error: 'server error' })
  }
}

export default handler
