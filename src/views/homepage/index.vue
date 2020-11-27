<template>
  <div class="app-container">
    <el-row :gutter="10">
      <img :src="require('@/assets/wecross.svg')" width="720" alt="">
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>跨链路由状态</span>
          </div>
          <table>
            <tr>
              <td style="min-width: 150px">当前版本：</td>
              <td>1.0.0-20201127</td>
            </tr>
            <tr>
              <td>内部版本：</td>
              <td>1.0</td>
            </tr>
            <tr>
              <td>JDK版本：</td>
              <td>openjdk 11.0.9.1 2020-11-04</td>
            </tr>
          </table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>已配置的链</span>
          </div>
          <table>
            <tr>
              <td style="min-width: 150px">test-chain</td>
              <td>
                <el-tag type="info">BCOS2.0</el-tag>
              </td>
            </tr>
            <tr>
              <td>test-chain-2</td>
              <td>
                <el-tag type="info">GM_BCOS2.0</el-tag>
              </td>
            </tr>
          </table>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>已加载的插件</span>
          </div>
          <table>
            <tr>
              <td style="min-width: 150px">BCOS2.0</td>
              <td>1.0.0-20201127</td>
            </tr>
            <tr>
              <td>GM_BCOS2.0</td>
              <td>1.0.0-20201127</td>
            </tr>
          </table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Homepage',
  components: {},
  props: {},
  data() {
    return {}
  },
  created() {},
  mounted() {

  },
  methods: {

  }

}
</script>

<style lang="scss" scoped>
</style>
