<template>
  <div>
      <el-table
        ref="singleTable"
        :data="transactionList"
        stripe
        fit
        highlight-current-row
        tooltip-effect="light"
        @current-change="handleCurrentRowChange"
        style=" height: calc(100% - 75px); overflow-y:auto">
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
        <el-table-column label="资源路径" min-width="50px" >
          <template slot-scope="item">{{ item.row.path }}</template>
        </el-table-column>
        <el-table-column label="调用方法" min-width="50px" >
          <template slot-scope="item">{{ item.row.method }}</template>
        </el-table-column>
        <el-table-column label="交易回执" min-width="30px" >
          <template slot-scope="item">
            <el-tooltip
              class="item"
              effect="light"
              content="点击查看交易回执详情"
              placement="top"
            >
              <el-button
                @click="handleReceiptDetails(item.row)"
                type="text"
                size="small"
                >详情</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-drawer
        title="交易回执详情"
        :visible.sync="drawer"
        :with-header="true"
      >
        <vue-json-pretty
          :expand-depth="2"
          :deep="3"
          boxed
          copyable
          :data="txReceipt"
          @click="handleClick"
        ></vue-json-pretty>
        <!-- <el-input autosize type="textarea" v-model="txReceipt"> </el-input> -->
      </el-drawer>
    <!--pagination-->
    <el-row :gutter="20" style='margin-top: 10px; text-align: center'>
      <el-button
        :disabled="preClickDisable"
        size="small"
        icon="el-icon-back"
        @click="handlePrevClick"
        >上一页</el-button
      >
      <el-button
        :disabled="nextClickDisable"
        size="small"
        icon="el-icon-right"
        @click="handleNextClick"
        >下一页</el-button
      >
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
  props: ['height', 'chain'],
  watch: {
    chain: function(val) {
      this.handleSearch(val)
    }
  },
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

      // 下一页
      if (
        this.nextBlockNumber <= 0 &&
        this.currentStep >= this.historyData.length
      ) {
        this.nextClickDisable = true
      } else {
        this.nextClickDisable = false
      }

      // 上一页
      if (this.currentStep > 1) {
        this.preClickDisable = false
      } else {
        this.preClickDisable = true
      }
    },
    doSearchOperation(callback) {
      if (this.chainValue === null) {
        this.$message({
          type: 'warning',
          message: '链类型为空，请选择链类型！'
        })
        return
      }

      var params = {
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

        if (typeof resp.errorCode === undefined || resp.errorCode !== 0) {
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

          for (var idx in txHashes) {
            // console.log(" [fetchAllTx] tx hash=", txHashes[idx].txHash);
            if (txHashes[idx].txHash === null || txHashes[idx].txHash === '') {
              throw new Error(
                '交易哈希不存在，详情: ' + JSON.stringify(txHashes[idx])
              )
            }

            var params = {
              path: chainValue,
              txHash: txHashes[idx].txHash
            }

            // console.log(" [fetchAllTx] params => " + JSON.stringify(params));
            const resp = await getTransaction(params)
            // console.log(" single tx: " + JSON.stringify(resp));

            if (typeof resp.errorCode === undefined || resp.errorCode !== 0) {
              throw new Error(
                '查询交易失败，交易哈希: ' +
                  txHashes[idx].txhash +
                  '，详情: ' +
                  JSON.stringify(resp)
              )
            }

            txs[txs.length] = {
              txHash: resp.data.txHash,
              username: resp.data.username,
              blockNumber: resp.data.blockNumber,
              path: resp.data.path,
              method: resp.data.method,
              params: { args: resp.data.args, result: resp.data.result },
              properties: resp.data
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
