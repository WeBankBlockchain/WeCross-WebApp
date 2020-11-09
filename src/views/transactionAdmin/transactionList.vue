<template>
  <div class="app-container">
    <div class="mixin-components-container">
      <el-row>
        <el-card class="box-card">
          <span>交易列表</span>
        </el-card>
      </el-row>
    </div>
    <el-row style="margin-top:10px;">
      <el-card>
        <el-row :gutter="18" style="margin-top:10px;">
          <el-col :span="12">
            <el-select
              placeholder="zone.chain"
              size="medium"
              v-model="chainValue"
              style="width: 100%; margin: 2px;"
            >
              <el-option
                v-for="chain in chainType"
                :key="chain"
                :label="chain"
                :value="chain"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-button
              type="primary"
              plain
              icon="el-icon-search"
              @click="handleSearch"
              >搜索</el-button
            >
            <el-button
              type="primary"
              plain
              icon="el-icon-edit"
              @click="handleFresh"
              >刷新</el-button
            >
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:10px;">
          <el-table
            ref="singleTable"
            :data="transactionList"
            element-loading-text="加载中..."
            stripe
            fit
            highlight-current-row
            @current-change="handleCurrentRowChange"
            style="width: 100%"
          >
            <el-table-column label="交易哈希" min-width="100" align="center">
              <template slot-scope="item">
                {{ item.row.txHash }}
              </template>
            </el-table-column>
            <el-table-column label="块高" min-width="15" align="center">
              <template slot-scope="item">
                {{ item.row.blockNumber }}
              </template>
            </el-table-column>
            <el-table-column label="资源路径" min-width="40" align="center">
              <template slot-scope="item">
                {{ item.row.path }}
              </template>
            </el-table-column>
            <el-table-column label="方法" min-width="30" align="center">
              <template slot-scope="item">
                {{ item.row.method }}
              </template>
            </el-table-column>
            <el-table-column label="参数" min-width="50" align="center">
              <template slot-scope="item">
                <li
                  style="list-style-type:none"
                  v-for="(propItem, propName) in item.row.params"
                >
                  {{ propName }}:{{ propItem }}
                </li>
              </template>
            </el-table-column>
            <el-table-column label="交易回执" min-width="50" align="center">
              <template slot-scope="item">
                <el-button
                  @click="handleClick(item.row)"
                  type="text"
                  size="small"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <!--pagination-->
        <el-row :gutter="20" style="margin-top: 20px;text-align: center;">
          <el-button
            :disabled="preClickDisable"
            size="small"
            type="primary"
            plain
            icon="el-icon-back"
            @click="handlePrevClick"
            >上一页</el-button
          >
          <el-button
            :disabled="nextClickDisable"
            size="small"
            type="primary"
            plain
            icon="el-icon-right"
            @click="handleNextClick"
            >下一页</el-button
          >
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { uniqueFilter } from '@/utils'
import { listChains } from '@/api/conn'
import { listTransactions } from '@/api/transaction'
import { getTransaction } from '@/api/transaction'

export default {
  name: 'TransactionList',
  data() {
    return {
      transactionList: [],
      chainList: [],
      chainTotalCount: 0,
      chainType: [],
      chainValue: null,
      nextOffset: 0,
      nextBlockNumber: -1,
      currentStep: 0,
      historyData: [],
      preClickDisable: true,
      nextClickDisable: false
    }
  },
  created() {
    this.handleFresh()
  },

  methods: {
    resetAllData() {
      this.chainList = []
      this.chainType = []
      this.chainValue = null
      this.chainTotalCount = 0

      this.transactionList = []
      this.nextOffset = 0
      this.nextBlockNumber = -1
      this.currentStep = 0
      this.historyData = []
      this.preClickDisable = true
      this.nextClickDisable = false
    },
    resetTransactionData() {
      this.transactionList = []
      this.nextOffset = 0
      this.nextBlockNumber = -1
      this.currentStep = 0
      this.historyData = []
      this.preClickDisable = true
      this.nextClickDisable = false
    },
    refreshChainList(callback) {
      listChains({ offset: 0, size: 10 }).then((resp) => {
        // console.log("chain list: " + JSON.stringify(resp));
        this.chainList = resp.data.data
        this.chainTotalCount = resp.data.size
        for (const chainListKey of this.chainList) {
          this.chainType.push(chainListKey.zone + '.' + chainListKey.chain)
        }
        this.chainType = this.chainType.filter(uniqueFilter).sort()
        console.log(
          ' chainCount => ' +
            this.chainTotalCount +
            ',chainType => ' +
            JSON.stringify(this.chainType)
        )
        if (typeof this.chainType !== undefined && this.chainType.length > 0) {
          this.chainValue = this.chainType[0]
          console.log(' current chainValue => ' + this.chainValue)
          if (callback !== null && callback !== undefined) {
            callback()
          }
        } else {
          this.$message({
            type: 'warning',
            message: '链类型列表为空!'
          })
          this.chainValue = null
        }
      })
    },
    handleCurrentRowChange(val) {
      if (val != null) {
        console.log('val: ' + val)
      }
    },
    handlePrevClick() {
      console.log(' <=[pre] click, currentStep: ' + this.currentStep)
      if (this.currentStep <= 1) {
        this.$message({
          type: 'warning',
          message: '历史记录显示完毕'
        })
      } else {
        this.currentStep = this.currentStep - 1
        this.transactionList = this.historyData[this.currentStep]
      }
      this.updateDisableButtonStatus()
    },
    handleNextClick() {
      console.log(' =>[next] click, currentStep: ' + this.currentStep)
      if (this.currentStep + 1 < this.historyData.length) {
        this.currentStep += 1
        this.transactionList = this.historyData[this.currentStep]
        this.updateDisableButtonStatus()
      } else {
        this.doSearchOperation(this.updateDisableButtonStatus())
      }
    },
    handleFresh() {
      this.resetAllData()
      this.refreshChainList(this.handleSearch)
    },
    handleClick(row) {
      console.log('properties => ' + JSON.stringify(row))
    },
    handleSearch() {
      this.resetTransactionData()
      this.doSearchOperation()
    },
    updateDisableButtonStatus() {
      console.log(
        ' setButton status, nextBlk: ' +
          this.nextBlockNumber +
          ' currentStep: ' +
          this.currentStep +
          ' ,historyData: ' +
          this.historyData.length
      )

      // 上一页
      if (this.nextBlockNumber === -1) {
        this.nextClickDisable = true
      } else {
        this.nextClickDisable = false
      }

      // 下一页
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
          message: '链类型为空，请选择链类型'
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
        console.log('[listTransactions] resp => ' + JSON.stringify(resp))

        if (typeof resp.errorCode === undefined || resp.errorCode !== 0) {
          this.$message({
            type: 'error',
            message: '查询交易列表失败, 详情: ' + JSON.stringify(resp)
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
              blockNumber: resp.data.blockNumber,
              path: resp.data.path,
              method: resp.data.method,
              params: { args: resp.data.args, result: resp.data.result },
              properties: resp.data
            }
          }
          console.log(' fetch all total txs: ' + txs.length)

          return txs
        }

        fetchAllTx(this.chainValue, resp.data.transactions)
          .then((response) => {
            this.transactionList = response
            this.nextBlockNumber = resp.data.nextBlockNumber
            this.nextOffset = resp.data.nextOffset
            this.historyData[this.currentStep] = response
            this.currentStep += 1
            if (callback !== null && callback !== undefined) {
              console.log(' ====>>>> callback => ' + callback)
              callback()
            }
            console.log(
              ' currentStep: ' +
                this.currentStep +
                ' ,nextBlk: ' +
                this.nextBlockNumber +
                ' ,nextOffset: ' +
                this.nextOffset +
                ' ,data: ' +
                this.transactionList
            )
          })
          .catch((err) => {
            this.$message({ type: 'error', message: err.toString() })
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
