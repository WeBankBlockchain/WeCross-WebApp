import request from '@/utils/request'

/**
 * login
 * @param {string} data - encoded login params
 * @return {Promise} an axios promise object of response
 */
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

/**
 * logout
 * @return {Promise<Response>} an axios promise object of response
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
    data: {}
  })
}

/**
 * changePassword
 * @param {string} data - encoded changePassword params
 * @return {Promise<Response>} an axios promise object of response
 */
export function changePassword(data) {
  return request({
    url: '/auth/changePassword',
    method: 'post',
    data: {
      version: '1',
      data: data
    }
  })
}
