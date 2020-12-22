import request from '@/utils/request'

/**
 * login
 * @param {string} data - encoded login params
 * @return {Promise<Response>} an axios promise object of response
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
 * register
 * @param {string} data - encoded register params
 * @return {Promise<Response>} an axios promise object of response
 */
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

/**
 * get a auth code for login/register
 * @return {Promise<Response>} an axios promise object of response
 */
export function authCode() {
  return request({
    url: '/auth/authCode',
    method: 'get'
  })
}

/**
 * get a pubKey for login/register
 * @return {Promise<Response>} an axios promise object of response
 */
export function authPub() {
  return request({
    url: '/auth/pub',
    method: 'get'
  })
}
