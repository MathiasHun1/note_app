
const Note = ({ note, handleDeleteNote, toggleImportance, showImportant }) => {
  const { content, important, id } = note
  const text = important ? 'important' : 'not important'
  const showWhenImportant = showImportant 
    ? {"display": 'flex'} 
    : {'display': 'none'}

  return (
    <div style={showWhenImportant} className="note flex justify-between my-2 p-2 bg-gray-100">
      <p>{content}</p>

      <div className="flex gap-2">
        <button onClick={() => toggleImportance(id)} className="bg-gray-200 px-2 rounded-sm hover:bg-gray-400">{text}
        </button>
        <button className="bg-gray-200 px-2 rounded-sm hover:bg-gray-400" onClick={() => handleDeleteNote(id)}>
          X
        </button>
      </div>

    </div>
  )
}

export default Note