const Note = require('./models/note')
const User = require('./models/user')
const mongoose = require('mongoose')
const { generateUsersAndNotes } = require('./tests/test_helper')
require('dotenv').config()

const main1 = async () => {
  console.log('connecting to db')

  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('connected to db')
    
    await Note.deleteMany({})
    await User.deleteMany({})

    await mongoose.connection.close()

  } catch (error) {
    console.log('failed connection to db')
  }
}

const main2 = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('connected to db')
    
    await Note.deleteMany({})
    await User.deleteMany({})
    await generateUsersAndNotes()

    await mongoose.connection.close()

  } catch (error) {
    console.log({error: error})
  }
}



main1()