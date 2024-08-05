const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const app = require('./app')


console.log('Connecting to server..')

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`)
})