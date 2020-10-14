import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/s/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/s/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/s/user/logout',
    method: 'post'
  })
}
