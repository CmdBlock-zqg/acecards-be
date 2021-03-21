const express = require('express')

const model = require('../model')

const router = express.Router()

router.get('/template/', async (req, resp) => {
  const filter = { user: '' }
  const opt = { projection: { cards: 0 } }
  const res = await model('template').find(filter, opt)
  if (res) resp.send(res)
  else resp.status(500).send('系统错误，请向管理员反馈')
})

module.exports = router
