<template>
  <div>
    <el-table
      ref="singleTable"
      v-loading="buttonState.loading"
      :data="transactionList"
      stripe
      fit
      tooltip-effect="light"
      height="calc(100% - 75px)"
    >
      <el-table-column label="交易哈希" min-width="40px" show-overflow-tooltip>
        <template slot-scope="item">{{ item.row.txHash }}</template>
      </el-table-column>
      <el-table-column label="跨链账户" min-width="30px" show-overflow-tooltip>
        <template slot-scope="item">
          <div v-if="item.row.username === 'unknown'">
            <el-popover trigger="hover" placement="top">
              <p>注意: {{ item.row.txHash }} 非WeCross交易</p>
              <div slot="reference">
                <el-tag type="info" effect="plain">{{
                  item.row.username
                }}</el-tag>
              </div>
            </el-popover>
          </div>
          <div v-else>
            {{ item.row.username }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="事务ID" min-width="30px" show-overflow-tooltip>
        <template slot-scope="item">
          <div v-if="item.row.txID === 'unknown'">
            <el-popover trigger="hover" placement="top">
              <p>注意: {{ item.row.txHash }} 非WeCross交易</p>
              <div slot="reference">
                <el-tag type="info" effect="plain">{{ item.row.txID }}</el-tag>
              </div>
            </el-popover>
          </div>
          <div v-else>
            {{ item.row.txID }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="区块高度" min-width="30px">
        <template slot-scope="item">
          <div v-if="item.row.blockNumber === 'unknown'">
            <el-popover trigger="hover" placement="top">
              <p>注意: {{ item.row.txHash }} 非WeCross交易</p>
              <div slot="reference">
                <el-tag type="info" effect="plain">{{
                  item.row.blockNumber
                }}</el-tag>
              </div>
            </el-popover>
          </div>
          <div v-else>
            {{ item.row.blockNumber }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="资源路径" min-width="40px" show-overflow-tooltip>
        <template slot-scope="item">
          <div v-if="item.row.path === 'unknown'">
            <el-popover trigger="hover" placement="top">
              <p>注意: {{ item.row.txHash }} 非WeCross交易</p>
              <div slot="reference">
                <el-tag type="info" effect="plain">{{ item.row.path }}</el-tag>
              </div>
            </el-popover>
          </div>
          <div v-else>
            {{ item.row.path }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="调用方法" min-width="40px" show-overflow-tooltip>
        <template slot-scope="item">
          <div v-if="item.row.method === 'unknown'">
            <el-popover trigger="hover" placement="top">
              <p>注意: {{ item.row.txHash }} 非WeCross交易</p>
              <div slot="reference">
                <el-tag type="info" effect="plain">{{
                  item.row.method
                }}</el-tag>
              </div>
            </el-popover>
          </div>
          <div v-else>
            {{ item.row.method }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="回执" min-width="20px">
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
          <i
            class="el-icon-close"
            style="float:right;cursor:pointer"
            @click="drawer = false"
          />
        </div>
        <div class="json_css">
          <vue-json-pretty
            :expand-depth="2"
            :deep="3"
            show-length
            copyable
            :data="txReceipt"
            @click="handleClick"
          />
        </div>
        <div />
      </el-card>
    </el-drawer>
    <!--pagination-->
    <el-row :gutter="20" style="margin-top: 10px; text-align: center">
      <el-button
        :disabled="buttonState.disablePreClick"
        :loading="buttonState.loading"
        size="small"
        icon="el-icon-back"
        @click="handlePrevClick"
      >上一页</el-button>
      <el-button
        :disabled="buttonState.disableNextClick"
        :loading="buttonState.loading"
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
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      buttonState: {
        loading: false,
        disablePreClick: true,
        disableNextClick: false
      },
      chainValue: null,
      transactionList: [],
      nextOffset: 0,
      nextBlockNumber: -1,
      currentStep: 0,
      historyData: [],
      drawer: false,
      txReceipt: '',
      controlVersion: 0
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
      this.transactionList = []
      this.nextOffset = 0
      this.nextBlockNumber = -1
      this.currentStep = 0
      this.historyData = []
      this.buttonState.disablePreClick = true
      this.buttonState.disableNextClick = false
    },
    handleReceiptDetails(val) {
      this.drawer = true
      this.txReceipt = val
    },
    handlePrevClick() {
      if (this.currentStep <= 0) {
        this.$message({
          type: 'warning',
          message: '回退完毕！'
        })
      } else {
        this.currentStep = this.currentStep - 1
        this.transactionList = this.historyData[this.currentStep - 1]
      }
      this.updateButtonStatus()
    },
    handleNextClick() {
      if (this.currentStep < this.historyData.length) {
        this.transactionList = this.historyData[this.currentStep]
        this.currentStep += 1
        this.updateButtonStatus()
      } else {
        this.updateTransactionListForm(this.controlVersion, this.chainValue)
      }
    },
    handleSendTransaction() {
      this.$router.push({
        path: 'transaction'
      })
    },
    handleClick(row) {
    },
    handleSearch(chainValue) {
      this.reset()
      this.controlVersion = this.controlVersion + 1
      this.chainValue = chainValue
      this.updateTransactionListForm(this.controlVersion, chainValue)
    },
    updateButtonStatus() {
      this.buttonState.loading = false
      // next page
      this.buttonState.disableNextClick =
        this.nextBlockNumber <= 0 &&
        this.currentStep >= this.historyData.length
      // pre page
      this.buttonState.disablePreClick = this.currentStep <= 1
    },
    updateTransactionListForm(version, chainValue) {
      if (chainValue === null) {
        this.$message({
          type: 'warning',
          message: '链类型为空，请选择链类型！'
        })
        return
      }

      const params = {
        path: chainValue,
        blockNumber: this.nextBlockNumber,
        offset: this.nextOffset,
        size: 10
      }

      this.buttonState.loading = true
      listTransactions(params)
        .then((resp) => {
          if (typeof resp.errorCode === 'undefined' || resp.errorCode !== 0) {
            this.$message({
              type: 'error',
              message:
                '查询交易列表失败, 请手动刷新后再尝试, 详情: ' +
                JSON.stringify(resp)
            })
            this.buttonState.loading = false
            return
          }

          const fetchAllTx = async function(chainValue, txHashes) {
            var txs = []

            if (txHashes.length === 0) {
              return txs
            }

            for (const tx of txHashes) {
              if (tx.txHash === null || tx.txHash === '') {
                throw new Error('交易哈希不存在，详情: ' + JSON.stringify(tx))
              }

              const paramsInGetTX = {
                path: chainValue,
                txHash: tx.txHash,
                blockNumber: tx.blockNumber
              }
              const response = await getTransaction(paramsInGetTX).catch(
                (error) => {
                  this.$message({
                    message: '网络异常：' + error,
                    type: 'error',
                    duration: 5000
                  })
                }
              )
              if (
                typeof response.errorCode === 'undefined' ||
                response.errorCode !== 0
              ) {
                throw new Error(
                  '查询交易失败，交易哈希: ' +
                    tx.txhash +
                    '，详情: ' +
                    JSON.stringify(response)
                )
              }
              if (
                typeof response.errorCode === 'undefined' ||
                response.errorCode !== 0
              ) {
                throw new Error(
                  '查询交易失败，交易哈希: ' +
                    tx.txhash +
                    '，详情: ' +
                    JSON.stringify(response)
                )
              }

              /**
              remove raw transaction and receipt info
              */
              delete response.data.txBytes
              delete response.data.receiptBytes

              const defaultValue = (value, defaultValue) => {
                if (typeof value === 'undefined' || value === null) {
                  return defaultValue
                }
                return value
              }

              txs[txs.length] = {
                txHash: defaultValue(response.data.txHash, 'unknown'),
                username: defaultValue(response.data.username, 'unknown'),
                txID: defaultValue(response.data.xaTransactionID, 'unknown'),
                blockNumber: defaultValue(response.data.blockNumber, 'unknown'),
                path: defaultValue(response.data.path, 'unknown'),
                method: defaultValue(response.data.method, 'unknown'),
                properties: defaultValue(response.data, 'unknown')
              }
            }

            return txs
          }

          fetchAllTx(chainValue, resp.data.transactions)
            .then((response) => {
              this.buttonState.loading = false
              this.nextBlockNumber = resp.data.nextBlockNumber
              this.nextOffset = resp.data.nextOffset

              if (response.length === 0) {
                this.$message({
                  type: 'info',
                  message: '交易列表为空，已查询至数据末尾'
                })
                this.updateButtonStatus()
                return
              }

              if (this.controlVersion !== version) {
                return
              }

              this.transactionList = response
              this.historyData[this.currentStep] = response
              this.currentStep += 1

              this.updateButtonStatus()
            })
            .catch((err) => {
              this.buttonState.loading = false
              this.$message({ type: 'error', message: err.toString() })
            })
        })
        .catch((error) => {
          this.buttonState.loading = false
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
  overflow-y: scroll;
}

.json_css {
  width: autosize;
  height: autosize;
  word-break: break-all;
}
</style>
