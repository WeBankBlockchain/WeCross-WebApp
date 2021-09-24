export function clearForm(formData) {
  formData.className = null
  formData.version = null
  formData.address = null
  formData.org = null
  formData.lang = null
  formData.policy = 'default'
  formData.args = null
  formData.chosenSolidity = null
  formData.sourceContent = null
  formData.compressedContent = null
}

export function buildBCOSDeployRequest(formData) {
  return {
    version: 1,
    path: formData.fullPath || formData.prependPath + formData.appendPath,
    command: formData.method,
    args: [formData.appendPath || formData.fullPath.split('.')[2], formData.sourceContent, formData.className, formData.version]

  }
}

export function buildBCOSRegisterRequest(formData) {
  return {
    version: 1,
    path: formData.fullPath || formData.prependPath + formData.appendPath,
    command: formData.method,
    args: [formData.appendPath || formData.fullPath.split('.')[2], formData.chosenSolidity.split('.')[1], formData.sourceContent, '0x' + formData.address, formData.className, formData.version]

  }
}

export function buildFabricInstallRequest(formData) {
  return {
    version: 1,
    path: formData.fullPath || formData.prependPath + formData.appendPath,
    command: formData.method,
    args: [
      formData.appendPath || formData.fullPath.split('.')[2],
      formData.version,
      formData.org.trim(),
      formData.lang,
      formData.compressedContent
    ]

  }
}

export function buildFabricInstantiateRequest(formData) {
  return {
    version: 1,
    path: formData.fullPath || formData.prependPath + formData.appendPath,
    command: formData.method,
    args: [
      formData.appendPath || formData.fullPath.split('.')[2],
      formData.version,
      formData.org,
      formData.lang,
      formData.policy === 'default' ? '' : formData.policy,
      formData.args.trim()
    ]

  }
}

export function buildFabricInstallAndInstantiateRequest(formData) {
  var ret = {
    version: 1,
    path: formData.fullPath || formData.prependPath + formData.appendPath,
    command: formData.method,
    args: [
      formData.appendPath || formData.fullPath.split('.')[2],
      formData.version,
      formData.lang,
      formData.compressedContent,
      formData.policy === 'default' ? '' : formData.policy,
      formData.args.trim()
    ]
  }
  console.log(ret)
  return ret
}

export function buildFabricUpgradeRequest(formData) {
  return {
    version: 1,
    path: formData.fullPath || formData.prependPath + formData.appendPath,
    command: formData.method,
    args: [
      formData.appendPath || formData.fullPath.split('.')[2],
      formData.version,
      formData.org,
      formData.lang,
      formData.policy === 'default' ? '' : formData.policy,
      formData.args
    ]
  }
}
