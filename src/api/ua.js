import request from '@/utils/request'
import { getIdentity } from '@/utils/auth'
import { sign } from '@/utils/sign'
import { getSecKeyHexFromECDSASecPem, getPubKeyHexFromECDSASecPem, getSecKeyHexFromSM2SecPem, getPubKeyHexFromSM2SecPem, getSecKeyHexFromECDSAR1SecPem, getPubKeyHexFromECDSAR1Cert } from '@/utils/pem'

/**
 * list all chain account belongs to this logged in cross chain account
 * @return {Promise} an axios promise object of response
 */
export function listAccount() {
  var accountIdentity = getIdentity()
  return request({
    url: '/auth/listAccount',
    method: 'post',
    data: {
      version: '1.0.0',
      data: {
        luyuSign: null,
        signData: {
          sender: accountIdentity
        }
      }
    }
  })
}

/**
 * set default chain account by keyID
 * @param {Object} data
 * @param {string} data.version
 * @param {Object} data.data - main body data of request
 * @param {string} data.data.type - the chain type
 * @param {number} data.data.keyID
 * @return {Promise} an axios promise object of response
 */
export function setDefaultAccount(data) {
  var req = data
  req.data.sender = getIdentity()
  req.data.identity = getIdentity()
  if (!req.data.nonce) {
    req.data.nonce = Math.round(Math.random() * 1000000000)
  }

  // sign the data
  req.data.luyuSign = sign(data.data)

  return request({
    url: '/auth/setDefaultAlgAccount',
    method: 'post',
    data: req
  })
}

/**
 * add a chain account to UA
 * @param {Object} data
 * @param {string} data.version
 * @param {Object} data.data - main body data of request
 * @param {string} data.data.type - the chain type
 * @param {string} data.data.pubKey
 * @param {string} data.data.secKey
 * @param {string} data.data.ext
 * @param {boolean} data.data.isDefault
 * @return {Promise} an axios promise object of response
 */
export function addAlgAccount(data) {
  var req = data
  req.data = buildAddAlgAccountRequest(data.data)
  req.data.sender = getIdentity()
  req.data.identity = getIdentity()
  if (!req.data.nonce) {
    req.data.nonce = Math.round(Math.random() * 1000000000)
  }

  // sign the data
  req.data.luyuSign = sign(data.data)

  return request({
    url: '/auth/addAlgAccount',
    method: 'post',
    data: data
  })
}

/**
    case 'SM2_WITH_SM3' : return data
    case 'ECDSA_SECP256K1_WITH_SHA256': return data
    case 'ECDSA_SECP256R1_WITH_SHA256': return buildR1Request(data)
 */

export function buildAddAlgAccountRequest(data) {
  switch (data.type) {
    case 'BCOS2.0' : return buildBCOS2Request(data)
    case 'GM_BCOS2.0': return buildGMBCOS2Request(data)
    case 'Fabric1.4': return buildFabricRequest(data)
    default : return data
  }
}

function buildBCOS2Request(data) {
  return {
    pubKey: hex2Base64(getPubKeyHexFromECDSASecPem(data.secKey).substr(2, 128)),
    secKey: hex2Base64(getSecKeyHexFromECDSASecPem(data.secKey)),
    type: 'ECDSA_SECP256K1_WITH_SHA256',
    isDefault: data.isDefault,
    properties: {}
  }
}

function buildGMBCOS2Request(data) {
  return {
    pubKey: hex2Base64(getPubKeyHexFromSM2SecPem(data.secKey).substr(2, 128)),
    secKey: hex2Base64(getSecKeyHexFromSM2SecPem(data.secKey)),
    type: 'SM2_WITH_SM3',
    isDefault: data.isDefault,
    properties: {}
  }
}

function buildFabricRequest(data) {
  return {
    pubKey: hex2Base64(getPubKeyHexFromECDSAR1Cert(data.pubKey)),
    secKey: hex2Base64(getSecKeyHexFromECDSAR1SecPem(data.secKey)),
    type: 'ECDSA_SECP256R1_WITH_SHA256',
    isDefault: data.isDefault,
    properties: JSON.parse(
      '{' +
      buildJsonKVPairString('Fabric1.4:' + data.ext2 + ':cert', data.pubKey.replaceAll('\n', '\\n')) + ',' +
      buildJsonKVPairString('Fabric1.4:' + data.ext2 + ':name', 'name') + ',' +
      buildJsonKVPairString('Fabric1.4:' + data.ext2 + ':mspid', data.ext) +
      '}')
  }
}

function buildJsonKVPairString(key, value) {
  return '\"' + key + '\":' + '\"' + value + '\"'
}

function hex2Base64(hexStr) {
  var buffer = Buffer.from(hexStr, 'hex')
  var base64Str = buffer.toString('base64')
  return base64Str
}

/**
 * remove a chain account by keyID
 * @param {Object} data
 * @param {string} data.version
 * @param {Object} data.data - main body data of request
 * @param {string} data.data.type - the chain type
 * @param {number} data.data.keyID
 * @return {Promise} an axios promise object of response
 */
export function removeAlgAccount(data) {
  return request({
    url: '/auth/removeAlgAccount',
    method: 'post',
    data: data
  })
}

/**
 * get all access chain of username
 * @param {Object|null} params param include username, if null get all user
 * @param {String} params.username username
 * @return {Promise} an axios promise object of response
 */
export function accessControlListGet(params) {
  return request({
    url: '/auth/admin/accessControlList',
    method: 'get',
    params: params
  })
}

/**
 * post access chain of username
 * @param {Object} params param include username, if null get all user
 * @param {String} params.username username
 * @param {Object} data
 * @param {String} data.version
 * @param {Object} data.data
 * @param {Array[String]} data.data.allowChainPaths
 * @return {Promise} an axios promise object of response
 */
export function accessControlListPost(params, data) {
  return request({
    url: '/auth/admin/accessControlList',
    method: 'post',
    params: params,
    data: data
  })
}
