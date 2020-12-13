import request from '@/utils/request'
import { path2Url } from '@/utils'

/**
 * get a list of resources
 * @param {Object|null} params - params to request
 * @param {string|null} params.path - the path which resources on
 * @param {number} params.offset - the query page offset
 * @param {number} params.size - the page size of query
 * @param {Object} data - Body data to request: {version, data:{ignoreRemote}}
 * @return {Promise<resourceResponse>} an axios promise object of response
 */
export function getResourceList(params, data) {
  return request({
    url: '/sys/listResources',
    method: 'post',
    params: params,
    data: data
  })
}

/**
 * deploy a BCOS contract
 * @param {CustomRequest|*} data - body data to request
 * @return {Promise<Response>} an axios promise object of response
 */
export function bcosDeploy(data) {
  return request({
    url: 'resource' + path2Url(data.path) + '/customCommand',
    method: 'post',
    data: data
  })
}

/**
 * register a BCOS contract
 * @param {CustomRequest|*} data - body data to request
 * @return {Promise<Response>} an axios promise object of response
 */
export function bcosRegister(data) {
  return request({
    url: 'resource' + path2Url(data.path) + '/customCommand',
    method: 'post',
    data: data
  })
}

/**
 * install a Fabric chaincode
 * @param {CustomRequest|*} data - body data to request
 * @return {Promise<Response>} an axios promise object of response
 */
export function fabricInstall(data) {
  return request({
    url: 'resource' + path2Url(data.path) + '/customCommand',
    method: 'post',
    data: data
  })
}

/**
 * instantiate a Fabric chaincode
 * @param {CustomRequest|*} data - body data to request
 * @return {Promise<Response>} an axios promise object of response
 */
export function fabricInstantiate(data) {
  return request({
    url: 'resource' + path2Url(data.path) + '/customCommand',
    method: 'post',
    data: data
  })
}

/**
 * upgrade a Fabric chaincode
 * @param {CustomRequest|*} data - body data to request
 * @return {Promise<Response>} an axios promise object of response
 */
export function fabricUpgrade(data) {
  return request({
    url: 'resource' + path2Url(data.path) + '/customCommand',
    method: 'post',
    data: data
  })
}
