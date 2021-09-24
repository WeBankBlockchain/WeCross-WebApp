const IdentityKey = 'cross-chain-user'
const SecKeyKey = 'cross-chain-sec'

export function getIdentity() {
  return localStorage.getItem(IdentityKey)
}

export function setIdentity(identity) {
  return localStorage.setItem(IdentityKey, identity)
}

export function removeIdentity() {
  return localStorage.removeItem(IdentityKey)
}

export function getSecKey() {
  return localStorage.getItem(SecKeyKey)
}

export function setSecKey(secKey) {
  return localStorage.setItem(SecKeyKey, secKey)
}

export function removeSecKey() {
  return localStorage.removeItem(SecKeyKey)
}

export function isUserFirstTimeUse(username) {
  // not first time
  if (localStorage.getItem(username)) {
    return false
  } else {
    localStorage.setItem(username, '1')
    return true
  }
}
