
export function stepRoute(type, method) {
  if (type === null) {
    return defaultSteps
  }
  if (type === 'BCOS2.0') {
    return BCOSSteps
  } else if (type === 'Fabric1.4') {
    if (method === null) {
      return [{
        element: '#method',
        title: '选择操作',
        intro: '请先选择操作类型',
        position: 'bottom'
      }
      ]
    }
    if (method === 'install') {
      return FabricInstallSteps
    } else {
      return FabricInstantSteps
    }
  }
}

const BCOSSteps = [
  {
    element: '#method',
    title: '1. 选择操作',
    intro: '选择操作类型',
    position: 'top'
  }, {
    element: '#Path',
    title: '2. 资源路径',
    intro: '填写资源路径',
    position: 'top'
  }, {
    element: '#zipContract',
    title: '3. 选取合约上传',
    intro: '<p>选取需要部署的合约文件，打包成ZIP格式上传</p><li>打包zip文件时，合约入口必须放在最外层</li><li>合约的所有依赖文件必须按照依赖相对路径一起打包</li>',
    position: 'right'
  }, {
    element: '#chosenSolidity',
    title: '4. 选取合约入口文件',
    intro: '页面会读取您所上传的zip文件的最外层，选择入口文件进行部署',
    position: 'left'
  }, {
    element: '#className',
    title: '5. 填写合约类名',
    intro: '合约类名是您选取的"合约入口文件"中的合约类名',
    position: 'top'
  }, {
    element: '#bcosVersion',
    title: '6. 填写合约版本号',
    intro: '若在链中已有待部署合约的旧版本，填写较大版本可对旧合约进行升级',
    position: 'top'
  }, {
    element: '#onSubmit',
    title: '执行部署操作',
    intro: '检查表单，执行操作',
    position: 'top'
  }
]

const FabricInstallSteps = [
  {
    element: '#method',
    title: '1. 选择操作',
    intro: '选择操作类型',
    position: 'top'
  }, {
    element: '#Path',
    title: '2. 资源路径',
    intro: '填写资源路径',
    position: 'top'
  }, {
    element: '#org',
    title: '3. 所属机构名',
    intro: '安装链码的endorser所属的机构名<li>当前账户必须有对应机构的证书密钥才可以正确安装chaincode</li>',
    position: 'top'
  }, {
    element: '#compressedContent',
    title: '4. 选择合约文件',
    intro: '<p>选取需要部署的chaincode合约文件，打包成GZIP格式上传</p><li>打包时必须将链码放在"src/chaincode/"的目录下在能正确安装</li><li>文件路径例如：src/chaincode/sacc.go</li>',
    position: 'top'
  }, {
    element: '#fabricVersion',
    title: '5. 填写合约版本号',
    intro: '若在链中已有待部署合约的旧版本，填写较大版本可对旧合约进行升级',
    position: 'top'
  }, {
    element: '#lang',
    title: '6. 选择合约语言版本',
    intro: 'Golang/Java',
    position: 'top'
  }, {
    element: '#onSubmit',
    title: '执行部署操作',
    intro: '检查表单，执行操作<li>因为Fabric的原因，安装的chaincode必须实例化才能显示在跨链资源列表</li>',
    position: 'top'
  }
]

const FabricInstantSteps = [
  {
    element: '#method',
    title: '1. 选择操作',
    intro: '选择操作类型',
    position: 'top'
  }, {
    element: '#Path',
    title: '2. 资源路径',
    intro: '填写资源路径',
    position: 'top'
  }, {
    element: '#orgs',
    title: '3. 机构列表',
    intro: '链码被安装的的机构列表<li>将chaincode在列表中的机构进行实例化</li><li>必须以JSON数组的形式填写，例如：["Org1","Org2"]</li>',
    position: 'top'
  }, {
    element: '#fabricVersion',
    title: '4. 填写合约版本号',
    intro: '选择对应版本的chaincode进行实例化',
    position: 'top'
  }, {
    element: '#lang',
    title: '5. 选择合约语言版本',
    intro: 'Golang/Java',
    position: 'top'
  }, {
    element: '#policy',
    title: '6. 选择背书文件',
    intro: '<p>选择实例化时的背书</p><li>只能上传policy的yaml格式文件, 不上传默认为default</li><li>default为所有机构以OR连接</li>',
    position: 'top'
  }, {
    element: '#args',
    title: '7. 填写实例化参数',
    intro: '填写实例化时的参数<li>必须以JSON数组的形式填写，例如：["a","10"]，若参数为空也必须填写 []</li>',
    position: 'top'
  }, {
    element: '#onSubmit',
    title: '执行部署操作',
    intro: '检查表单，执行操作',
    position: 'top'
  }
]

const defaultSteps = [
  {
    element: '#stubType',
    title: '1. 选择链类型',
    intro: '选择链的类型',
    position: 'bottom'
  }, {
    element: '#method',
    title: '2. 选择操作',
    intro: '选择操作类型',
    position: 'top'
  }
]
