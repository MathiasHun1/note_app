import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parents state and calls onSubmit', async () => {
  const handleAddNote = vi.fn()
  const user = userEvent.setup()

  const { container } = render(<NoteForm handleAddNote={handleAddNote} />)

  // const input = screen.getByRole('textbox')
  const input = container.querySelector('#note-input')
  const sendButton = screen.getByText('Add')

  await user.type(input, 'testing a form..')
  await user.click(sendButton)

  console.log(handleAddNote.mock.calls);
  expect(handleAddNote.mock.calls).toHaveLength(1)
  expect(handleAddNote.mock.calls[0][0].content).toBe('testing a form..')
})