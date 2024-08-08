const regRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const bcrypt = require('bcrypt')

regRouter.post('/', async (req, res) => {
  const { name, username, password, confirmPassword } = req.body

  if(!(name && username && password)) {
    return res.status(400).json({error: 'user, username, password are required'})
  }

  if(password !== confirmPassword) {
    return res.status(400).json({error: 'passwords must be the same'})
  }

  try{
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({name, username, passwordHash})

    const result = await newUser.save()
    res.status(201).json(result)
  } catch(err) {
    console.log('ERROR: ', err.message)
    res.status(400).json({error: err.message})
  }
})

module.exports = regRouter
