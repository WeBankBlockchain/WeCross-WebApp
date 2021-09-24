import {
  getIdentity,
  setIdentity,
  removeIdentity,
  setSecKey,
  removeSecKey
} from '@/utils/auth'
import { resetRouter } from '@/router'
import { listAccount } from '@/api/ua'
import 'intro.js/introjs.css'
import 'intro.js/themes/introjs-modern.css'
import '@/styles/intro.scss'
import store from '@/store'
import { routerStatus } from '@/api/status'

const getDefaultState = () => {
  return {
    name: getIdentity(),
    roles: [],
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ROLE: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, loginParams) {
    const identity = loginParams.identity
    const secKey = loginParams.secKey
    return new Promise((resolve, reject) => {
      commit('SET_NAME', identity)
      setSecKey(secKey)
      setIdentity(identity)
      resolve()
    })
  },
  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      removeIdentity()
      removeSecKey()
      store.dispatch('permission/resetRoutes').then(_ => {
        resetRouter()
        commit('RESET_STATE')
        resolve()
      })
    })
  },

  // remove token
  resetSecKey({ commit }) {
    return new Promise(resolve => {
      removeIdentity()
      removeSecKey()
      commit('RESET_STATE')
      resolve()
    })
  },
  getRole({ commit }) {
    return new Promise(resolve => {
      let role = []
      routerStatus().then(statusRes => {
        if (!statusRes.data) {
          this.$message.error('路由信息返回为空，请检查后台信息')
          resolve(['user'])
        } else {
          if (!statusRes.data.enableAccessControl || statusRes.data.enableAccessControl === false) {
            resolve(['user'])
          } else if (statusRes.data.enableAccessControl === true) {
            listAccount().then(res => {
              role = res.data.admin === true ? ['admin'] : ['user']
              commit('SET_ROLE', role)
              resolve(role)
            })
          }
        }
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

