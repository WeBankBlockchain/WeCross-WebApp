import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken, removePubKey, setUsername, removeUsername, getUsername } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

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
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        if (response.data.errorCode !== 0) {
          resolve()
          Message.error({ message: '登录失败，请检查账号密码的正确性', center: true })
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

