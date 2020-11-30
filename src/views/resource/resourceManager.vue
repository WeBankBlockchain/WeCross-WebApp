<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card style="height: 80vh;">
          <div slot="header">
            <span>导航</span>
          </div>
          <el-row>
            <el-button-group>
              <el-button
                icon="el-icon-d-arrow-left"
                :disabled="history.index === 0"
                size="mini"
                @click="onBack"
              >后退</el-button>
              <el-button
                :disabled="history.index + 1 >= history.list.length"
                size="mini"
                @click="onForward"
              >前进
                <i class="el-icon-d-arrow-right" />
              </el-button>
            </el-button-group>
          </el-row>
          <el-row style="margin-top: 10px; height: calc(70vh - 30px); overflow-y:auto; padding: 10px;">
            <ChainExplorer :chain="currentChain" @zone-click="onZoneClick" @chain-click="onChainClick" />
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card style="height: 80vh">
          <div slot="header">
            <span>资源列表</span>
            <div style="float: right; margin-top: -10px">
              <el-input v-model="currentChain" style="width: 30vw;" placeholder="当前路径" prefix-icon="el-icon-folder" readonly />
              <el-button slot="append" icon="el-icon-upload" type="primary" style="margin-left: 10px;" @click="onDeploy">部署资源</el-button>
            </div>
          </div>
          <ResourceExplorer ref="ResourceExplorer" :chain="currentChain" :page-size="10" style="height: calc(80vh - 70px)" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ChainExplorer from '@/components/ChainExplorer'
import ResourceExplorer from '@/components/ResourceExplorer'

export default {
  name: 'ResourceManager',
  components: {
    ChainExplorer,
    ResourceExplorer
  },
  props: {},
  data() {
    return {
      currentZone: undefined,
      currentChain: undefined,
      currentChainData: {},
      searchPath: null,
      history: {
        index: 0,
        list: []
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (typeof vm.currentChain !== 'undefined' && vm.currentChain !== null) {
        vm.$refs.ResourceExplorer.refresh()
      }
    })
  },
  methods: {
    onZoneClick(path) {
      if (this.currentZone !== path) {
        this.currentZone = path
      }
    },
    onChainClick(path, data) {
      if (this.currentChain !== path) {
        this.currentChain = path
        this.currentChainData = data
        this.currentZone = path.split('.')[0]
        this.history.list.push(path)
        this.history.index = this.history.list.length - 1
      }
    },
    onBack() {
      if (this.history.index > 0) {
        --this.history.index
        this.currentChain = this.history.list[this.history.index]
      }
    },
    onForward() {
      if (this.history.index + 1 < this.history.list.length) {
        ++this.history.index
        this.currentChain = this.history.list[this.history.index]
      }
    },
    onDeploy() {
      console.log('deploy: ' + this.currentChain + ' ' + this.currentChainData.type)
      this.$router.push({
        path: 'resourceDeployment',
        query: {
          stubType: this.currentChainData.type,
          path: this.currentChain
        }
      })
    },
    onAddChain() {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
