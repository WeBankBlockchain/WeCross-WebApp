import { JSEncrypt } from 'jsencrypt'

/**
 * rsa encrypt
 */
export function rsa_encode(input, pub) {
  var encryptor = new JSEncrypt()
  encryptor.setPublicKey(pub)
  var encoded = encryptor.encrypt(input)
  return encoded
}
