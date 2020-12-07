export const startXASteps = [
  {
    target: '#XAID',
    header: {
      title: '开启事务'
    },
    content: '第一步：生成事务ID！<br>只支持输入16进制'
  },
  {
    target: '#XAPath',
    header: {
      title: '开启事务'
    },
    placeholder: top,
    content: '第二步：选择事务资源！<br>从左边待选资源列表勾选资源，点击添加按钮到已选资源列表'
  },
  {
    target: '#btnGroup',
    header: {
      title: '开启事务'
    },
    placeholder: top,
    content: '第三步：点击开启事务！'
  }
]

export const execXASteps = [
  {
    target: '#xaForm',
    header: {
      title: '执行事务'
    },
    placeholder: top,
    content: '执行事务交易！<br>填写资源、方法和参数，执行调用'
  },
  {
    target: '#xaList',
    header: {
      title: '执行事务'
    },
    placeholder: top,
    content: '查看事务步骤！<br>查看事务详细步骤'
  }
]
