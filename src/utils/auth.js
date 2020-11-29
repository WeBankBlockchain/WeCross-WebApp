
const TokenKey = 'wecross-token'
const UsernameKey = 'wecross-user'
const PubKey = 'wecross-pub'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function getUsername() {
  return localStorage.getItem(UsernameKey)
}

export function setUsername(username) {
  return localStorage.setItem(UsernameKey, username)
}

export function removeUsername() {
  return localStorage.removeItem(UsernameKey)
}

export function setPubKey(pub) {
  return localStorage.setItem(PubKey, pub)
}

export function removePubKey() {
  return localStorage.removeItem(PubKey)
}
