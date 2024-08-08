import { useState } from "react"
import InputField from "./InputField"
import StdButton from "./StdButton"

const NoteForm = ({ handleAddNote }) => {
  const [content, setContent] = useState('')
  const [important, setImportant] = useState(true)

  const addNote = async (e) => {
    e.preventDefault()
    await handleAddNote({ content, important })
    setContent('')
  }

  const handleChange = (e) => {
    setContent(e.target.value)
  }

  return (
    <form onSubmit={(e) => addNote(e)}
    className="px-8 py-4 bg-emerald-600 w-fit flex flex-col gap-2 shadow-lg">

      <InputField type="text" text="note:" placeholder="note here" onChange={handleChange} value={content} id="note-input"/>

      <div className="flex flex-col items-center">
        <p className="inline">important? </p>
        <input type="checkbox" checked={important} onChange={() => setImportant(!important)}/>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <StdButton type="submit" text="Add" className="p-2 w-32"/>
      </div>
    </form>
  )
}

export default NoteForm