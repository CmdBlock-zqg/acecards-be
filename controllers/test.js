const express = require('express')

const router = express.Router()

router.put('/', async (req, resp) => {
  resp.send({
    token: req.get('token'),
    body: req.body
  })
})

module.exports = router
