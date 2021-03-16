const express = require('express')

const app = express()
app.use(express.json())
app.disable('x-powered-by')

let api = express.Router()
app.use('/api', api)

api.use('/login', require('./controllers/login.js'))

api.use('/deck', require('./controllers/deck.js'))
api.use('/template', require('./controllers/template.js'))

app.listen(3001, () => {
  console.log('# API server started!')
})
