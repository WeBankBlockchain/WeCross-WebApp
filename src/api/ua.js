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

