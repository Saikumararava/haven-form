import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ToastStack } from '../components/ToastStack'
import { AppProvider } from '../context/AppProvider'
import { ShopPage } from './ShopPage'

function renderShop() {
  return render(
    <MemoryRouter>
      <AppProvider>
        <ShopPage />
        <ToastStack />
      </AppProvider>
    </MemoryRouter>,
  )
}

describe('ShopPage', () => {
  it('filters by category and search', async () => {
    const user = userEvent.setup()
    renderShop()

    expect(screen.getByText(/Nori Linen Sofa/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Lighting' }))
    expect(screen.getByText(/Arun Copper Table Lamp/i)).toBeInTheDocument()
    expect(screen.queryByText(/Nori Linen Sofa/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'All' }))
    await user.type(screen.getByPlaceholderText(/search name/i), 'wool throw')
    expect(screen.getByText(/Dusk Wool Throw/i)).toBeInTheDocument()
    expect(screen.queryByText(/Nori Linen Sofa/i)).not.toBeInTheDocument()
  })

  it('adds a piece to the sample cart', async () => {
    const user = userEvent.setup()
    renderShop()
    await user.click(screen.getAllByRole('button', { name: /add to cart/i })[0])
    expect(await screen.findByText(/added to cart/i)).toBeInTheDocument()
  })
})
