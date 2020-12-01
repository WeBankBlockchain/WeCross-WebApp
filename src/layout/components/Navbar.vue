<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu" style="margin-right:20px">
      <el-dropdown trigger="click" style="margin-right:10px">
        <el-tooltip class="item" effect="light" content="加鸡腿" placement="left">
          <el-button circle effect="light" size="mini" icon="el-icon-chicken" />
        </el-tooltip>
        <el-dropdown-menu slot="dropdown">
          <body :background="qrCodeShow ? undefined: require('@/assets/issue.png') " style="text-align:center;background-size:cover;background-position-y:center;width:860px;height:550px;cursor:pointer" @click="qrCodeShow=!qrCodeShow">
            <el-container v-if="!qrCodeShow">
              <el-header style="text-align: left;line-height: 90px;margin-left:18px;font-size:25px"><span> 从Issue开始, 成为跨链达人 <i class="el-icon-magic-stick" /></span></el-header>
              <el-main style="height: 440px" />
              <el-footer style="text-align: right;margin-right:36px;padding:0px"><el-button-group>
                <el-button size="small" plain type="primary" round @click.stop="openPage('https://github.com/WeBankFinTech/WeCross/issues/new?assignees=&labels=question')"><i class="el-icon-chat-round" /> 不清楚，问问题 </el-button>
                <el-button size="small" plain type="danger" @click.stop="openPage('https://github.com/WeBankFinTech/WeCross/issues/new?assignees=&labels=&template=bug_report_cn.md&title=')"><i class="el-icon-aim" /> 用不爽，怒提Bug </el-button>
                <el-button size="small" plain type="warning" @click.stop="openPage('https://github.com/WeBankFinTech/WeCross/issues?q=is%3Aissue+is%3Aopen+Task')"><i class="el-icon-trophy" /> 领任务，拿奖品</el-button>
                <el-button size="small" plain type="success" round @click.stop="openPage('https://github.com/WeBankFinTech/WeCross/issues/new?assignees=&labels=CIP&template=cip_request_cn.md&title=')"><i class="el-icon-mic" /> 指方向，提需求</el-button>
              </el-button-group></el-footer>
            </el-container>
            <transition name="el-fade-in-linear">
              <img v-if="qrCodeShow" :src="require('@/assets/QRCode.jpg')" alt="" style="height:550px">
            </transition>
          </body>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown trigger="click">
        <el-button round effect="light" size="mini">
          <span class="el-dropdown-link"><i class="el-icon-user" />  |  {{ loginUser }} </span>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/account/index">
            <el-dropdown-item>
              账户管理
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      loginUser: this.$store.getters.name,
      qrCodeShow: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    openPage(url) {
      window.open(url, 'target')
    },
    async logout() {
      await this.$store.dispatch('user/logout').catch((error) => {
        console.log('error: ', error)
      }).finally(() => {
        this.$router.push({ path: '/login', query: { 'redirect': this.$route.fullPath }})
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
