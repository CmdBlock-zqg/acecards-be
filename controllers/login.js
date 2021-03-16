const axios = require('axios')
const express = require('express')

const { aauth } = require('../config')
const crypto = require('../utils/crypto')

const router = express.Router()

router.post('/', async (req, resp) => {
  if (!req.body.code) {
    resp.status(400).send('参数错误，需要body参数code')
    return
  }
  const user = await axios
    .delete(`https://api.aauth.link/login?app=${aauth.id}&secret=${aauth.secret}&code=${req.body.code}`)
    .then(resp => resp.data)
    .catch(() => false)
  if (!user) {
    resp.status(403).send('登录失败')
    return
  }
  resp.send(crypto.sign([Date.now(), user.id, user.name]))
})

module.exports = router
