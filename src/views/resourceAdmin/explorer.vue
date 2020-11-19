<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card style="height: 80vh;">
          <div slot="header" style="height: 2em">
            <span>导航</span>
            <el-button-group style="float: right;">
              <el-button
                  icon="el-icon-d-arrow-left"
                  @click="onBack"
                  v-bind:disabled="history.index === 0"
                  size="mini">后退</el-button>
              <el-button
                  @click="onForward"
                  v-bind:disabled="history.index + 1 >= history.list.length"
                  size="mini">前进
                <i class="el-icon-d-arrow-right"></i>
              </el-button>
            </el-button-group>
          </div>
          <ChainExplorer :chain='currentChain' @zone-click='onZoneClick' @chain-click='onChainClick'></ChainExplorer>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card style="height: 80vh">
          <div slot="header" style="height: 2em">
            <span>资源列表</span>
            <div style="float: right">
              <el-button-group style="margin-left: 10px">
                <el-input  style="width: 30em" placeholder="当前路径" prefix-icon="el-icon-folder" v-model="currentChain" readonly>
                </el-input>
              </el-button-group>
              <el-button-group>
                <el-button icon="el-icon-upload" @click="onDeploy" :disabled="currentChain === ''" style="margin-left: 10px">部署资源</el-button>
              </el-button-group>
            </div>
          </div>
          <ResourceExplorer :chain='currentChain' pageSize=10 style="height: calc(80vh - 70px)"></ResourceExplorer>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ChainExplorer from '@/components/ChainExplorer'
import ResourceExplorer from '@/components/ResourceExplorer'

export default {
  name: 'Explorer',
  components: {
    ChainExplorer,
    ResourceExplorer
  },
  /*
        beforeRouteLeave(to, from, next) {
          cached = this.$data

          next()
        },
        */
  props: {},
  data() {
    return {
      currentZone: '',
      currentChain: '',
      currentChainData: {},
      searchPath: '',
      history: {
        index: 0,
        list: []
      }
    }
  },
  mounted() {},
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
    onDeploy(path, stubType) {
      console.log('deploy: ' + this.currentChain + ' ' + this.currentChainData.type)
      this.$router.push({
        path: 'resourceDeploy',
        query: {
          path: this.currentChain,
          stubType: this.currentChainData.type
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
