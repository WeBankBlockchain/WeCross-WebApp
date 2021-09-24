import { authCode } from '@/api/user'
import { Message } from 'element-ui'

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
