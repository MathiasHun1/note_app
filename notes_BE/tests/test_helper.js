const bcrypt = require('bcrypt')
const User = require('../models/user')
const Note = require('../models/note')
const user = require('../models/user')

const createHash = async (password, saltRounds=10) => {
  const result = await bcrypt.hash(password, saltRounds)
  return result
}

const generateUsersToDb = async () => {
return [
    {
      name: 'Nagy Elemér',
      username: 'nagyeli',
      passwordHash: await createHash('admin')
    },  
    {
      name: 'Kis Tivadar',
      username: 'kisti',
      passwordHash: await createHash('admin'),
    },
    {
      name: 'Közepes Csilla',
      username: 'csillu',
      passwordHash: await createHash('admin'),
    },
  ]
}

const initialNotes = [
  {
    content: "first note",
    important: true
  },
  {
    content: "second note",
    important: false
  }
]

const generateUsersAndNotes = async () => {
  //make two users
  const user1 = new User({
    name: 'Kiss János',
    username: 'kisjani',
    passwordHash: await createHash('admin', 10),
    notes: []
  })

  const user2 = new User({
    name: 'Nagy Lajos',
    username: 'nagylali',
    passwordHash: await createHash('admin', 10),
    notes: []
  })

  //make two notes for user 1
  const note1 = new Note({
    content: "jani's note 1",
    important: true,
    user: user1._id
  })

  const note2 = new Note({
    content: "jani's note 2",
    important: true,
    user: user1._id
  })

  user1.notes = user1.notes.concat(note1._id)
  user1.notes = user1.notes.concat(note2._id)

  await user1.save()
  await note1.save()
  await note2.save()

  //make notes for user2
  const note3 = new Note({
    content: "lali's note 1",
    important: false,
    user: user2._id
  })

  const note4= new Note({
    content: "lali's note 2",
    important: true,
    user: user2._id
  })

  user2.notes = user2.notes.concat(note3._id)
  user2.notes = user2.notes.concat(note4._id)

  await user2.save()
  await note3.save()
  await note4.save()
}

const usersInDb = async () => {
  const allUsers = await User.find({})
  return allUsers
}

const notesInDb = async () => {
  const allNotes = await Note.find({})
  return allNotes
}

module.exports = { generateUsersToDb, usersInDb, notesInDb, initialNotes, generateUsersAndNotes }



