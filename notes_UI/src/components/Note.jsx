
const Note = ({ content, important, handleDeleteNote, noteId, handleUpdateNote, usersNotes,  setUsersNotes }) => {
  const text = important ? 'important' : 'not important'

  const toggleImportance = async () => {
    await handleUpdateNote(noteId, { important: !important })

    const updatedNotes = usersNotes.map(note => {
      if (note.id === noteId) {
        note.important = !important
        return note
      }
      return note
    }) 

    setUsersNotes(updatedNotes)
  }


  return (
    <div className="flex gap-2 my-2">
      <p>{content}</p>

      <button onClick={toggleImportance} className="bg-gray-200 px-2 rounded-sm hover:bg-gray-400">{text}
      </button>

      <button className="bg-gray-200 px-2 rounded-sm hover:bg-gray-400" onClick={() => handleDeleteNote(noteId)}>
        Delete
      </button>

    </div>
  )
}

export default Note