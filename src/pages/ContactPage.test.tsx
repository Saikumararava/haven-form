import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppProvider } from '../context/AppProvider'
import { ContactPage } from './ContactPage'

describe('ContactPage', () => {
  it('shows accessible errors when submitted empty', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AppProvider>
          <ContactPage />
        </AppProvider>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /send sample enquiry/i }))
    expect(await screen.findAllByRole('alert')).not.toHaveLength(0)
    expect(screen.getByText(/please enter your full name/i)).toBeInTheDocument()
  })

  it('saves a valid enquiry and shows a reference', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AppProvider>
          <ContactPage />
        </AppProvider>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/full name/i), 'Meera Iyer')
    await user.type(screen.getByLabelText(/^email$/i), 'meera@example.com')
    await user.type(screen.getByLabelText(/^phone$/i), '9876543210')
    await user.selectOptions(screen.getByLabelText(/service required/i), 'Consultation')
    await user.selectOptions(screen.getByLabelText(/budget range/i), 'Under ₹5L')
    await user.type(
      screen.getByLabelText(/^message$/i),
      'Please help with a bedroom refresh using oak and linen.',
    )
    await user.click(screen.getByRole('button', { name: /send sample enquiry/i }))

    expect(await screen.findByText(/enquiry reference/i)).toBeInTheDocument()
    expect(screen.getByText(/HF-20/)).toBeInTheDocument()
  })
})
