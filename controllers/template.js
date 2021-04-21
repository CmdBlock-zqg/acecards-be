const express = require('express')

const model = require('../model')
const crypto = require('../utils/crypto')

const router = express.Router()

router.use(async (req, resp, next) => {
  const user = crypto.verify(req.get('token'))
  if (user === false) {
    resp.status(401).send('请登录后再操作')
  }
  else {
    req.user = decodeURI(user[1])
    next()
  }
})

router.get('/', async (req, resp) => {
  const filter = {
    '$or': [
      { user: req.user },
      { user: '' }
    ]
  }
  const opt = { projection: { cards: 0 } }
  const res = await model('template').find(filter, opt)
  if (res) resp.send(res)
  else resp.status(500).send('系统错误，请向管理员反馈')
})

router.get('/:id', async (req, resp) => {
  const filter = {
    _id: req.params.id,
    '$or': [
      { user: req.user },
      { user: '' }
    ]
  }
  const res = await model('template').find(filter)
  if (!res || !res[0]) {
    resp.status(404).send('模板不存在')
    return
  }
  resp.send(res[0])
})

router.post('/', async(req, resp) => {
  const input = req.body
  if (!input.name || !input.cards || !Array.isArray(cards)) {
    resp.status(400).send('参数错误，需要body参数name, cards')
    return
  }
  const template = {
    _id: crypto.random(),
    name: input.name,
    user: req.user,
    count: input.cards.length,
    cards: input.cards
  }
  if (await model('template').insert(template)) resp.send('新建成功')
  else resp.status(500).send('系统错误，请向管理员反馈')
})

router.put('/:id', async (req, resp) => {
  const input = req.body
  const update = {}
  if (input.name) update.name = input.name
  if (input.cards && Array.isArray(input.cards)) {
    update.cards = input.cards
    update.count = input.cards.length
  }
  const filter = { _id: req.params.id, user: req.user }
  const res = await model('template').update(filter, update)
  if (res) resp.send('修改成功')
  else resp.status(404).send('模板不存在')
})

router.delete('/:id', async (req, resp) => {
  const filter = { _id: req.params.id, user: req.user }
  const res = await model('template').delete(filter)
  if (res) resp.send('删除成功')
  else resp.status(404).send('模板不存在')
})

module.exports = router
