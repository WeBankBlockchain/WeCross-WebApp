import request from '@/utils/request'

/**
 * list peer routers
 * @param {Object|null} params - params to request: {offset,size}
 * @param {number} params.offset - the query page offset
 * @param {number} params.size - the page size of query
 * @return {Promise<Response>} an axios promise object of response
 */
export function listPeers(params) {
  return request({
    url: '/conn/listPeers',
    method: 'get',
    params: params
  })
}

/**
 * add peer router
 * @param {Object} data - body data to request: {version, data:{address}}
 * @return {Promise<Response>} an axios promise object of response
 */
export function addPeer(data) {
  return request({
    url: '/conn/addPeer',
    method: 'post',
    data: data
  })
}

/**
 * remove peer router
 * @param {Object} data - body data to request: {version, data:{address}}
 * @return {Promise<Response>} an axios promise object of response
 */
export function removePeer(data) {
  return request({
    url: '/conn/removePeer',
    method: 'post',
    data: data
  })
}

/**
 * get a list of chains in network
 * @param {Object} params - params to request: {zone,offset,size}, if offset & size is null then return all list
 * @param {string} params.zone - the zone which chains on
 * @param {number|null} params.offset - the query page offset
 * @param {number|null} params.size - the page size of query
 * @return {Promise<Response>} an axios promise object of response
 */
export function listChains(params) {
  return request({
    url: '/conn/listChains',
    method: 'get',
    params: params
  })
}

/**
 * get a list of zones in network
 * @param {Object|null} params - params to request: {offset,size}, if params is null then return all list
 * @param {number} params.offset - the query page offset
 * @param {number} params.size - the page size of query
 * @return {Promise<Response>} an axios promise object of response
 */
export function listZones(params) {
  return request({
    url: '/conn/listZones',
    method: 'get',
    params: params
  })
}
