<template>
  <div class="app-container">
    <el-row :gutter="10">
      <img
        :src="require('@/assets/wecross.svg')"
        width="720"
        alt=""
        style="text-align: center; display: block;  margin-left: auto;margin-right: auto;"
      >
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>系统信息</span>
          </div>
          <table>
            <tr>
              <td>操作系统名称：</td>
              <td>{{ systemInfo.osName }}</td>
            </tr>
            <tr>
              <td>操作系统架构：</td>
              <td>{{ systemInfo.osArch }}</td>
            </tr>
            <tr>
              <td>操作系统版本：</td>
              <td>{{ systemInfo.osVersion }}</td>
            </tr>
            <tr>
              <td>JVM名称：</td>
              <td>{{ systemInfo.javaVMName }}</td>
            </tr>
            <tr>
              <td>JVM供应商：</td>
              <td>{{ systemInfo.javaVMVendor }}</td>
            </tr>
            <tr>
              <td>JVM版本：</td>
              <td>{{ systemInfo.javaVMVersion }}</td>
            </tr>
            <tr>
              <td>密码学组件名：</td>
              <td>{{ systemInfo.providerName }}</td>
            </tr>
            <tr>
              <td>密码学组件版本：</td>
              <td>{{ systemInfo.providerVersion }}</td>
            </tr>
            <tr>
              <td>密码学组件详细信息：</td>
              <td>{{ systemInfo.providerInfo }}</td>
            </tr>
            <tr>
              <td>已配置的椭圆曲线：</td>
              <td>{{ systemInfo.namedGroups }}</td>
            </tr>
          </table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>跨链路由信息</span>
          </div>
          <table>
            <tr>
              <td>跨链路由版本：</td>
              <td>{{ routerInfo.version }}</td>
            </tr>
            <tr>
              <td>已加载的插件：</td>
              <td>{{ routerInfo.supportedStubs }}</td>
            </tr>
            <tr>
              <td>RPC接入配置：</td>
              <td>{{ routerInfo.rpcNetInfo }}</td>
            </tr>
            <tr>
              <td>P2P接入配置：</td>
              <td>{{ routerInfo.p2pNetInfo }}</td>
            </tr>
            <tr>
              <td>管理员账号：</td>
              <td>{{ routerInfo.adminAccount }}</td>
            </tr>
          </table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { systemStatus } from '@/api/status'
import { routerStatus } from '@/api/status'

export default {
  name: 'Homepage',
  components: {},
  props: {},
  data() {
    return {
      systemInfo: {},
      routerInfo: {}
    }
  },
  created() {
    systemStatus().then(response => {
      this.systemInfo = response.data
    }).catch(_ => {
      this.$message({
        type: 'error',
        message: '获取系统信息失败，网络错误'
      })
    })

    routerStatus().then(response => {
      this.routerInfo = response.data
    }).catch(_ => {
      this.$message({
        type: 'error',
        message: '获取插件列表失败，网络错误'
      })
    })
  },
  mounted() {

  },
  methods: {}

}
</script>

<style lang="scss" scoped>
table {
  td {
    min-width: 180px;
    vertical-align: top;
  }
}
</style>
