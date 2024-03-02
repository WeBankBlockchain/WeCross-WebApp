export const xaTransactionManagerSteps = [
  {
    element: '#ChainExplorer',
    title: '1. 导航选择',
    intro: '第一步：从zone-chain导航中选择对应的链',
    position: 'right'
  },
  {
    element: '#xaTransactionListExplorer',
    title: '2. 事务列表展示',
    intro: '第二步：选择好对应的链之后，就会在资源列表中展示这条链中所有事务',
    position: 'left'
  },
  {
    element: '#sendxaTransaction',
    title: '发起交易',
    intro: '若需要发起事务，请点击"发起事务"按钮',
    position: 'left'
  }
]

export const startXASteps = [
  {
    element: '#XAID',
    title: '开启事务',
    intro: '第一步：生成事务ID！<br>只支持输入16进制',
    position: 'bottom'
  },
  {
    element: '#XAPath',
    title: '开启事务',
    intro: '第二步：选择事务资源！<br>从左边待选资源列表勾选资源，点击添加按钮到已选资源列表',
    position: 'top'
  },
  {
    element: '#btnGroup',
    title: '开启事务',
    intro: '第三步：点击开启事务！',
    position: 'top'
  }
]

export const execXASteps = [
  {
    element: '#xaForm',
    title: '执行事务',
    intro: '执行事务交易！<br>填写资源、方法和参数，执行调用',
    position: 'top'
  },
  {
    element: '#xaList',
    title: '执行事务',
    intro: '查看事务步骤！<br>查看事务详细步骤',
    position: 'top'
  }
]
