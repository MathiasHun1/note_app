import axios from 'axios'

const baseUrl = '/api/notes'

let token 

const setToken = (user) => {
  token = `Bearer ${user.token}`
}

const config = () => {
  return {
    headers: {
      'Authorization': token
    } 
  }
}
 
const getUsersNotes = async (username) => {
  try{
    const response = await axios.get(baseUrl)
    const usersNotes = response.data.filter(note => note.user.username === username)

    return usersNotes
  } catch(err) {
    console.log('error:', err.message);
    // throw new Error(err.message)
  }
}

const deleteNote = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, config())
}

const addNote = async (payLoad) => {
  const response = await axios.post(baseUrl, payLoad, config())
  return response.data
}

const updateNote = async (id, payLoad) => {
  const response = await axios.put(`${baseUrl}/${id}`, payLoad, config())

  return response.data
}


export default { getUsersNotes, deleteNote, addNote, updateNote, setToken}