import { getSecKey } from '@/utils/auth.js'
import { keccak256 } from 'js-sha3'
import secp256k1 from 'secp256k1'

export function sign(obj) {
  var message = buildSignMessage(obj)

  // console.log('message')
  // console.log(message)

  var hashMessage = hash(message)

  // console.log('hashMessage')
  // console.log(hashMessage)

  var secKey = getSecKey()
  var signObj = secp256k1.sign(Buffer.from(hashMessage, 'hex'), Buffer.from(secKey, 'hex'))
  return buildSignBytes(signObj)
}

function buildSignMessage(obj) {
  var signData = {
    args: obj.args ? obj.args : [],
    method: obj.method,
    nonce: obj.nonce,
    path: obj.path,
    sender: obj.sender,
    version: obj.version ? obj.version : '1.0.0'
  }
  var ret = JSON.stringify(signData)
  return ret
}

function hash(message) {
  var ret = keccak256(Uint8Array.from(Buffer.from(message, 'utf8')))
  return ret
}

function buildSignBytes(signObj) {
  // console.log('signObj')
  // console.log(signObj)

  // console.log('signObj.signature')
  // console.log(signObj.signature)

  // var r = signObj.signature.slice(0, 32)
  // var s = signObj.signature.slice(32, 64)
  var v = signObj.recovery + 27

  // console.log('r')
  // console.log(r.toString('hex'))

  // console.log('s')
  // console.log(s.toString('hex'))

  // console.log('v')
  // console.log(v)

  var buff = Buffer.from(v.toString(16), 'hex')
  var ret = Buffer.concat([buff, signObj.signature])

  // console.log('buff')
  // console.log(buff)

  // console.log('ret')
  // console.log(ret)

  return ret.toString('base64')
}
