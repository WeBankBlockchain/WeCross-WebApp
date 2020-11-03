import request from '@/utils/request'

export function listPeers(params) {
  return request({
    url: '/conn/listPeers',
    method: 'get',
    params
  })
}

export function addPeer(params) {
  return request({
    url: '/conn/addPeer',
    method: 'post',
    data: params
  })
}

export function removePeer(params) {
  return request({
    url: '/conn/removePeer',
    method: 'post',
    data: params
  })
}

export function listChains(params) {
  return request({
    url: '/conn/listChains',
    method: 'get',
    params
  })
}
