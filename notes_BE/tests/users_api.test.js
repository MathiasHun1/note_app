const { beforeEach, describe, test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')


const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const users = await helper.generateUsersToDb()

  const usersForSave = users.map(user => new User(user))

  for(let user of usersForSave) {
    await user.save()
  }
})

describe('GET', () => {
  test('return all users', async () => {
    const allUsers = await helper.usersInDb()
    
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-type', /application\/json/)

    assert(allUsers.length === 3)
    assert.strictEqual(response.body.length, allUsers.length)
  })

  test('returns specific user', async () => {
    const allUsers = await helper.usersInDb()
    const randomUserId = allUsers[0]._id.toString()

    await api
      .get(`/api/users/${randomUserId}`)
      .expect(200)
      .expect('Content-type', /application\/json/)

  })
})

describe('POST', () => {

  test('add user succesfully', async () => {
    const usersAtStart = await User.find({})

    const user = {
      name: 'Kovács Csanád',
      username: 'csani',
      password: 'admin'
    }
    
    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-type', /application\/json/)
      
      const usersAtEnd = await User.find({})

      assert.strictEqual(usersAtStart.length+1, usersAtEnd.length)
    })

    test('created user has all the needed fields', async () => {
      await User.deleteMany({})

      const user = {
        name: 'Kovács Csanád',
        username: 'csani',
        password: 'admin'
      }

      const response = await api
        .post('/api/users')
        .send(user)

      assert.strictEqual(user.name, response.body.name)
      assert.strictEqual(user.username, response.body.username)
    })
})

describe('DELETE', () => {

  test('deletes user', async () => {
    const response = await api
      .post('/api/users')
      .send({
        name: 'valaki',
        username: 'valaki',
        password: 'admin'
      })

    const usersAtStart = await helper.usersInDb()

    await api
      .delete(`/api/users/${response.body.id}`)
      .expect(204)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length + 1, usersAtStart.length)
  })
})

describe('LOGIN', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    await api.post('/api/users')
      .send({
        name: 'lajos',
        username: 'lajoska',
        password: 'admin'
      })
  })

  test('responds witha a valid token', async () => {
    const user = await User.findOne({username: 'lajoska'})

    const credentials = {
      username: 'lajoska',
      password: 'admin'
    }

    const response = await api
      .post('/api/login')
      .send(credentials)
      .expect(200)
      .expect('Content-type', /application\/json/)
  
    // check if token exist in the response
    const { token } = response.body
    assert(token)

    //check if token is Bearer format

    //decode and verify token
    const decoded = jwt.verify(token, process.env.SECRET)
    assert.strictEqual(decoded.name, 'lajos')
    assert.strictEqual(decoded.username, 'lajoska')
    assert.strictEqual(decoded.id, user._id.toString())
  })

  test('fails with a wrong username or password', async () => {
    const payload1 = {
      username: 'lajoska',
      password: 'adminzz'
    }

    await api
      .post('/api/login')
      .send(payload1)
      .expect(401)

      const payload2 = {
        username: 'lajoskahh',
        password: 'admin'
      }
  
      await api
        .post('/api/login')
        .send(payload2)
        .expect(401)
  })

  test('fails with missing username or password', async () => {
    const payload1 = {
      password: 'adminzz'
    }

    await api
      .post('/api/login')
      .send(payload1)
      .expect(400)

      const payload2 =  {
        username: 'lajoska'
      }

      await api
      .post('/api/login')
      .send(payload2)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
