<template>
  <div class="app-container">
    <el-row>
      <el-button-group>
        <el-button icon="el-icon-back" @click="back" v-bind:disabled="history.index === 0">后退</el-button>
        <el-button @click="forward" v-bind:disabled="history.index + 1 === history.list.length">前进<i class="el-icon-arrow-right el-icon-right"></i></el-button>
      </el-button-group>
      <el-button-group style="margin-left: 100px; width:50%">
        <el-input size="large" placeholder="搜索资源..." prefix-icon="el-icon-search" v-model="searchPath" clearable></el-input>
      </el-button-group>
      <el-button-group>
        <el-button icon="el-icon-search">搜索</el-button>
      </el-button-group>
    </el-row>
    <el-row :gutter="30" style="margin-top: 20px">
      <el-col :span="4">
        <ChainExplorer :chain='chainPath' @chain-click='onChainClick'></ChainExplorer>
      </el-col>
      <el-col :span="18">
        <ResourceExplorer :chain='chainPath' :pageSize=10></ResourceExplorer>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ChainExplorer from '@/components/ChainExplorer'
import ResourceExplorer from '@/components/ResourceExplorer'

export default {
  name: 'ChainDeploy',
  components: {
    ChainExplorer,
    ResourceExplorer
  },
  props: {},
  data() {
    return {
      chainPath: '',
      searchPath: '',
      history: {
        index: 0,
        list: []
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    onChainClick(path) {
      if (this.chainPath !== path) {
        this.chainPath = path
        this.history.list.push(path)
        this.history.index = this.history.list.length - 1
      }
    },
    back() {
      if (this.history.index > 0) {
        --this.history.index
        this.chainPath = this.history.list[this.history.index]
      }
    },
    forward() {
      if (this.history.index + 1 < this.history.list.length) {
        ++this.history.index
        this.chainPath = this.history.list[this.history.index]
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
