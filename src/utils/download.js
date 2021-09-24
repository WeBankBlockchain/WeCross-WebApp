
export function downloadAsFile(content, filename) {
  const eleLink = document.createElement('a')
  eleLink.download = filename
  eleLink.style.display = 'none'
  const blob = new Blob([content])
  eleLink.href = URL.createObjectURL(blob)
  document.body.appendChild(eleLink)
  eleLink.click()
  document.body.removeChild(eleLink)
}

/**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {cb}
 */
function getBlob(url, cb) {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.responseType = 'blob'
  xhr.onload = function() {
    if (xhr.status === 200) {
      cb(xhr.response)
    }
  }
  xhr.send()
}

/**
* 保存
* @param  {Blob} blob
* @param  {String} filename 想要保存的文件名称
*/
function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    var link = document.createElement('a')
    var body = document.querySelector('body')

    link.href = window.URL.createObjectURL(blob)
    link.download = filename

    // fix Firefox
    link.style.display = 'none'
    body.appendChild(link)

    link.click()
    body.removeChild(link)

    window.URL.revokeObjectURL(link.href)
  }
}

/**
* 下载
* @param  {String} url 目标文件地址
* @param  {String} asFilename 想要保存的文件名称
*/
export function downloadAs(url, asFilename) {
  getBlob(url, function(blob) {
    saveAs(blob, asFilename)
  })
}
