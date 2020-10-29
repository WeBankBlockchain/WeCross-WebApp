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

export function logout(data) {
  return request({
    url: '/auth/logout',
    method: 'post',
    data: data
  })
}

export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    params: data
  })
}
