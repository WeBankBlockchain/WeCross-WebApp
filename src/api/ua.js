import request from '@/utils/request'

/**
 * list all chain account of UA
 * @return {Promise} an axios promise object of response
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
 * @return {Promise} an axios promise object of response
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
 * @return {Promise} an axios promise object of response
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
 * @return {Promise} an axios promise object of response
 */
export function removeChainAccount(data) {
  return request({
    url: '/auth/removeChainAccount',
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
