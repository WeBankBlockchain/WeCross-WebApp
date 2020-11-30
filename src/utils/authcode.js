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
      console.log('queryPub: ' + pub)
      setPubKey(pub)
    }
  })
}

/**
 * query auth code
 */
export function queryAuthCode(callback) {
  authCode().then((resp) => {
    if (typeof resp.errorCode !== 'undefined' && resp.errorCode !== 0) {
      console.log('query auth code error => ' + JSON.stringify(resp))
      this.$message({
        type: 'error',
        message: JSON.stringify(resp)
      })
    } else {
      // console.log('query auth code result: ' + JSON.stringify(resp.data.authCode))
      console.log('query auth code random: ' + resp.data.authCode.randomToken)
      callback(resp.data.authCode)
    }
  })
}
