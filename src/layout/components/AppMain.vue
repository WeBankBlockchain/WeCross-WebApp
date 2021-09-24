<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive
        v-if="isLogin"
        exclude="XATransaction,XATransactionList,ResourceDeploy,RawTransaction,Login,ChangePassword"
      >
        <router-view :key="key" />
      </keep-alive>
      <router-view v-else :key="key" />
    </transition>
  </section>
</template>

<script>
import { getSecKey } from '@/utils/auth'

export default {
  name: 'AppMain',
  data() {
    return {
      isLogin: true
    }
  },
  computed: {
    key() {
      return this.$route.path
    }
  },
  watch: {
    $route(to, from) {
      // if the route changes...
      const secKey = getSecKey()
      this.isLogin = !!secKey
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
