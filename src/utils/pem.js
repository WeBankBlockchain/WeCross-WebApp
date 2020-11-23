import { ec as EC } from 'elliptic'
import { keccak256 } from 'js-sha3'
import { sm2 as SM2 } from 'sm-crypto'
import { sm3Hex } from '@/utils/sm3.js'

const CERT_PATTERN =
        '-+BEGIN\\s+.*CERTIFICATE[^-]*-+(?:\\s|\\r|\\n)+' + // Header
                '([A-Za-z0-9+/=\\r\\n]+)' + // Base64 text
                '-+END\\s+.*CERTIFICATE[^-]*-+' // Footer

const SEC_KEY_PATTERN =
        '-+BEGIN\\s+.*PRIVATE\\s+KEY[^-]*-+(?:\\s|\\r|\\n)+' + // Header
                '([A-Za-z0-9+/=\\r\\n]+)' + // Base64 text
                '-+END\\s+.*PRIVATE\\s+KEY[^-]*-+' // Footer
const PUB_KEY_PATTERN =
        '-+BEGIN\\s+.*PUBLIC\\s+KEY[^-]*-+(?:\\s|\\r|\\n)+' + // Header
                '([A-Za-z0-9+/=\\r\\n]+)' + // Base64 text
    '-+END\\s+.*PUBLIC\\s+KEY[^-]*-+' // Footer

export const pem = {
  isCertFormat(content) {
    return content.search(CERT_PATTERN) !== -1
  },

  isSecKeyFormat(content) {
    return content.search(SEC_KEY_PATTERN) !== -1
  },

  isPubKeyFormat(content) {
    return content.search(PUB_KEY_PATTERN) !== -1
  }
}

// ECDSA

const ecdsaSecPemPrefix = '308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420'
const ecdsaPubPemPrefix = '3056301006072a8648ce3d020106052b8104000a034200'

function getPubKeyHexFromECDSASecPem(secKeyContent) {
  var base64Content = secKeyContent.replace('\n', '').replace('-----BEGIN PRIVATE KEY-----', '')

  var buffer = Buffer.from(base64Content, 'base64')
  var hexString = buffer.toString('hex')
  var pubKeyHex = hexString.substr(140, 130)
  console.log('pubCertHex: ', hexString)
  console.log('pubKeyHex: ', pubKeyHex)
  return pubKeyHex
}

function buildECDSAPubKeyPem(pubKeyHex) {
  var asn1HexString = ecdsaPubPemPrefix + pubKeyHex
  var base64String = Buffer.from(asn1HexString, 'hex').toString('base64')

  return '-----BEGIN PUBLIC KEY-----\n' + base64String + '\n-----END PUBLIC KEY-----\n'
}

function ecdsaPub2Addr(pubKeyHex) {
  var pubKeyHexWithoutPrefix = pubKeyHex.substr(2, 128) // No prefix 04
  var address = '0x' + keccak256(Uint8Array.from(Buffer.from(pubKeyHexWithoutPrefix, 'hex'))).substr(24, 40)
  return address
}

export const ecdsa = {
  generateSecPem() {
    const secp256k1 = new EC('secp256k1')
    var keyPair = secp256k1.genKeyPair()

    var pubKey = keyPair.getPublic('hex')
    var secKey = keyPair.getPrivate('hex')

    console.log(pubKey)
    console.log(secKey)

    var asn1HexString = ecdsaSecPemPrefix + secKey + 'a144034200' + pubKey
    var base64String = Buffer.from(asn1HexString, 'hex').toString('base64')

    return '-----BEGIN PRIVATE KEY-----\n' + base64String + '\n-----END PRIVATE KEY-----\n'
  },
  isSecPem(secPem) {
    if (!pem.isSecKeyFormat(secPem)) {
      return false
    }

    var base64Content = secPem.replace('\n', '').replace('-----BEGIN PRIVATE KEY-----', '')

    var buffer = Buffer.from(base64Content, 'base64')
    var hexString = buffer.toString('hex')

    return hexString.includes(ecdsaSecPemPrefix)
  },
  build(secPem) {
    var pubKeyHex = getPubKeyHexFromECDSASecPem(secPem)

    return {
      secPem: secPem,
      pubPem: buildECDSAPubKeyPem(pubKeyHex),
      address: ecdsaPub2Addr(pubKeyHex)
    }
  }
}

// SM2

const sm2SecPemPrefix = '308187020100301306072a8648ce3d020106082a811ccf5501822d046d306b0201010420'
const sm2PubPemPrefix = '3059301306072a8648ce3d020106082a811ccf5501822d034200'

function getPubKeyHexFromSM2SecPem(secKeyContent) {
  var base64Content = secKeyContent.replace('\n', '').replace('-----BEGIN PRIVATE KEY-----', '')

  var buffer = Buffer.from(base64Content, 'base64')
  var hexString = buffer.toString('hex')
  var pubKeyHex = hexString.substr(146, 130)
  console.log('pubCertHex: ', hexString)
  console.log('pubKeyHex: ', pubKeyHex)
  return pubKeyHex
}

function buildSM2PubKeyPem(pubKeyHex) {
  var asn1HexString = sm2PubPemPrefix + pubKeyHex
  var base64String = Buffer.from(asn1HexString, 'hex').toString('base64')

  return '-----BEGIN PUBLIC KEY-----\n' + base64String + '\n-----END PUBLIC KEY-----\n'
}

function sm2Pub2Addr(pubKeyHex) {
  var pubKeyHexWithoutPrefix = pubKeyHex.substr(2, 128)

  console.log('pubKeyHexWithoutPrefix: ', pubKeyHexWithoutPrefix)

  var address = '0x' + sm3Hex(pubKeyHexWithoutPrefix).substr(24, 40)
  return address
}

export const sm2 = {
  generateSecPem() {
    const keyPair = SM2.generateKeyPairHex()

    console.log(keyPair)

    var asn1HexString = sm2SecPemPrefix + keyPair.privateKey + 'a144034200' + keyPair.publicKey
    var base64String = Buffer.from(asn1HexString, 'hex').toString('base64')

    return '-----BEGIN PRIVATE KEY-----\n' + base64String + '\n-----END PRIVATE KEY-----\n'
  },
  isSecPem(secPem) {
    if (!pem.isSecKeyFormat(secPem)) {
      return false
    }

    var base64Content = secPem.replace('\n', '').replace('-----BEGIN PRIVATE KEY-----', '')

    var buffer = Buffer.from(base64Content, 'base64')
    var hexString = buffer.toString('hex')

    return hexString.includes(sm2SecPemPrefix)
  },
  build(secPem) {
    var pubKeyHex = getPubKeyHexFromSM2SecPem(secPem)

    return {
      secPem: secPem,
      pubPem: buildSM2PubKeyPem(pubKeyHex),
      address: sm2Pub2Addr(pubKeyHex)
    }
  }

}
