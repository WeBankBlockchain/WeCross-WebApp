import introJS from 'intro.js'
import 'intro.js/introjs.css'
import 'intro.js/themes/introjs-modern.css'
import { listAccount } from '@/api/ua'

/**
 * check if chain account fit the chainTypes
 * @param {Array|String} chainTypes - the type of chains to query
 * @param {Function} callBack - what to do on exiting intro
 * @return {IntroJs}
 */
export function isChainAccountFit(chainTypes, callBack) {
  if (!chainTypes) {
    return introJS().setOptions({
      prevLabel: '上一步',
      nextLabel: '下一步',
      doneLabel: '结束',
      tooltipClass: 'customTooltip',
      steps: [
        {
          title: '警告⚠️',
          intro: '<strong>请检查是否正确配置链账户</strong><li>未配置链账户将会影响基本使用</li>'
        },
        {
          element: '#Account',
          title: '账户管理',
          intro: '请在这里配置链账户信息<br><br>账户功能详情介绍请参考：<a class="text-blue" href="https://wecross.readthedocs.io/zh_CN/latest/docs/manual/account.html" target="_blank">账号服务</a>',
          position: 'right'
        }
      ]
    }).start().onexit(callBack)
  }
  listAccount().then(res => {
    const chainAccountTypes = new Set()
    for (const chainAccount of res.data.chainAccounts) {
      chainAccountTypes.add(chainAccount.type)
    }
    if (chainTypes instanceof Array) {
      for (const chainType of chainTypes) {
        if (chainAccountTypes.size < 1 || !chainAccountTypes.has(chainType)) {
          return introJS().setOptions({
            prevLabel: '上一步',
            nextLabel: '下一步',
            doneLabel: '结束',
            tooltipClass: 'customTooltip',
            steps: [
              {
                title: '警告⚠️',
                intro: '<strong>请检查是否正确配置链账户</strong><li>未配置链账户将会影响基本使用</li>'
              },
              {
                element: '#Account',
                title: '账户管理',
                intro: '请在这里配置链账户信息<br><br>账户功能详情介绍请参考：<a class="text-blue" href="https://wecross.readthedocs.io/zh_CN/latest/docs/manual/account.html" target="_blank">账号服务</a>',
                position: 'right'
              }
            ]
          }).start().onexit(callBack)
        }
      }
      callBack()
    } else if (typeof chainTypes === 'string') {
      if (!chainAccountTypes.has(chainTypes)) {
        console.log(chainAccountTypes, chainTypes)
        return introJS().setOptions({
          prevLabel: '上一步',
          nextLabel: '下一步',
          doneLabel: '结束',
          tooltipClass: 'customTooltip',
          steps: [
            {
              title: '警告⚠️',
              intro: '<strong>请检查是否正确配置链账户</strong><li>未配置链账户将会影响基本使用</li>'
            },
            {
              element: '#Account',
              title: '账户管理',
              intro: '请在这里配置链账户信息<br><br>账户功能详情介绍请参考：<a class="text-blue" href="https://wecross.readthedocs.io/zh_CN/latest/docs/manual/account.html" target="_blank">账号服务</a>',
              position: 'right'
            }
          ]
        }).start().onexit(callBack)
      } else {
        callBack()
      }
    }
  })
}
