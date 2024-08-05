const { beforeEach, describe, test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Note = require('../models/note')
const User = require('../models/user')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')

const api = supertest(app)

describe('GET notes', () => {
  beforeEach(async () => {
    await Note.deleteMany({})
    const notesDocuments = helper.initialNotes.map(note => new Note(note))

    for(let note of notesDocuments) {
      await note.save()
    }
  })

  test('responds with correct status codes', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-type', /application\/json/)
  })

  test('returns all documents', async () => {
    const response = await api.get('/api/notes')
    const returnedNotes = response.body

    assert.strictEqual(returnedNotes.length, helper.initialNotes.length)
  })

  test('notes are in correct format', async () => {
    const response = await api.get('/api/notes')
    const returnedNotes = response.body

    assert(returnedNotes[0].id)

    const note = {
      content: returnedNotes[0].content,
      important: returnedNotes[0].important
    }

    assert.deepStrictEqual(note, helper.initialNotes[0])
  })
  
  test('return a single note properly', async () => {
    const newNote = new Note({
      content: 'third note',
      important: true
    })

    const result = await newNote.save()
    const id = result._id.toString()

    await api
      .get(`/api/notes/${id}`)
      .expect(200)
      .expect('Content-type', /application\/json/)
  })
})

describe('POST', () => {
  let token

  beforeEach(async () => {
    //delete all users and notes in db
    await User.deleteMany({})
    await Note.deleteMany({})

    //add a new user into db
    const newUser = {
      name: 'nagy lajos',
      username: 'lalipapi',
      password: 'admin'
    }

    await api
      .post('/api/users')
      .send(newUser)
      
    //login with user
    const loginResult = await api
      .post('/api/login')
      .send({username: 'lalipapi', password: 'admin'})
    
    token = loginResult.body.token
  })
    
  test('create note with good token', async () => {
    
    //post a new note with token auth
    const note = {
      content: 'test note',
      important: true
    }

    await api
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(note)
      .expect(201)
      .expect('Content-type', /application\/json/)
  })

  test('not creates note with bad token', async () => {
    token = 'FEFWEF'

    const note = {
      content: 'test note',
      important: true
    }

    await api
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(note)
      .expect(401)
  })

  test('raises error without token', async () => {

    const note = {
      content: 'test note',
      important: true
    }

    await api
      .post('/api/notes')
      .send(note)
      .expect(401)
  })
})


describe('DELETE notes', () => {
  beforeEach(async () => {
    //load data
    await helper.generateUsersAndNotes()
  })
  
  test('deletes a note wit logged in user', async () => {
    //login with user
    const loginResult = await api
      .post('/api/login')
      .send({username: 'kisjani', password: 'admin'})
    
    const token = loginResult.body.token
    const notesAtStart = await helper.notesInDb()
    
    const note = await Note.findOne({content: "jani's note 1"})
    const id = note._id.toString()

    await api
      .delete(`/api/notes/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const notesAtEnd = await helper.notesInDb()
    assert.strictEqual(notesAtStart.length, notesAtEnd.length + 1)
  })

  test('declines to delete note without logged in user', async () => {
    const notesAtStart = await helper.notesInDb()
    const note = await Note.findOne({content: "jani's note 1"})
    const id = note._id.toString()

    await api
    .delete(`/api/notes/${id}`)
    .expect(401)

    const notesAtEnd = await helper.notesInDb()
    assert.strictEqual(notesAtStart.length, notesAtEnd.length)
  })
})

describe('PUT', () => {
  beforeEach(async () => {
    User.deleteMany({})
    Note.deleteMany({})
    await helper.generateUsersAndNotes()
  })

  test('updates note with logged in user', async () => {
    const loginResult = await api
    .post('/api/login')
    .send({username: 'kisjani', password: 'admin'})
  
    const token = loginResult.body.token
    const notesAtStart = await helper.notesInDb()

    const allNotes = await Note.find({})
    const noteToUpdate = allNotes[0]
    const payLoad = {
        content: 'updated content',
        important: false
    }

    const result = await api
      .put(`/api/notes/${noteToUpdate._id.toString()}`)
      .send(payLoad)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

      const updatedNote = result.body
      const notesAtEnd = await helper.notesInDb()

    assert.strictEqual(notesAtStart.length, notesAtEnd.length)
    assert.strictEqual(updatedNote.id, noteToUpdate._id.toString())
    assert.deepStrictEqual(updatedNote.user, noteToUpdate.user.toString())
    assert(updatedNote.user)
  })
})


after(async () => {
  await mongoose.connection.close()
})