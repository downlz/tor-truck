const fs = require('fs')
const path = require('path')
const config = require('../config/config')

fs
  .readdirSync(__dirname)
  .filter((file) =>
    file !=  'index.js'
  )
    .forEach((file)) => {

    })
