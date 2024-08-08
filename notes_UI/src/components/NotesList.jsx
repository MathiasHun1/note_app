import Note from "./Note"
import StdButton from "./StdButton"

const NotesList = ({ notesToShow, handleDeleteNote, toggleImportance, showImportant, deleteAllNotes }) => {
  return (
    <div className=" w-80">
      {notesToShow.map(note => (
          <Note
            key={note.id}
            note={note}
            handleDeleteNote={handleDeleteNote}
            toggleImportance={toggleImportance}
            showImportant={showImportant}
          />
      ))}
      
    </div>
  )
}

export default NotesList