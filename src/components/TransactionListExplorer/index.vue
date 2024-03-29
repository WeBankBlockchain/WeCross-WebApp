<template>
  <div>
    <el-table
      ref="singleTable"
      v-loading="buttonState.loading"
      :data="transactionList"
      stripe
      fit
      tooltip-effect="light"
      height="calc(100% - 55px)"
    >
      <el-table-column label="交易哈希" min-width="40px" show-overflow-tooltip>
        <template slot-scope="item">
          <clipboard :input-data="item.row.txHash" style="float: left;margin-right: 5px" />
          {{ item.row.txHash }}
        </template>
      </el-table-column>
      <el-table-column label="跨链账户" min-width="30px" show-overflow-tooltip>
        <template slot-scope="item">
          <div v-if="item.row.username === 'unknown'">
            <el-popover trigger="hover" placement="top">
              <p>注意: {{ limitString(item.row.txHash) }} 非WeCross交易</p>
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
              <p>注意: {{ limitString(item.row.txHash) }} 非WeCross交易</p>
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
              <p>注意: {{ limitString(item.row.txHash) }} 非WeCross交易</p>
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
      <el-table-column label="资源路径" min-width="50px" show-overflow-tooltip>
        <template slot-scope="item">
          <div v-if="item.row.path === 'unknown'">
            <el-popover trigger="hover" placement="top">
              <p>注意: {{ limitString(item.row.txHash) }} 非WeCross交易</p>
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
              <p>注意: {{ limitString(item.row.txHash) }} 非WeCross交易</p>
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
          <el-popover
            width="600"
            trigger="click"
          >
            <div class="el-popover__title">
              交易回执详情
              <clipboard :input-data="JSON.stringify(txReceipt)" style="float:right;" />
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
            <el-tooltip
              slot="reference"
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
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
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
import Clipboard from '@/components/Clipboard/index'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import { handleErrorMsgBox } from '@/utils/messageBox'
import { limitString } from '@/utils'

export default {
  name: 'TransactionList',
  components: {
    VueJsonPretty,
    Clipboard
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
    limitString(str) {
      return limitString(str, 10)
    },
    reset() {
      this.transactionList = []
      this.nextOffset = 0
      this.nextBlockNumber = -1
      this.currentStep = 0
      this.historyData = []
      this.buttonState.disablePreClick = true
      this.buttonState.disableNextClick = false
    },
    async handleReceiptDetails(val) {
      if (typeof val.properties.byProxy !== 'undefined') {
        this.txReceipt = val
        return
      }
      const response = await getTransaction({
        path: this.chainValue,
        txHash: val.txHash,
        blockNumber: val.blockNumber
      }).catch(
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
              val.txHash +
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
            val.txHash +
            '，详情: ' +
            JSON.stringify(response)
        )
      }
      var tx = response.data
      this.txReceipt = response.data
      this.txHash = tx.txHash
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
        this.controlVersion = this.controlVersion + 1
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
    async fetchAllTx(chainValue, txHashes) {
      var txs = []

      if (txHashes.length === 0) {
        return txs
      }

      for (const tx of txHashes) {
        if (!tx.txHash) {
          throw new Error('交易哈希不存在，详情: ' + JSON.stringify(tx))
        }

        const response = await getTransaction({
          path: chainValue,
          txHash: tx.txHash,
          blockNumber: tx.blockNumber
        }).catch(
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
          if (value === 0) {
            return value
          }
          if (!value) {
            return defaultValue
          }
          return value
        }

        var newTx = {}
        newTx.txHash = defaultValue(response.data.txHash, 'unknown')
        newTx.username = defaultValue(response.data.username, 'unknown')
        newTx.txID = defaultValue(response.data.xaTransactionID, 'unknown')
        newTx.blockNumber = defaultValue(response.data.blockNumber, 'unknown')
        newTx.path = defaultValue(response.data.path, 'unknown')
        newTx.method = defaultValue(response.data.method, 'unknown')
        newTx.properties = defaultValue(response.data, 'unknown')

        if (typeof response.data.errorCode !== 'undefined' && response.data.errorCode !== null && response.data.errorCode !== 0) {
          newTx.errorCode = response.data.errorCode
          newTx.message = defaultValue(response.data.message, 'unknown')
        }
        txs[txs.length] = newTx
      }

      return txs
    },
    async updateTransactionListForm(version, chainValue) {
      if (chainValue === null) {
        this.$message({
          type: 'warning',
          message: '链类型为空，请选择链类型！'
        })
        return
      }

      this.buttonState.loading = true
      await listTransactions({
        path: chainValue,
        blockNumber: this.nextBlockNumber,
        offset: this.nextOffset,
        size: 10
      })
        .then((resp) => {
          if (typeof resp.errorCode === 'undefined' || resp.errorCode !== 0) {
            handleErrorMsgBox('查询交易列表失败, 请手动刷新后再尝试, 详情: ', '错误', JSON.stringify(resp), null)
            this.buttonState.loading = false
            return
          }
          if (resp.data.transactions.length === 0 && resp.data.transactionWithDetails === 0) {
            this.$message({
              type: 'info',
              message: '交易列表为空，已查询至数据末尾'
            })
            this.updateButtonStatus()
            return
          }
          if (resp.data.transactionWithDetails.length !== 0) {
            this.buttonState.loading = false
            this.nextBlockNumber = resp.data.nextBlockNumber
            this.nextOffset = resp.data.nextOffset
            var txs = []
            if (resp.data.transactionWithDetails.length === 0) {
              return txs
            }
            const defaultValue = (value, defaultValue) => {
              if (value === 0) {
                return value
              }
              if (!value) {
                return defaultValue
              }
              return value
            }
            if (this.controlVersion !== version) {
              return
            }
            for (const tx of resp.data.transactionWithDetails) {
              var newTx = {}
              newTx.txHash = defaultValue(tx.txHash, 'unknown')
              newTx.username = defaultValue(tx.username, 'unknown')
              newTx.txID = defaultValue(tx.xaTransactionID, 'unknown')
              newTx.blockNumber = defaultValue(tx.blockNumber, 'unknown')
              newTx.path = defaultValue(tx.path, 'unknown')
              newTx.method = defaultValue(tx.method, 'unknown')
              newTx.properties = defaultValue(tx.properties, 'unknown')
              txs[txs.length] = newTx
            }
            this.transactionList = txs
            this.historyData[this.currentStep] = txs
            this.currentStep += 1
            this.updateButtonStatus()
          }
          if (resp.data.transactions.length !== 0) {
            this.fetchAllTx(chainValue, resp.data.transactions)
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
          }
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
.vjs-key {
  color: #BC2C10;
}
.vjs-tree {
  .vjs-value__string {
    color: #458385;
  }
  .vjs-value__number {
    color: #9D2DA7;
  }
  .vjs-value__null {
    color: #fb030d;
  }
}

.json_css {
  width: autosize;
  height: 250px;
  overflow-y: auto;
  word-break: break-all;
}
</style>
