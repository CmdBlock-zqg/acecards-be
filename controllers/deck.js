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
  const filter = { user: req.user }
  const opt = { projection: { cards: 0, record: 0 } }
  const res = await model('deck').find(filter, opt)
  if (res) resp.send(res)
  else resp.status(500).send('系统错误，请向管理员反馈')
})

router.get('/:id', async (req, resp) => {
  const filter = { _id: req.params.id, user: req.user }
  const res = await model('deck').find(filter)
  if (!res || !res[0]) {
    resp.status(404).send('卡组不存在')
    return
  }
  resp.send(res[0])
})

router.post('/', async(req, resp) => {
  const input = req.body
  if (!input.name || !input.template || input.ordered === undefined) {
    resp.status(400).send('参数错误，需要body参数name, template, ordered')
    return
  }
  const filter = {
    _id: input.template,
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
  const deck = {
    _id: crypto.random(),
    name: input.name,
    user: req.user,
    total: res[0].count,
    process: 0,
    cards: input.ordered ? res[0].cards : res[0].cards.sort(() => 0.5 - Math.random()),
    record: []
  }
  if (await model('deck').insert(deck)) resp.send('新建成功')
  else resp.status(500).send('系统错误，请向管理员反馈')
})

router.put('/:id', async (req, resp) => {
  const input = req.body
  const update = {}
  if (input.name) update.name = input.name
  if (input.cards && Array.isArray(input.cards)) {
    update.cards = input.cards
    update.total = input.cards.length
  }
  if (input.record && Array.isArray(input.record)) {
    update.record = input.record
    update.process = input.record.length
  }
  const filter = { _id: req.params.id, user: req.user }
  const res = await model('deck').update(filter, update)
  if (res) resp.send('修改成功')
  else resp.status(404).send('卡组不存在')
})

router.delete('/:id', async (req, resp) => {
  const filter = { _id: req.params.id, user: req.user }
  const res = await model('deck').delete(filter)
  if (res) resp.send('删除成功')
  else resp.status(404).send('卡组不存在')
})

module.exports = router
