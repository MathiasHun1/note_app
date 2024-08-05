const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
require('dotenv')

usersRouter.get('/', async(req, res) => {
  
  try {
    const users = await User.find({}).populate('notes', {user: 0, _id: 0})
    res.json(users)
  }catch (err) {
    console.log('Error fetching users:', err.message);
    res.status(500).json({error: 'cant get users'})
  }
})

usersRouter.get('/:id', async (req, res) => {
  try{
    const user = await User.findById(req.params.id)
    
    if(!user) {
      return res.status(404).json({error: 'no user with this Id'})
    }
  
    res.json(user)
  } catch (err) {
    console.log('Error fetching user:', err.message);
    res.status(500).json({error: 'cant get users'})
  }
})

usersRouter.post('/', async (req, res) => {
  const { name, username, password } = req.body

  if(!(name && username && password)) {
    res.status(400).json({error: 'user, username, password are required'})
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

usersRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    await User.findByIdAndDelete(id)
    res.status(204).end()
  } catch(err) {
    console.log(err);
    res.status(400).json({err: err.message})
  }
})


module.exports = usersRouter