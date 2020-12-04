<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card style="height: 80vh;">
          <div slot="header">
            <span>导航</span>
          </div>
          <el-row style="height: calc(70vh - 20px); overflow-y:auto; padding: 10px;">
            <ChainExplorer :chain="currentChain" @zone-click="onZoneClick" @chain-click="onChainClick" />
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card style="height: 80vh">
          <div slot="header">
            <span>资源列表</span>
            <div style="float: right; margin-top: -10px">
              <el-input v-model="currentChain" style="width: 30vw;" placeholder="当前路径" prefix-icon="el-icon-folder" readonly>
                <template slot="prepend">
                  <el-button icon="el-icon-refresh" size="mini" @click="() => {if(typeof currentChain !== 'undefined'){$refs['ResourceExplorer'].refresh()}}" />
                </template>
              </el-input>
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
      searchPath: null
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
