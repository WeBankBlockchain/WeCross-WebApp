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
    data: {
      command: formData.method,
      args: [formData.appendPath || formData.fullPath.split('.')[2], formData.sourceContent, formData.className, formData.version]
    }
  }
}

export function buildBCOSRegisterRequest(formData) {
  return {
    version: 1,
    path: formData.fullPath || formData.prependPath + formData.appendPath,
    data: {
      command: formData.method,
      args: [formData.appendPath || formData.fullPath.split('.')[2], formData.chosenSolidity.split('.')[1], formData.sourceContent, '0x' + formData.address, formData.className, formData.version]
    }
  }
}

/*
{"version":"1","data":{"command":"install","args":["sacc","2.3","Org2","GO_LANG","H4sQg+=.."]}}
 */
export function buildFabricInstallRequest(formData) {
  return {
    version: 1,
    path: formData.fullPath || formData.prependPath + formData.appendPath,
    data: {
      command: formData.method,
      args: [
        formData.appendPath || formData.fullPath.split('.')[2],
        formData.version,
        formData.org,
        formData.lang,
        formData.compressedContent
      ]
    }
  }
}

/*
{"version":"1","data":{"command":"instantiate","args":["sacc","2.3","[\"Org1\",\"Org2\"]","GO_LANG","","[\"a\",\"10\"]"]}}
 */
export function buildFabricInstantiateRequest(formData) {
  return {
    version: 1,
    path: formData.fullPath || formData.prependPath + formData.appendPath,
    data: {
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
}

/*
 {"version":"1","data":{"command":"upgrade","args":["sacc","2.0","[\"Org1\",\"Org2\"]","GO_LANG","","[\"a\",\"10\"]"]}}
 */
export function buildFabricUpgradeRequest(formData) {
  return {
    version: 1,
    path: formData.fullPath || formData.prependPath + formData.appendPath,
    data: {
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
}
