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
    params: data
  })
}
