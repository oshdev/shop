import { render, screen, waitFor } from '@testing-library/react'
import IndexPage from './index'

describe('index page', () => {
  it('renders heading', async () => {
    render(<IndexPage items={[]} />)

    await waitFor(() => screen.getByRole('heading'))

    expect(screen.getByRole('heading')).toHaveTextContent('Welcome to osh shop')
  })
})
