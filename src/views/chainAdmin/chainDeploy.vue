<template>
  <div class="app-container">

    <el-row>
      <el-card class="box-card">
        <el-button-group>
          <el-button icon="el-icon-d-arrow-left" @click="back" v-bind:disabled="history.index === 0">后退</el-button>
          <el-button @click="forward" v-bind:disabled="history.index + 1 >= history.list.length">前进<i class="el-icon-d-arrow-right"></i></el-button>
        </el-button-group>
        <el-button-group style="margin-left: 10px; width:40%">
          <el-input size="large" placeholder="当前路径" prefix-icon="el-icon-folder" v-model="chainPath" readonly></el-input>
        </el-button-group>
        <el-button-group>
          <el-button icon="el-icon-upload" @click="deploy" v-bind:disabled="chainPath === ''">部署资源</el-button>
        </el-button-group>
      </el-card>
    </el-row>
    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="4">
        <el-card class="box-card">
          <ChainExplorer :chain='chainPath' @chain-click='onChainClick'></ChainExplorer>
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-card class="box-card">
          <ResourceExplorer :chain='chainPath' :pageSize=10></ResourceExplorer>
        </el-card>
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
    },
    deploy() {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
