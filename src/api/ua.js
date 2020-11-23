import request from '@/utils/request'

export function listAccount() {
  return request({
    url: '/auth/listAccount',
    method: 'post',
    data: {}
  })
}

export function setDefaultAccount(data) {
  return request({
    url: '/auth/setDefaultAccount',
    method: 'post',
    data: data
  })
}

export function addChainAccount(data) {
  return request({
    url: '/auth/addChainAccount',
    method: 'post',
    data: data
  })
}

export function removeChainAccount(data) {
  return request({
    url: '/auth/removeChainAccount',
    method: 'post',
    data: data
  })
}

