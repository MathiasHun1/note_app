import { useEffect, useState } from "react"
import InputField from "./components/InputField"
import StdButton from "./components/StdButton"
import LoginForm from "./components/LoginForm"
import loginService from "./services/loginService"
import noteService from "./services/noteService"
import Togglable from "./components/Togglable"
import Message from "./components/Message"
import NoteForm from "./components/NoteForm"
import Note from "./components/Note"

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [successMsg, setSuccesMsg] = useState(null)
  const [usersNotes, setUsersNotes] = useState(null)

  useEffect(() => {
    const loggedInUser = window.localStorage.getItem('loggedInUser')
    if(loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
  }, [])

  useEffect(() => {
    const getnotes = async () => {
      const notes = await noteService.getUsersNotes(user.username)
      setUsersNotes(notes)
    }
    if (user) {
      getnotes()
    }
  }, [user])

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePassChange = (e) => {
    setPassword(e.target.value)
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const result = await loginService.userLogin({ username, password })
      setUser(result)

      window.localStorage.setItem('loggedInUser', JSON.stringify(result))

      

      setUsername('')
      setPassword('')
    } catch (err) {
      setErrorMsg('Wrong username or password')
      setTimeout(() => {
        setErrorMsg(null)
      }, 3000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    setUsersNotes(null)
    window.localStorage.clear()
  }

  const handleDeleteNote = async (id) => {
    try {
      noteService.setToken(user)
      await noteService.deleteNote(id)
      setUsersNotes(usersNotes.filter(note => note.id !== id))
    }catch(err) {
      console.log('error: ', err)
    }
  }

  const handleAddNote = async (e, credentials) => {
    e.preventDefault()

    try {
      noteService.setToken(user)
      const result = await noteService.addNote(credentials)
      setUsersNotes(usersNotes.concat(result))      
    } catch (err) {
      console.log('error: ', err)
    }
  }

  return (
    <div className="pt-2 w-screen min-h-screen bg-green-300 flex flex-col items-center relative">
      <h1 className="text-2xl font-bold">NOTE APP</h1>
      <header>

        {!user && (
          <>
            <Togglable buttonText="Login">
              <LoginForm
                handleLogin={handleLogin}
                handleUsernameChange={handleUsernameChange}
                handlePassChange={handlePassChange}
                username={username}
                password={password}
              />
            </Togglable>
            <Message successMsg={successMsg} errorMsg={errorMsg} />
          </>
        )}

        {user && (
          <div>
            <div className="absolute top-2 left-2">
              <h1 className="inline">{user.username} </h1>
              <StdButton 
                onClick={handleLogout}
                text="sign out" 
                className=" block bg-gray-600 h-6 text-sm" />
            </div>
            <Togglable buttonText="Add note">
              <NoteForm handleAddNote={handleAddNote}/>
            </Togglable>
          </div>
        )}
        
      </header>
      <main>
        {usersNotes && (
          <div>
            {usersNotes.map(note => (
              <Note 
                key={note.id}
                content={note.content}
                important={note.important}
                noteId={note.id}
                handleDeleteNote={handleDeleteNote}
              />
              
            ))}
          </div>
        )}
        
      </main>
    </div>
  )
}

export default App


//implemented login, logout, togglable component. Next: create note adding form + rendering own notes