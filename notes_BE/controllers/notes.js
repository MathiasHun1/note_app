const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv')
require('express-async-errors')

const getTokenFrom = (req) => {
  let auth = req.get('authorization')
  console.log(auth);
  if(auth && auth.startsWith('Bearer')) {
    const token = auth.replace('Bearer ', '')
    return token
  }
  return null
}

notesRouter.get('/', async (req, res) => {
  const result = await Note.find({}).populate('user', {name: 1, username: 1})

  if(!result) {
    res.status(404).json({error: 'notes not found'})
  }

  res.json(result)
})

notesRouter.get('/:id', async (req, res) => {
  const { id } = req.params

  const note = await Note.findById(id)
  if(!note) {
    return res.status(404).json({error: 'Note not found'})
  }

  res.json(note)
})

notesRouter.delete('/:id', async (req, res) => {
  const token = req.token
  const user = req.user

  if(!(user && token)) {
    return res.status(401).json({error: 'token invalid or missing'})
  }
    await Note.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

notesRouter.post('/', async (req, res) => {
  const token = req.token
  const user = req.user

  if(!(token && user)) {
    return res.status(401).json({error: 'token missing or invalid'})
  }
  
  if(!req.body.content) {
    return res.status(400).json({error: 'content missing'})
  }

    const note = new Note({
      content: req.body.content,
      important: req.body.important || false,
      user: user.id
    })
  
    const savedNote = await note.save()
    const savedUser = await User.findById(user.id)
  
    savedUser.notes = savedUser.notes.concat(savedNote.id)
    await savedUser.save()
    
    res.status(201).json(savedNote)
})

notesRouter.put('/:id', async (req, res) => {
  const token = req.token
  const user = req.user

  console.log('ID:', req.params.id);

  if(!(token && user)) {
    return res.status(401).json({error: 'token missing or invalid'})
  }

  // if(!req.body.content || !req.body.important) {
  //   return res.status(400).json({error: 'content missing'})
  // }

  const note = {
    content: req.body.content,
    important: req.body.important,
    user: user.id
  }

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, note, {returnDocument: 'after'})

  res.status(200).json(updatedNote)
})

module.exports = notesRouter

// doing post note route using token based auth, test for this needed to be done too