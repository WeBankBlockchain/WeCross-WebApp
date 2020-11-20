<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="5">
        <el-card style="height: 80vh">
          <div slot="header" style="height: 2em">
            <span>导航</span>
            <el-button-group style="float: right">
              <el-button icon="el-icon-d-arrow-left" @click="onBack" v-bind:disabled="history.index === 0">后退
              </el-button>
              <el-button @click="onForward" v-bind:disabled="history.index + 1 >= history.list.length">
                前进
                <i class="el-icon-d-arrow-right"></i>
              </el-button>
            </el-button-group>
          </div>
          <div style="height: 79vh; overflow: auto">
            <ChainExplorer :chain="currentChain" @zone-click="onZoneClick" @chain-click="onChainClick"></ChainExplorer>
          </div>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card style="height: 80vh">
          <div slot="header" style="height: 2em">
            <span>交易列表</span>
            <div style="float: right">
                <el-input style="width: 30em" placeholder="当前路径" prefix-icon="el-icon-folder" v-model="currentChain" readonly></el-input>
                <el-button icon="el-icon-notebook-2" @click="handleSendTransaction" style="margin-left: 10px" type="primary">
                  发交易
                </el-button>
            </div>
          </div>
          <TransactionListExplorer
              ref="transactionList"
              :chain="currentChain"
              :pageSize="10"
              style="height: calc(80vh - 70px)"></TransactionListExplorer>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ChainExplorer from '@/components/ChainExplorer'
import TransactionListExplorer from '@/components/TransactionListExplorer'

export default {
  name: 'TransactionManager',
  components: {
    ChainExplorer,
    TransactionListExplorer
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
  mounted() {
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
    handleSearch() {
      this.$refs['transactionList'].handleSearch(
        this.currentChain,
        this.currentChainData.type
      )
      console.log(
        'research: ' + this.currentChain + ' ' + this.currentChainData.type
      )
    },
    handleSendTransaction() {
      this.$router.push({
        path: 'rawTransaction'
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
