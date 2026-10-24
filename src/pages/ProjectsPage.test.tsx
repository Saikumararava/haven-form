import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppProvider } from '../context/AppProvider'
import { ProjectsPage } from './ProjectsPage'

describe('ProjectsPage', () => {
  it('filters the gallery by category and search', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AppProvider>
          <ProjectsPage />
        </AppProvider>
      </MemoryRouter>,
    )

    expect(screen.getByText(/The Amber Sitting Room/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Bedrooms' }))
    expect(screen.getByText(/Quiet Oak Bedroom/i)).toBeInTheDocument()
    expect(screen.queryByText(/The Amber Sitting Room/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'All' }))
    await user.type(screen.getByPlaceholderText(/search style/i), 'kochi')
    expect(screen.getByText(/Palmyra Suite/i)).toBeInTheDocument()
    expect(screen.queryByText(/Quiet Oak Bedroom/i)).not.toBeInTheDocument()
  })
})
