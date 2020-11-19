export function clearForm(formData) {
  formData.className = null
  formData.version = null
  formData.address = null
  formData.org = null
  formData.lang = null
  formData.policy = null
  formData.args = null
}

export function buildBCOSDeployRequest(formData) {
  return {
    version: 1,
    path: formData.path,
    data: {
      command: formData.method,
      args: [formData.path.split('.')[2], formData.sourceContent, formData.className, formData.version]
    }
  }
}

export function buildBCOSRegisterRequest(formData) {
  return {
    version: 1,
    path: formData.path,
    data: {
      command: formData.method,
      args: [formData.path.split('.')[2], formData.fileType, formData.sourceContent, '0x' + formData.address, formData.className, formData.version]
    }
  }
}

export function buildFabricInstallRequest(formData) {
  return {
    version: 1,
    path: formData.path,
    data: {
      command: formData.method,
      args: [
        formData.path.split('.')[2],
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
    path: formData.path,
    data: {
      command: formData.method,
      args: [
        formData.path.split('.')[2],
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
    path: formData.path,
    data: {
      command: formData.method,
      args: [
        formData.path.split('.')[2],
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
