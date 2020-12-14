import request from '@/utils/request'

/**
 * list all chain account of UA
 * @return {Promise<Response>} an axios promise object of response
 */
export function listAccount() {
  return request({
    url: '/auth/listAccount',
    method: 'post',
    data: {}
  })
}

/**
 * set default chain account by keyID
 * @param {Object} data
 * @param {string} data.version
 * @param {Object} data.data - main body data of request
 * @param {string} data.data.type - the chain type
 * @param {number} data.data.keyID
 * @return {Promise<Response>} an axios promise object of response
 */
export function setDefaultAccount(data) {
  return request({
    url: '/auth/setDefaultAccount',
    method: 'post',
    data: data
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
 * @return {Promise<Response>} an axios promise object of response
 */
export function addChainAccount(data) {
  return request({
    url: '/auth/addChainAccount',
    method: 'post',
    data: data
  })
}

/**
 * remove a chain account by keyID
 * @param {Object} data
 * @param {string} data.version
 * @param {Object} data.data - main body data of request
 * @param {string} data.data.type - the chain type
 * @param {number} data.data.keyID
 * @return {Promise<Response>} an axios promise object of response
 */
export function removeChainAccount(data) {
  return request({
    url: '/auth/removeChainAccount',
    method: 'post',
    data: data
  })
}

