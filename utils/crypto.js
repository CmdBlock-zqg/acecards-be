const crypto = require('crypto')
const { salt } = require('../config')

exports.random = () => Math.random().toString(36).substr(2)

exports.sign = (data) => {
  const h = crypto.createHmac('sha256', salt)
  for (const d of data) h.update(String(d))
  return data.join('.') + '.' + h.digest('base64')
}

// timestamp first verify
exports.verify = (t, expire = 315576000) => {
  if (!t) return false
  const r = t.split('.')
  if (r.length < 2 || r[0] < Date.now() - expire) return false
  const h = crypto.createHmac('sha256', salt)
  for (let i = 0; i < r.length - 1; i++) h.update(r[i])
  if (r[r.length - 1] != h.digest('base64')) return false
  return r
}
