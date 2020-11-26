export function clearForm(formData) {
  formData.className = null
  formData.version = null
  formData.address = null
  formData.org = null
  formData.lang = null
  formData.policy = null
  formData.args = null
  formData.chosenSolidity = null
  formData.sourceContent = null
  formData.compressedContent = null
}

export function buildBCOSDeployRequest(formData) {
  return {
    version: 1,
    path: formData.fullPath || formData.prependPath + formData.appendPath,
    data: {
      command: formData.method,
      args: [formData.appendPath, formData.sourceContent, formData.className, formData.version]
    }
  }
}

export function buildBCOSRegisterRequest(formData) {
  return {
    version: 1,
    path: formData.fullPath || formData.prependPath + formData.appendPath,
    data: {
      command: formData.method,
      args: [formData.appendPath, formData.chosenSolidity.split('.')[1], formData.sourceContent, '0x' + formData.address, formData.className, formData.version]
    }
  }
}

export function buildFabricInstallRequest(formData) {
  return {
    version: 1,
    path: formData.fullPath || formData.prependPath + formData.appendPath,
    data: {
      command: formData.method,
      args: [
        formData.appendPath,
        formData.version,
        formData.org,
        formData.lang,
        formData.compressedContent
      ]
    }
  }
}

export function buildFabricInstantiateRequest(formData) {
  return {
    version: 1,
    path: formData.fullPath || formData.prependPath + formData.appendPath,
    data: {
      command: formData.method,
      args: [
        formData.appendPath,
        formData.version,
        formData.org,
        formData.lang,
        formData.sourceContent,
        formData.policy === 'default' ? null : formData.policy,
        formData.args
      ]
    }
  }
}

export function buildFabricUpgradeRequest(formData) {
  return {
    version: 1,
    path: formData.fullPath || formData.prependPath + formData.appendPath,
    data: {
      command: formData.method,
      args: [
        formData.appendPath,
        formData.version,
        formData.org,
        formData.lang,
        formData.sourceContent,
        formData.policy === 'default' ? null : formData.policy,
        formData.args
      ]
    }
  }
}
