const user = require('./user')
const resource = require('./resource')
const conn = require('./conn')
const ua = require('./ua')
const transaction = require('./transaction')
const status = require('./status')

const mocks = [
  ...user,
  ...resource,
  ...conn,
  ...ua,
  ...transaction,
  ...status
]

module.exports = {
  mocks
}

