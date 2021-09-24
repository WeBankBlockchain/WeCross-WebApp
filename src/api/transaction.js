import request from '@/utils/request'
import { path2Url } from '@/utils'
import { getIdentity } from '@/utils/auth'

/**
 * start a XA transaction
 * @param {xaRequest} data - body data to request
 * @return {Promise<xaResponse>} an axios promise object of response
 */
export function startXATransaction(data) {
  return request({
    url: '/xa/startXATransaction',
    method: 'post',
    data: data
  })
}

/**
 * commit a XA transaction
 * @param {xaRequest} data - body data to request
 * @return {Promise<xaResponse>} an axios promise object of response
 */
export function commitXATransaction(data) {
  return request({
    url: '/xa/commitXATransaction',
    method: 'post',
    data: data
  })
}

/**
 * rollback a XA transaction
 * @param {xaRequest} data - body data to request
 * @return {Promise<xaResponse>} an axios promise object of response
 */
export function rollbackXATransaction(data) {
  return request({
    url: '/xa/rollbackXATransaction',
    method: 'post',
    data: data
  })
}

/**
 * get a XA transaction's info
 * @param {xaRequest|*} data - body data to request
 * @return {Promise<xaListResponse>} an axios promise object of response
 */
export function getXATransaction(data) {
  return request({
    url: '/xa/getXATransaction',
    method: 'post',
    data: data
  })
}

/**
 * get a XA transaction's info
 * @param {Object} data - body data to request
 * @param {string} data.version
 * @param {number} data.data.size
 * @param {Map|*} data.data.offsets - path => number
 * @return {Promise<xaListResponse>} an axios promise object of response
 */
export function listXATransactions(data) {
  return request({
    url: '/xa/listXATransactions',
    method: 'post',
    data: data
  })
}

/**
 * call a contract status
 * @param {CallRequest} data
 * @return {Promise<Response>} an axios promise object of response
 */
export function call(data) {
  var req = data
  req.data.sender = getIdentity()
  if (!req.data.nonce) {
    req.data.nonce = Math.round(Math.random() * 1000000000)
  }
  // TODO: sig the data
  return request({
    url: 'resource' + path2Url(data.data.path) + '/call',
    method: 'post',
    data: data
  })
}

/**
 * send a contract transaction
 * @param {CallRequest} data
 * @return {Promise<Response>} an axios promise object of response
 */
export function sendTransaction(data) {
  var req = data
  req.data.sender = getIdentity()
  if (!req.data.nonce) {
    req.data.nonce = Math.round(Math.random() * 1000000000)
  }
  return request({
    url: 'resource' + path2Url(data.data.path) + '/sendTransaction',
    method: 'post',
    data: req
  })
}

/**
 * list transactions of path
 * @param {Object} params
 * @param {string} params.path
 * @param {number} params.blockNumber
 * @param {number} params.offset
 * @param {number} params.size
 * @return {Promise<Response>} an axios promise object of response
 */
export function listTransactions(params) {
  return request({
    url: '/trans/listTransactions',
    method: 'get',
    params: params
  })
}

/**
 * get a exact transaction's info by hash
 * @param {Object} params
 * @param {string} params.path
 * @param {string} params.txHash
 * @return {Promise<Response>} an axios promise object of response
 */
export function getTransaction(params) {
  return request({
    url: '/trans/getTransaction',
    method: 'get',
    params: params
  })
}
