export function buildBCOSDeployRequest(formData) {
  return {
    path: formData.path,
    command: formData.method,
    sourceContent: formData.sourceContent,
    className: formData.className,
    version: formData.version
  }
}

export function buildBCOSRegisterRequest(formData) {
  return {
    path: formData.path,
    command: formData.method,
    sourceContent: formData.sourceContent,
    className: formData.className,
    version: formData.version,
    address: formData.address
  }
}

export function buildFabricInstallRequest(formData) {
  return {
    path: formData.path,
    command: formData.method,
    sourceContent: formData.sourceContent,
    org: formData.org,
    version: formData.version,
    lang: formData.lang
  }
}

export function buildFabricInstantiateRequest(formData) {
  return {
    path: formData.path,
    command: formData.method,
    sourceContent: formData.sourceContent,
    org: formData.org,
    version: formData.version,
    lang: formData.lang,
    policy: formData.policy,
    args: formData.args
  }
}
