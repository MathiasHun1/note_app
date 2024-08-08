import { useEffect, useRef, useState } from "react"
import InputField from "./components/InputField"
import StdButton from "./components/StdButton"
import LoginForm from "./components/LoginForm"
import loginService from "./services/loginService"
import noteService from "./services/noteService"
import regiterService from "./services/regiterService"
import Togglable from "./components/Togglable"
import Message from "./components/Message"
import NoteForm from "./components/NoteForm"
import NotesList from "./components/NotesList"
import RegisterForm from "./components/RegisterForm"

function App() {
  const [login, setLogin] = useState(true)
  const [register, setREgister] = useState(true)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [user, setUser] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [successMsg, setSuccesMsg] = useState(null)
  const [usersNotes, setUsersNotes] = useState([])
  const [showImportant, setShowImportant] = useState(true)
  const [showAll, setShowAll] = useState(true)

  const notesToShow = usersNotes
    .filter(note => (
      showAll ? note : note.important === true
    ))

  const ref = useRef(null)

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

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePassChange = (e) => {
    setPassword(e.target.value)
  }

  const handleConfirmPassChange = (e) => {
    setConfirmPass(e.target.value)
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
    setUsersNotes([])
    window.localStorage.clear()
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    //try to register new member
    try {
      await regiterService.userRegister({name, username, password, confirmPassword: confirmPass})

      const result = await loginService.userLogin({ username, password })
      setUser(result)

      window.localStorage.setItem('loggedInUser', JSON.stringify(result))

      setName('')
      setUsername('')
      setPassword('')
      setConfirmPass('')
    } catch (err) {
      console.log(err)
    }
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

  const deleteAllNotes = async () => {
    try {
      for(let note of usersNotes) {
        noteService.setToken(user)
        await noteService.deleteNote(note.id)
      }
      setUsersNotes([])
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const handleAddNote = async (credentials) => {

    try {
      noteService.setToken(user)
      const result = await noteService.addNote(credentials)
      setUsersNotes(usersNotes.concat(result))
      // ref.current.toggleVisibility()
      
    } catch (err) {
      console.log('error: ', err)
    }
  }

  const toggleImportance = async (id) => {
    try {
      const note = usersNotes.find(n => n.id === id)
      const updatedNote = {...note, important: !note.important}
      // updatedNote.important = !updatedNote.important

      const updatedNotes = usersNotes.map(n => n.id !== id ? n : updatedNote)
      setUsersNotes(updatedNotes)
      noteService.setToken(user)
      await noteService.updateNote(id, {important: updatedNote.important})
    }catch(err) {
      console.log(err)
    }
  }


  return (
    <div className="pt-2 w-screen min-h-screen bg-green-300 flex flex-col items-center relative">
      <h1 className="text-2xl font-bold">NOTE APP</h1>
      <div>

        <div className="flex flex-col items-center gap-4">
          {!user && login && (
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

          {!user && register && (
            <Togglable buttonText="Register">
              <RegisterForm
                handleRegister={handleRegister}
                handleUsernameChange={handleUsernameChange}
                handlePassChange={handlePassChange}
                handleConfirmPassChange={handleConfirmPassChange}
                handleNameChange={handleNameChange}
                name={name}
                username={username}
                password={password}
                confirmPass={confirmPass}
          
              />
            </Togglable>
          )}
        </div>

        {user && (
          <div>
            <div className="absolute top-2 left-2">
              <h1 className="inline">{user.username} </h1>
              <StdButton 
                onClick={handleLogout}
                text="sign out" 
                className=" block bg-gray-600 h-6 text-sm" />
            </div>
            <Togglable buttonText="Add note" ref={ref}>
              <NoteForm handleAddNote={handleAddNote}/>
            </Togglable>

            <main className="">
              {usersNotes && (
                <NotesList 
                notesToShow={notesToShow}
                handleDeleteNote={handleDeleteNote}
                toggleImportance={toggleImportance}
                showImportant={showImportant}
                deleteAllNotes={deleteAllNotes}
                />
              )}
              <StdButton 
                text="Delete All"
                onClick={deleteAllNotes}
                className=" w-full text-center mb-2" 
              />
              <StdButton 
                text={`${showAll ? "show important" : "show all"}`}
                onClick={() => setShowAll(!showAll)}
                className=" p-1 px-2 text-center absolute top-16 left-2" 
              />
            </main>
          </div>
        )}
        
      </div>
    </div>
  )
}

export default App


//implemented login, logout, togglable component. Next: create note adding form + rendering own notes