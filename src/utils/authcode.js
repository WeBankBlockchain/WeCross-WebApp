import { authCode } from '@/api/user'
import { authPub } from '@/api/user'
import { setPubKey } from '@/utils/auth'
import { Message } from 'element-ui'

/**
 * query server encrypt publicKey
 */
export function queryPub(callback) {
  authPub().then((resp) => {
    if (!resp) {
      Message({
        type: 'error',
        message: 'response is null, check server status.'
      })
      if (
        typeof resp.errorCode !== 'undefined' &&
            resp.errorCode !== null &&
            resp.errorCode !== 0
      ) {
        Message({
          type: 'error',
          message: JSON.stringify(resp)
        })
      }
    } else {
      const pub = resp.data.pub
      setPubKey(pub)
      if (typeof callback !== 'undefined' && callback !== null) {
        callback()
      }
    }
  })
}

/**
 * query auth code
 */
export function queryAuthCode(callback) {
  authCode().then((resp) => {
    if (!resp) {
      Message({
        type: 'error',
        message: 'response is null, check server status.'
      })
      if (
        typeof resp.errorCode !== 'undefined' &&
          resp.errorCode !== null &&
          resp.errorCode !== 0
      ) {
        Message({
          type: 'error',
          message: JSON.stringify(resp)
        })
      }
    } else {
      callback(resp.data.authCode)
    }
  })
}
