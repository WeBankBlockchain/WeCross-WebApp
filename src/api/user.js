import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: {
      version: '1',
      data: data
    }
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
    data: {}
  })
}

export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data: {
      version: '1',
      data: data
    }
  })
}

export function authCode(data) {
  return request({
    url: '/auth/authCode',
    method: 'get'
  })
}

export function authPub(data) {
  return request({
    url: '/auth/pub',
    method: 'get'
  })
}
