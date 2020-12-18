import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken, getPubKey, removePubKey, setUsername, removeUsername, getUsername } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'
import { rsa_encode } from '@/utils/rsa'
import { ErrorCode } from '@/utils/errorcode'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: getUsername(),
    avatar: 'https://wecross.readthedocs.io/zh_CN/latest/_static/images/menu_logo_wecross.svg'
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  }
}

const actions = {
  // user login
  login({ commit }, loginParams) {
    const { username, callback } = loginParams
    return new Promise((resolve, reject) => {
      // rsa encode parameters
      var pub = getPubKey()
      // var params = { username: username.trim(), password: password }
      var encoded = rsa_encode(JSON.stringify(loginParams), pub)

      login(encoded).then(response => {
        if (response.data.errorCode !== 0) {
          var errorCode = response.data.errorCode
          if (
            typeof errorCode !== 'undefined' &&
            errorCode === ErrorCode.InvalidParameters
          ) {
            Message.error({ message: '无效的参数请求', center: true })
          } else if (
            typeof errorCode !== 'undefined' &&
            errorCode === ErrorCode.UAAccountNotExist
          ) {
            Message.error({ message: '账户或者密码错误', center: true })
          } else if (
            typeof errorCode !== 'undefined' &&
            errorCode === ErrorCode.ImageAuthTokenExpired
          ) {
            Message.error({ message: '验证码过期，请刷新验证码', center: true })
          } else if (
            typeof errorCode !== 'undefined' &&
            (errorCode === ErrorCode.ImageAuthTokenNotExist ||
              errorCode === ErrorCode.ImageAuthTokenNotMatch)
          ) {
            Message.error({ message: '验证码错误，请刷新验证码', center: true })
          } else if (
            typeof errorCode !== 'undefined' &&
            (errorCode === ErrorCode.AccountOrPasswordIncorrect)
          ) {
            Message.error({ message: '登录失败，账户或者密码错误', center: true })
          } else if (
            typeof errorCode !== 'undefined' &&
            errorCode === ErrorCode.UndefinedError
          ) {
            Message.error({ message: '未定义的错误', center: true })
          } else {
            Message.error({ message: '未识别的错误', center: true })
          }

          resolve()
          if (typeof callback === 'function' && callback !== null) {
            callback(response.data)
          }
        } else {
          commit('SET_TOKEN', response.data.credential)
          commit('SET_NAME', username)
          setToken(response.data.credential)
          setUsername(username)
          resolve()
        }
      }).catch(error => {
        Message({
          type: 'error',
          message: '登录失败，网络异常'
        })
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removePubKey()
        removeToken()
        removeUsername()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        removeToken()
        removeUsername()
        resetRouter()
        commit('RESET_STATE')
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeUsername()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

