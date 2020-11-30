<template>
  <div>
    <el-table
      ref="singleTable"
      :data="transactionList"
      stripe
      fit
      highlight-current-row
      tooltip-effect="light"
      height="calc(100% - 75px)"
      @current-change="handleCurrentRowChange"
    >
      <el-table-column label="交易哈希" min-width="60px" show-overflow-tooltip>
        <template slot-scope="item">{{ item.row.txHash }}</template>
      </el-table-column>
      <el-table-column label="跨链账户" min-width="50px">
        <template slot-scope="item">{{ item.row.username }}</template>
      </el-table-column>
      <el-table-column label="区块高度" min-width="50px">
        <template slot-scope="item">{{ item.row.blockNumber }}</template>
      </el-table-column>
      <el-table-column label="资源路径" min-width="50px">
        <template slot-scope="item">{{ item.row.path }}</template>
      </el-table-column>
      <el-table-column label="调用方法" min-width="50px">
        <template slot-scope="item">{{ item.row.method }}</template>
      </el-table-column>
      <el-table-column label="交易回执" min-width="30px">
        <template slot-scope="item">
          <el-tooltip
            effect="light"
            content="点击查看交易回执详情"
            placement="top"
          >
            <el-button
              type="text"
              size="small"
              @click="handleReceiptDetails(item.row)"
            >详情</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer :visible.sync="drawer" :with-header="false">
      <el-card style="height:100%">
        <div slot="header" class="clearfix">
          <span> 交易回执详情 </span>
          <i class="el-icon-close" style="float:right;cursor:pointer" @click="drawer = false" />
        </div>
        <vue-json-pretty
          :expand-depth="2"
          :deep="3"
          boxed
          copyable
          :data="txReceipt"
          @click="handleClick"
        />
        <div />
      </el-card>
    </el-drawer>
    <!--pagination-->
    <el-row :gutter="20" style="margin-top: 10px; text-align: center">
      <el-button
        :disabled="preClickDisable"
        size="small"
        icon="el-icon-back"
        @click="handlePrevClick"
      >上一页</el-button>
      <el-button
        :disabled="nextClickDisable"
        size="small"
        icon="el-icon-right"
        @click="handleNextClick"
      >下一页</el-button>
    </el-row>
  </div>
</template>

<script>
import { listTransactions } from '@/api/transaction'
import { getTransaction } from '@/api/transaction'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

export default {
  name: 'TransactionList',
  components: {
    VueJsonPretty
  },
  props: {
    chain: {
      type: String,
      default: () => { return null }
    }},
  data() {
    return {
      chainValue: null,
      transactionList: [],
      nextOffset: 0,
      nextBlockNumber: -1,
      currentStep: 0,
      historyData: [],
      preClickDisable: true,
      nextClickDisable: false,
      drawer: false,
      txReceipt: ''
    }
  },
  watch: {
    chain: function(val) {
      this.handleSearch(val)
    }
  },
  created() {
    // this.handleFresh();
  },

  methods: {
    reset() {
      this.chainValue = null
      this.transactionList = []
      this.nextOffset = 0
      this.nextBlockNumber = -1
      this.currentStep = 0
      this.historyData = []
      this.preClickDisable = true
      this.nextClickDisable = false
    },
    handleCurrentRowChange(val) {
      if (val != null) {
        console.log('val: ' + val)
      }
    },
    handleReceiptDetails(val) {
      this.drawer = true
      this.txReceipt = val
      console.log('handleReceipt val: ' + JSON.stringify(val))
    },
    handlePrevClick() {
      console.log(' <=[pre] click, currentStep: ' + this.currentStep)
      if (this.currentStep <= 0) {
        this.$message({
          type: 'warning',
          message: '回退完毕！'
        })
      } else {
        this.currentStep = this.currentStep - 1
        this.transactionList = this.historyData[this.currentStep - 1]
      }
      this.updateDisableButtonStatus()
    },
    handleNextClick() {
      console.log(' =>[next] click, currentStep: ' + this.currentStep)
      if (this.currentStep < this.historyData.length) {
        this.transactionList = this.historyData[this.currentStep]
        this.currentStep += 1
        this.updateDisableButtonStatus()
      } else {
        this.doSearchOperation()
      }
    },
    handleSendTransaction() {
      this.$router.push({
        path: 'transaction'
      })
    },
    handleClick(row) {
      console.log('properties => ' + JSON.stringify(row))
    },
    handleSearch(chainValue) {
      this.reset()
      console.log('handleRearch => ' + JSON.stringify(chainValue))
      this.chainValue = chainValue
      this.doSearchOperation()
    },
    updateDisableButtonStatus() {
      console.log(
        ' update button status, nextBlk: ' +
          this.nextBlockNumber +
          ' currentStep: ' +
          this.currentStep +
          ' ,historyData: ' +
          this.historyData.length
      )

      // next page
      this.nextClickDisable = this.nextBlockNumber <= 0 && this.currentStep >= this.historyData.length
      // per page
      this.preClickDisable = this.currentStep <= 1
    },
    doSearchOperation() {
      if (this.chainValue === null) {
        this.$message({
          type: 'warning',
          message: '链类型为空，请选择链类型！'
        })
        return
      }

      const params = {
        path: this.chainValue,
        blockNumber: this.nextBlockNumber,
        offset: this.nextOffset,
        size: 10
      }

      listTransactions(params).then((resp) => {
        console.log(
          ' listTransactions params => ' +
            JSON.stringify(params) +
            ' ,resp => ' +
            JSON.stringify(resp)
        )

        if (typeof (resp.errorCode) === 'undefined' || resp.errorCode !== 0) {
          this.$message({
            type: 'error',
            message: '查询交易列表失败, 详情: ' + JSON.stringify(resp)
          })
          return
        }

        if (resp.data.transactions.length === 0) {
          this.$message({
            type: 'error',
            message: '查询交易列表为空，查询参数: ' + JSON.stringify(params)
          })
          return
        }

        const fetchAllTx = async function(chainValue, txHashes) {
          var txs = []

          for (const tx of txHashes) {
            if (tx.txHash === null || tx.txHash === '') {
              throw new Error(
                '交易哈希不存在，详情: ' + JSON.stringify(tx)
              )
            }

            const paramsInGetTX = {
              path: chainValue,
              txHash: tx.txHash,
              blockNumber: tx.blockNumber
            }
            const response = await getTransaction(paramsInGetTX).catch(error => {
              this.$message({
                message: '网络异常：' + error,
                type: 'error',
                duration: 5000
              })
            })
            if (typeof (response.errorCode) === 'undefined' || response.errorCode !== 0) {
              throw new Error(
                '查询交易失败，交易哈希: ' +
                  tx.txhash +
                  '，详情: ' +
                  JSON.stringify(response)
              )
            }

            txs[txs.length] = {
              txHash: response.data.txHash,
              username: response.data.username,
              blockNumber: response.data.blockNumber,
              path: response.data.path,
              method: response.data.method,
              params: { args: response.data.args, result: response.data.result },
              properties: response.data
            }
          }

          console.log(
            ' listTransactions => transactions length: ' + txs.length
          )

          return txs
        }

        fetchAllTx(this.chainValue, resp.data.transactions)
          .then((response) => {
            this.nextBlockNumber = resp.data.nextBlockNumber
            this.nextOffset = resp.data.nextOffset

            if (response.length === 0) {
              this.$message({
                type: 'error',
                message:
                  '查询交易列表为空，查询参数: ' + JSON.stringify(params)
              })
              this.updateDisableButtonStatus()
              return
            }

            this.transactionList = response
            this.historyData[this.currentStep] = response
            this.currentStep += 1

            console.log(
              ' currentStep: ' +
                this.currentStep +
                ' ,nextBlk: ' +
                this.nextBlockNumber +
                ' ,nextOffset: ' +
                this.nextOffset +
                ' ,data: ' +
                JSON.stringify(resp.data)
            )

            this.updateDisableButtonStatus()
          })
          .catch((err) => {
            console.log(' An error occurred !')
            this.$message({ type: 'error', message: err.toString() })
          })
      }).catch(error => {
        this.$message({
          message: '网络异常：' + error,
          type: 'error',
          duration: 5000
        })
      })
    }
  }
}
</script>

<style lang="scss">
.el-drawer.rtl {
  overflow-y: auto;
}
</style>
