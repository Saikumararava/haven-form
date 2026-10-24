import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppProvider } from '../context/AppProvider'
import { CartPage } from './CartPage'
import { ShopPage } from './ShopPage'

function renderCartWithItem() {
  return render(
    <MemoryRouter>
      <AppProvider>
        <ShopPage />
        <CartPage />
      </AppProvider>
    </MemoryRouter>,
  )
}

describe('CartPage', () => {
  it('updates quantities and handles demo checkout modal', async () => {
    const user = userEvent.setup()
    renderCartWithItem()

    // Add first item from shop
    const addButtons = screen.getAllByRole('button', { name: /add to cart/i })
    await user.click(addButtons[0])

    // Verify item in cart
    expect(screen.getByText(/Items count/i)).toBeInTheDocument()

    // Open instant demo checkout
    const checkoutBtn = screen.getByRole('button', { name: /instant demo checkout/i })
    await user.click(checkoutBtn)

    expect(screen.getByText(/Demo checkout enquiry/i)).toBeInTheDocument()

    // Fill the demo checkout form using accessible labels
    const nameInput = screen.getByLabelText(/Full name/i)
    const emailInput = screen.getByLabelText(/^Email/i)
    const phoneInput = screen.getByLabelText(/Phone/i)

    await user.type(nameInput, 'Dev Reviewer')
    await user.type(emailInput, 'reviewer@agency.com')
    await user.type(phoneInput, '+919876543210')

    await user.click(screen.getByRole('button', { name: /submit demo enquiry/i }))

    // Success screen shown with reference
    expect(await screen.findByText(/Thank you for your demo order!/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /view in demo dashboard/i })).toBeInTheDocument()
  })
})
