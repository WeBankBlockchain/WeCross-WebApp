import { JSEncrypt } from 'jsencrypt'
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
      console.log('pub: ' + pub)
      setPubKey(pub)
    }
  })
}

/**
 * rsa encrypt
 */
export function rsa_encode(input, pub) {
  var encryptor = new JSEncrypt()
  encryptor.setPublicKey(pub)
  var encoded = encryptor.encrypt(input)
  return encoded
}
