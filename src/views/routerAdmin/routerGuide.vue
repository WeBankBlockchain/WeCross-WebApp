<template>
  <div class="app-container">
    <el-row style="margin-top:20px;">
      <el-card>
        <div style="height: 500px;">
          <el-steps direction="vertical" :active="1">
            <el-step title="基本信息" description="配置跨链分区、监听端口信息"></el-step>
            <el-step title="身份服务" description="配置身份服务的IP端口信息"></el-step>
            <el-step title="下载安装包" description="下载完成的跨链路由安装包"></el-step>
          </el-steps>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'RouterGuide',
  props: {},
  data() {
    return {
      routers: []
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>
