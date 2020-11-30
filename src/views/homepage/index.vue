<template>
  <div class="app-container">
    <el-row :gutter="10">
      <img :src="require('@/assets/wecross.svg')" width="720" alt="">
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>系统信息</span>
          </div>
          <table>
            <tr>
              <td style="min-width: 9em" valign="top">操作系统名称：</td>
              <td valign="top">{{ systemInfo.osName }}</td>
            </tr>
            <tr>
              <td valign="top">操作系统架构：</td>
              <td valign="top">{{ systemInfo.osArch }}</td>
            </tr>
            <tr>
              <td valign="top">操作系统版本：</td>
              <td valign="top">{{ systemInfo.osVersion }}</td>
            </tr>
            <tr>
              <td valign="top">JVM名称：</td>
              <td valign="top">{{ systemInfo.javaVMName }}</td>
            </tr>
            <tr>
              <td valign="top">JVM供应商：</td>
              <td valign="top">{{ systemInfo.javaVMVendor }}</td>
            </tr>
            <tr>
              <td valign="top">JVM版本：</td>
              <td>{{ systemInfo.javaVMVersion }}</td>
            </tr>
            <tr>
              <td valign="top">密码学组件名：</td>
              <td valign="top">{{ systemInfo.providerName }}</td>
            </tr>
            <tr>
              <td valign="top">密码学组件版本：</td>
              <td valign="top">{{ systemInfo.providerVersion }}</td>
            </tr>
            <tr>
              <td valign="top">密码学组件详情：</td>
              <td valign="top">{{ systemInfo.providerInfo }}</td>
            </tr>
            <tr>
              <td valign="top">加载的椭圆曲线：</td>
              <td valign="top">{{ systemInfo.namedGroups }}</td>
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
              <td style="min-width: 6em" valign="top">跨链路由版本：</td>
              <td valign="top">{{ routerInfo.version }}</td>
            </tr>
            <tr>
              <td valign="top">已加载的插件：</td>
              <td valign="top">{{ routerInfo.supportedStubs }}</td>
            </tr>
            <tr>
              <td valign="top">RPC接入配置：</td>
              <td valign="top">{{ routerInfo.rpcNetInfo }}</td>
            </tr>
            <tr>
              <td valign="top">P2P接入配置：</td>
              <td valign="top">{{ routerInfo.p2pNetInfo }}</td>
            </tr>
            <tr>
              <td valign="top">管理员账号：</td>
              <td valign="top">{{ routerInfo.adminAccount }}</td>
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
  methods: {

  }

}
</script>

<style lang="scss" scoped>
</style>
