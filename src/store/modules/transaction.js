import { commitXATransaction, startXATransaction, rollbackXATransaction } from '@/api/transaction'
import { MessageBox } from 'element-ui'
import { getXATX, removeXATX, setXATX, buildXAError } from '@/utils/transaction'

const getDefaultState = () => {
  return {
    transactionID: getXATX() ? getXATX().transactionID : null,
    paths: getXATX() ? getXATX().paths : []
  }
}
const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    removeXATX()
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
          const errMessage = buildXAError(response)
          MessageBox.alert('开启事务失败，错误：' + errMessage, '错误', {
            confirmButtonText: '确定',
            type: 'error'
          }).then(_ => {})
          reject()
        } else {
          commit('SET_TRANSACTION', { transactionID: transaction.data.xaTransactionID, paths: transaction.data.paths })
          setXATX(JSON.stringify({ transactionID: transaction.data.xaTransactionID, paths: transaction.data.paths }))
          resolve()
        }
      }).catch(error => {
        MessageBox.alert('开启事务失败，错误：' + error, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        }).then(_ => {})
        reject(error)
      })
    })
  },
  commitTransaction({ commit }, transaction) {
    return new Promise((resolve, reject) => {
      commitXATransaction(transaction).then(response => {
        if (response.errorCode !== 0 || response.data.status !== 0) {
          const errMessage = buildXAError(response)
          MessageBox.alert('提交事务失败，错误：' + errMessage, '错误', {
            confirmButtonText: '确定',
            type: 'error'
          }).then(_ => {
            if (/(committed|rolledback)/.test(errMessage)) {
              commit('RESET_STATE')
              removeXATX()
            }
          })
          reject(errMessage)
        } else {
          commit('RESET_STATE')
          removeXATX()
          resolve()
        }
      }).catch(error => {
        MessageBox.alert('提交事务失败，错误：' + error, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        }).then(_ => {})
        reject(error)
      })
    })
  },
  rollbackTransaction({ commit }, transaction) {
    return new Promise((resolve, reject) => {
      rollbackXATransaction(transaction).then(response => {
        if (response.errorCode !== 0 || response.data.status !== 0) {
          const errMessage = buildXAError(response)
          MessageBox.alert('回滚事务失败，错误：' + errMessage, '错误', {
            confirmButtonText: '确定',
            type: 'error'
          }).then(_ => {
            if (/(committed|rolledback)$/.test(errMessage)) {
              commit('RESET_STATE')
              removeXATX()
            }
          })
          reject(errMessage)
        } else {
          commit('RESET_STATE')
          removeXATX()
          resolve()
        }
      }).catch(error => {
        MessageBox.alert('回滚事务失败，错误：' + error, '错误', {
          confirmButtonText: '确定',
          type: 'error'
        }).then(_ => {})
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
