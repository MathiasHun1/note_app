const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const tokenExtractor = (req, res, next) => {
  let token
  let auth = req.get('Authorization')
  if(auth && auth.startsWith('Bearer ')) {
    token = auth.replace('Bearer ', '')
    req.token = token
  } else {
    req.token = null
  }
  next()
}

const userExtractor = (req, res, next) => {
  if(!req.token) {
    req.user = null
    return next()
  }

  try {
    const user = jwt.verify(req.token, process.env.SECRET)
      req.user = user
      next()
    } catch (error) {
    req.user = null
    next()
  }
}

const errorHandler = (error, req, res, next) => {
  if(error.name === 'JsonWebTokenError') {
    return res.status(401).json({error: error.name})
  }

  res.status(500).json({error: error.name})
}

module.exports = { tokenExtractor, errorHandler, userExtractor }