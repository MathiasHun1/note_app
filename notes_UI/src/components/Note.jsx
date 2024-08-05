
const Note = ({ content, important, handleDeleteNote, noteId }) => {
  const text = important ? 'important' : 'not important'
  return (
    <div className="flex gap-2 my-2">
      <p>{content}</p>

      <button className="bg-gray-200 px-2 rounded-sm hover:bg-gray-400">{text}
      </button>

      <button className="bg-gray-200 px-2 rounded-sm hover:bg-gray-400" onClick={() => handleDeleteNote(noteId)}>
        Delete
      </button>

    </div>
  )
}

export default Note