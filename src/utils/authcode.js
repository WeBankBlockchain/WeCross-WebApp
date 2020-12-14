import { authCode } from '@/api/user'
import { authPub } from '@/api/user'
import { setPubKey } from '@/utils/auth'

/**
 * query server encrypt publicKey
 */
export function queryPub(callback) {
  authPub().then((resp) => {
    if (
      typeof resp.errorCode !== 'undefined' &&
            resp.errorCode !== null &&
            resp.errorCode !== 0
    ) {
      this.$message({
        type: 'error',
        message: JSON.stringify(resp)
      })
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
    if (typeof resp.errorCode !== 'undefined' && resp.errorCode !== 0) {
      this.$message({
        type: 'error',
        message: JSON.stringify(resp)
      })
    } else {
      callback(resp.data.authCode)
    }
  })
}
