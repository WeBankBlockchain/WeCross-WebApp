<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':true}">
        <navbar @help="helpClick" />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import introJS from 'intro.js'
import 'intro.js/introjs.css'
import 'intro.js/themes/introjs-modern.css'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    return {
      homePageSteps: [
        {
          element: '#Home',
          title: '平台首页',
          intro: '平台首页展示WeCross网络数据统计信息',
          position: 'right'
        },
        {
          element: '#Account',
          title: '账户管理',
          intro: '<li>查看跨链账户信息</li><li>添加链账户</li><li>设置默认链账户</li><li>删除链账户</li>',
          position: 'right'
        },
        {
          element: '#Router',
          title: '路由管理',
          intro: '<li>查看跨链路由信息</li><li>添加孤立路由</li>',
          position: 'right'
        },
        {
          element: '#Resource',
          title: '资源管理',
          intro: '<li>查看跨链资源信息</li><li>调用跨链资源</li><li>跨链资源部署</li>',
          position: 'right'
        },
        {
          element: '#Transaction',
          title: '交易管理',
          intro: '<li>查看跨链交易详细信息</li><li>发起跨链交易</li>',
          position: 'right'
        },
        {
          element: '#XATransaction',
          title: '事务管理',
          intro: '<li>查看跨链事务详细信息</li><li>发起跨链事务</li><li>恢复跨链事务上下文</li>',
          position: 'right'
        },
        {
          element: '#Documents',
          title: '参考文档',
          intro: 'WeCross参考文档链接',
          position: 'right'
        },
        {
          element: '#issue',
          title: '意见和建议',
          intro: '用不爽？有BUG？<br>欢迎向我们提出，让我们做得更好 😄',
          position: 'left'
        }, {
          element: '#userAvatar',
          title: '用户头像',
          intro: '展示用户账号名，可点击按钮修改密码、退出登录',
          position: 'left'
        }
      ],
      accountSteps: [
        {
          element: '#Account',
          title: '账户管理',
          intro: '<li>查看跨链账户信息</li><li>添加链账户</li><li>设置默认链账户</li><li>删除链账户</li>',
          position: 'right'
        },
        {
          element: '#accountHelp',
          title: '获取详细步骤 🔍',
          intro: '点击按钮，查看更多帮助信息',
          position: 'right'
        }
      ],
      resourceSteps: [
        {
          element: '#Resource',
          title: '资源管理',
          intro: '<li>查看跨链资源信息</li><li>调用跨链资源</li><li>跨链资源部署</li>',
          position: 'right'
        },
        {
          element: '#resourceHelp',
          title: '获取详细步骤 🔍',
          intro: '点击按钮，查看更多帮助信息',
          position: 'right'
        }
      ],
      transactionStep: [
        {
          element: '#Transaction',
          title: '交易管理',
          intro: '<li>查看跨链交易详细信息</li><li>发起跨链交易</li>',
          position: 'right'
        },
        {
          element: '#transactionHelp',
          title: '获取详细步骤 🔍',
          intro: '点击按钮，查看更多帮助信息',
          position: 'right'
        }
      ]
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    helpClick() {
      switch (this.$router.currentRoute.name) {
        case 'homepage':
          this.homePageHelp()
          break
        case 'AccountManager':
          this.accountHelp()
          break
        case 'resourceList':
          this.resourceHelp()
          break
        case 'resourceDeployment':
          this.resourceDeployHelp()
          break
        case 'TransactionList':
          this.transactionHelp()
          break
        case 'routerManager':
          this.routerHelp()
          break
        case 'xaTransactionList':
          this.xaHelp()
          break
        case 'xaTransaction':
          this.XATransactionHelp()
          break
        default:
          this.homePageHelp()
      }
    },
    homePageHelp() {
      if (this.$store.getters.device === 'desktop') {
        introJS().setOptions({
          prevLabel: '上一步',
          nextLabel: '下一步',
          doneLabel: '结束',
          disableInteraction: true,
          steps: this.homePageSteps
        }).start()
      } else {
        this.$store.dispatch('app/openSideBar', { withoutAnimation: false }).then(_ => {
          introJS().addStep({
            title: '欢迎✨',
            intro: '欢迎使用WeCross网页管理平台'
          }).addSteps(this.homePageSteps).setOptions({
            prevLabel: '上一步',
            nextLabel: '下一步',
            doneLabel: '结束',
            disableInteraction: true
          }).start().onexit(() => {
            this.$store.dispatch('app/closeSideBar', { withoutAnimation: false }).then(() => {})
          })
        })
      }
    },
    accountHelp() {
      const _this = this
      if (this.$store.getters.device === 'desktop') {
        introJS().setOptions({
          prevLabel: '上一步',
          nextLabel: '下一步',
          doneLabel: '结束',
          disableInteraction: true,
          steps: this.accountSteps
        }).start()
      } else {
        this.$store.dispatch('app/openSideBar', { withoutAnimation: false }).then(_ => {
          introJS().addStep({
            title: '欢迎✨',
            intro: '欢迎使用WeCross网页管理平台'
          }).addSteps(this.accountSteps)
            .onbeforechange(function(element) {
              if (element && element.id && element.id === 'accountHelp') {
                _this.$store.dispatch('app/closeSideBar', { withoutAnimation: false }).then(() => {})
              }
              if (element && element.id && element.id === 'Account') {
                _this.$store.dispatch('app/openSideBar', { withoutAnimation: false }).then(() => {})
              }
            })
            .setOptions({
              disableInteraction: true,
              prevLabel: '上一步',
              nextLabel: '下一步',
              doneLabel: '结束'
            }).start().onexit(() => {
              this.$store.dispatch('app/closeSideBar', { withoutAnimation: false }).then(() => {})
            })
        })
      }
    },
    resourceHelp() {
      if (this.$store.getters.device === 'desktop') {
        introJS().setOptions({
          prevLabel: '上一步',
          nextLabel: '下一步',
          doneLabel: '结束',
          disableInteraction: true,
          steps: this.resourceSteps
        }).start()
      } else {
        const _this = this
        this.$store.dispatch('app/openSideBar', { withoutAnimation: false }).then(_ => {
          introJS().addStep({
            title: '欢迎✨',
            intro: '欢迎使用WeCross网页管理平台'
          }).addSteps(this.resourceSteps)
            .onbeforechange(function(element) {
              if (element && element.id && element.id === 'resourceHelp') {
                _this.$store.dispatch('app/closeSideBar', { withoutAnimation: false }).then(() => {})
              }
              if (element && element.id && element.id === 'Resource') {
                _this.$store.dispatch('app/openSideBar', { withoutAnimation: false }).then(() => {})
              }
            })
            .setOptions({
              disableInteraction: true,
              prevLabel: '上一步',
              nextLabel: '下一步',
              doneLabel: '结束'
            }).start().onexit(() => {
              this.$store.dispatch('app/closeSideBar', { withoutAnimation: false }).then(() => {})
            })
        })
      }
    },
    transactionHelp() {
      if (this.$store.getters.device === 'desktop') {
        introJS().setOptions({
          prevLabel: '上一步',
          nextLabel: '下一步',
          doneLabel: '结束',
          disableInteraction: true,
          steps: this.transactionStep
        }).start()
      } else {
        const _this = this
        this.$store.dispatch('app/openSideBar', { withoutAnimation: false }).then(_ => {
          introJS().addStep({
            title: '欢迎✨',
            intro: '欢迎使用WeCross网页管理平台'
          }).addSteps(this.transactionStep)
            .onbeforechange(function(element) {
              if (element && element.id && element.id === 'transactionHelp') {
                _this.$store.dispatch('app/closeSideBar', { withoutAnimation: false }).then(() => {})
              }
              if (element && element.id && element.id === 'Transaction') {
                _this.$store.dispatch('app/openSideBar', { withoutAnimation: false }).then(() => {})
              }
            })
            .setOptions({
              disableInteraction: true,
              prevLabel: '上一步',
              nextLabel: '下一步',
              doneLabel: '结束'
            }).start().onexit(() => {
              this.$store.dispatch('app/closeSideBar', { withoutAnimation: false }).then(() => {})
            })
        })
      }
    },
    resourceDeployHelp() {
      introJS().setOptions({
        prevLabel: '上一步',
        nextLabel: '下一步',
        doneLabel: '结束',
        disableInteraction: true,
        steps: [
          {
            title: '欢迎✨',
            intro: '可在此页面部署多种链类型的跨链资源'
          },
          {
            element: '#deployHelp',
            title: '获取详细步骤 🔍',
            intro: '点击按钮，查看更多帮助信息',
            position: 'bottom'
          }
        ]
      }).start()
    },
    routerHelp() {
      introJS().setOptions({
        prevLabel: '上一步',
        nextLabel: '下一步',
        doneLabel: '结束',
        disableInteraction: true,
        steps: [
          {
            element: '#Router',
            title: '路由管理',
            intro: '<li>查看跨链路由信息</li><li>添加孤立路由</li>',
            position: 'right'
          }
        ]
      }).start()
    },
    xaHelp() {
      introJS().setOptions({
        prevLabel: '上一步',
        nextLabel: '下一步',
        doneLabel: '结束',
        disableInteraction: true,
        steps: [
          {
            element: '#XATransaction',
            title: '事务管理',
            intro: '<li>查看跨链事务详细信息</li><li>发起跨链事务</li><li>恢复跨链事务上下文</li>',
            position: 'right'
          }
        ]
      }).start()
    },
    XATransactionHelp() {
      if (document.querySelector('.XAHelp')) {
        introJS().setOptions({
          prevLabel: '上一步',
          nextLabel: '下一步',
          doneLabel: '结束',
          disableInteraction: true,
          steps: [
            {
              element: '.XAHelp',
              title: '获取详细步骤 🔍',
              intro: '点击按钮，查看更多帮助信息',
              position: 'bottom'
            }
          ]
        }).start()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
