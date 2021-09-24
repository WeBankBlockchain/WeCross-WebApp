import introJS from 'intro.js'
import 'intro.js/introjs.css'
import 'intro.js/themes/introjs-modern.css'
import { listAccount } from '@/api/ua'
import { Message } from 'element-ui'

/**
 * check if chain account fit the chainTypes
 * @param {Array|String} chainTypes - the type of chains to query
 * @param {Function} callBack - what to do on exiting intro
 * @return {IntroJs|null}
 */
export function isChainAccountFit(chainTypes, callBack) {
  if (!chainTypes) {
    Message.error('Wrong chain types, please check.')
    return null
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
            disableInteraction: true,
            tooltipClass: 'customTooltip',
            steps: [
              {
                title: '警告⚠️',
                intro: '<strong>请检查是否正确配置二级账户</strong><li>未配置二级账户将会影响基本使用</li>'
              },
              {
                element: '#Account',
                title: '账户管理',
                intro: '请在这里配置二级账户信息<br>',
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
          disableInteraction: true,
          tooltipClass: 'customTooltip',
          steps: [
            {
              title: '警告⚠️',
              intro: '<strong>请检查是否正确配置二级账户</strong><li>未配置二级账户将会影响基本使用</li>'
            },
            {
              element: '#Account',
              title: '账户管理',
              intro: '请在这里配置二级账户信息<br>',
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
