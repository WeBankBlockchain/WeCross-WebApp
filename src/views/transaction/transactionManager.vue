<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card style="height: 80vh">
          <div slot="header">
            <span>导航</span>
            <el-tooltip effect="light" content="如何使用？" placement="top">
              <el-button type="text" size="mini" style="margin-left: 10px;padding: 0px" @click="howToUseTransaction">
                <svg-icon style="vertical-align: 0px" icon-class="question" />
              </el-button>
            </el-tooltip>
          </div>
          <el-row style="height: calc(70vh - 20px); overflow-y:auto;padding: 10px">
            <ChainExplorer id="ChainExplorer" :chain="currentChain" @zone-click="onZoneClick" @chain-click="onChainClick" />
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
              <el-button id="sendTransaction" icon="el-icon-notebook-2" style="margin-left: 10px" type="primary" @click="handleSendTransaction">
                发交易
              </el-button>
            </div>
          </div>
          <TransactionListExplorer
            id="TransactionListExplorer"
            ref="transactionList"
            :chain="currentChain"
            :page-size="10"
            style="height: calc(80vh - 90px)"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ChainExplorer from '@/components/ChainExplorer'
import TransactionListExplorer from '@/components/TransactionListExplorer'
import { transactionManagerSteps } from './transactionSteps/transactionManagerSteps'
import introJS from 'intro.js'
import 'intro.js/introjs.css'
import 'intro.js/themes/introjs-modern.css'

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
    },
    handleSendTransaction() {
      this.$router.push({
        path: 'rawTransaction'
      })
    },
    howToUseTransaction() {
      introJS().setOptions({
        prevLabel: '上一步',
        nextLabel: '下一步',
        doneLabel: '结束',
        steps: transactionManagerSteps
      }).start()
    }
  }
}
</script>

<style lang="scss" scoped></style>
