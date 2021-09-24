const prefix = 'receiptHistory:'

export function putReceiptHistory(txHash, receipt) {
  if (typeof (txHash) === 'undefined' || txHash.length === 0) {
    console.error('receiptHistory put, txHash is undefined: ' + txHash)
  } else {
    localStorage.setItem(prefix + txHash, JSON.stringify(receipt))
  }
}

export function getReceiptHistory(txHash) {
  return JSON.parse(localStorage.getItem(prefix + txHash))
}
