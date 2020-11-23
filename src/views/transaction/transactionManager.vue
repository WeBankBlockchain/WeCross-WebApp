<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card style="height: 80vh">
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
              >后退
              </el-button>
              <el-button
                :disabled="history.index + 1 >= history.list.length"
                size="mini"
                @click="onForward"
              >前进
                <i class="el-icon-d-arrow-right" />
              </el-button>
            </el-button-group>
          </el-row>
          <el-row style="margin-top: 10px; height: calc(70vh - 30px); overflow-y:auto;padding: 10px">
            <ChainExplorer :chain="currentChain" @zone-click="onZoneClick" @chain-click="onChainClick" />
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card style="height: 80vh">
          <div slot="header">
            <span>交易列表</span>
            <div style="float: right; margin-top: -10px">
              <el-input v-model="currentChain" style="width: 30vw" placeholder="当前路径" prefix-icon="el-icon-folder" readonly />
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
