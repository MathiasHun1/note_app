import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing library',
    impotant: true
  }

  const { container } = render(<Note note={note} />)

  // screen.debug()

  const div = container.querySelector('.note')
  expect(div).toHaveTextContent('Component testing is done with react-testing library')

  // const element = screen.getByText('Component testing is done with react-testing library')

  // expect(element).toBeDefined()
})

test('Clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing library',
    impotant: true
  }

  const mockHandler = vi.fn()

  render(<Note note={note} toggleImportance={mockHandler} />)

  const user = userEvent.setup()
  
  const button = screen.getByText('not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})