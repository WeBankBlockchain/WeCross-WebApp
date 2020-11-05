<template>
  <div class="app-container">
    <el-row style="margin-top:20px;">
      <el-card class="box-card">
        <div>
          该功能暂未开放
        </div>
      </el-card>
    </el-row>
    <!--
    <el-row style="margin-top:20px;">
      <el-card>
        <el-steps :active="1">
          <el-step title="基本信息" description="选择部署哪种区块链"></el-step>
          <el-step title="网络架构" description="配置区块链的网络架构"></el-step>
          <el-step title="参数配置" description="配置区块链的详细参数"></el-step>
          <el-step title="完成" description="开始部署区块链"></el-step>
        </el-steps>
      </el-card>
    </el-row>
    <el-row style="margin-top:20px;">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
        </div>
        <div v-for="o in 4" :key="o" class="text item">
          {{'列表内容 ' + o }}
        </div>
      </el-card>
    </el-row>
    -->
  </div>
</template>

<script>

export default {
  name: 'ChainDeploy',
  props: {},
  data() {
    return {
      chains: []
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>
