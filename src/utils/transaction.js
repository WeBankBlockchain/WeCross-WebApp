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

export function buildXAError(response) {
  if (typeof response.data !== 'undefined' &&
      typeof response.data.chainErrorMessages !== 'undefined' &&
      response.data.chainErrorMessages !== []) {
    let str = ''
    for (const chainErrorMessage of response.data.chainErrorMessages) {
      str += chainErrorMessage.path + ': ' + chainErrorMessage.message + '\n'
    }
    return str
  } else {
    return response.message
  }
}
