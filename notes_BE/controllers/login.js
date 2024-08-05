const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body
  
    if(!(username && password)) {
      return res.status(400).json({error: 'missing username or password'})
    }
  
    const user = await User.findOne({username})
    if(!user) {
      return res.status(401).json({error: 'wrong username'})
    }
    const passwordOk = await bcrypt.compare(password, user.passwordHash)

    if(!passwordOk) {
      return res.status(401).json({error: 'wrong password'})
    } 
    
    const data = {
      name: user.name,
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(data, process.env.SECRET)
    res.json({ token, name: user.name, username: user.username})
})


module.exports = loginRouter