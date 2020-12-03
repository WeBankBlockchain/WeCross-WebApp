<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card style="height: 80vh">
          <div slot="header">
            <span>导航</span>
          </div>
          <el-row style="height: calc(70vh - 20px); overflow-y:auto;padding: 10px">
            <ChainExplorer :chain="currentChain" @zone-click="onZoneClick" @chain-click="onChainClick" />
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card style="height: 80vh">
          <div slot="header">
            <span>交易列表</span>
            <div style="float: right; margin-top: -10px">
              <el-input v-model="currentChain" style="width: 30vw" placeholder="当前路径" prefix-icon="el-icon-folder" readonly>
                <template slot="prepend">
                  <el-button icon="el-icon-refresh" size="mini" @click="handleSearch" />
                </template>
              </el-input>
              <el-button icon="el-icon-notebook-2" style="margin-left: 10px" type="primary" @click="handleSendTransaction">
                发交易
              </el-button>
            </div>
          </div>
          <TransactionListExplorer
            ref="transactionList"
            :chain="currentChain"
            :page-size="10"
            style="height: calc(80vh - 70px)"
          />
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
  props: {},
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (vm.currentChain !== null) {
        vm.$refs.transactionList.handleSearch(vm.currentChain)
      }
    })
  },
  data() {
    return {
      currentZone: null,
      currentChain: null,
      currentChainData: {},
      searchPath: null
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
      }
    },
    handleSearch() {
      if (this.currentChain === null || this.currentChainData === null) {
        return
      }
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
