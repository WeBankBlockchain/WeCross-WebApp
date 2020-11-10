import { commitXATransaction, startXATransaction, rollbackXATransaction } from '@/api/transaction'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    transactionID: null,
    paths: []
  }
}
const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TRANSACTION: (state, transaction) => {
    state.transactionID = transaction.transactionID
    state.paths = transaction.paths
  }
}

const actions = {
  startTransaction({ commit }, transaction) {
    return new Promise((resolve, reject) => {
      startXATransaction(transaction).then(response => {
        if (response.errorCode !== 0 || response.data.status !== 0) {
          Message.error({ message: '开启事务失败，错误：' + JSON.stringify(response.data, null, 4) || response.message, center: true, duration: 5000 })
          reject()
        } else {
          commit('SET_TRANSACTION', { transactionID: transaction.data.xaTransactionID, paths: transaction.data.paths })
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  commitTransaction({ commit }, transaction) {
    return new Promise((resolve, reject) => {
      commitXATransaction(transaction).then(response => {
        if (response.data.status !== 0) {
          Message.error({ message: '提交事务失败，错误：' + JSON.stringify(response.data, null, 4) || response.message, center: true, duration: 5000 })
          reject()
        } else {
          commit('RESET_STATE')
          resolve()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  rollbackTransaction({ commit }, transaction) {
    return new Promise((resolve, reject) => {
      rollbackXATransaction(transaction).then(response => {
        if (response.errorCode !== 0 || response.data.status !== 0) {
          Message.error({ message: '回滚事务失败，错误：' + JSON.stringify(response.data, null, 4) || response.message, center: true, duration: 5000 })
          reject()
        } else {
          commit('RESET_STATE')
          resolve()
        }
      }).catch(error => {
        reject(error)
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
