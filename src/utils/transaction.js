const xaTransactionKey = 'xaTX'

export function getXATX() {
  return JSON.parse(sessionStorage.getItem(xaTransactionKey))
}

export function setXATX(xaTX) {
  return sessionStorage.setItem(xaTransactionKey, xaTX)
}

export function removeXATX() {
  return sessionStorage.removeItem(xaTransactionKey)
}

