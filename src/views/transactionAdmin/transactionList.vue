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
            element-loading-text="Loading"
            stripe
            fit
            highlight-current-row
            @current-change="handleCurrentRowChange"
            style="width: 100%"
          >
            <el-table-column
              fixed
              prop="txHash"
              label="交易哈希"
              min-width="130"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="blockNumber"
              label="块高"
              min-width="130"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="path"
              label="资源路径"
              min-width="130"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="time"
              label="时间"
              min-width="130"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="properties"
              label="更多属性"
              min-width="130"
              align="center"
            >
            </el-table-column>
          </el-table>
        </el-row>
        <!--pagination-->
        <el-row :gutter="20" style="margin-top: 20px;text-align: center;">
          <el-pagination
            @current-change="handleCurrentPageChange"
            :current-page="currentPage"
            layout="prev, pager, next"
          ></el-pagination>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { uniqueFilter } from '@/utils'
import { listChains } from '@/api/conn'
import { listTransactions } from '@/api/transaction'

export default {
  name: 'TransactionList',
  data() {
    return {
      transactionList: [],
      chainList: [],
      currentPage: 1,
      offset: 0,
      chainType: [],
      chainValue: null,
      blockNumber: -1
    }
  },
  created() {
    this.handleFresh()
  },

  methods: {
    resetAllData() {
      this.transactionList = []
      this.chainList = []
      this.currentPage = 1
      this.offset = 0
      this.chainType = []
      this.chainValue = null
      this.blockNumber = -1
      console.log(' == > reset all data')
    },
    refreshChainList(callback) {
      listChains().then((resp) => {
        // console.log("chain list: " + JSON.stringify(resp));
        this.chainList = resp.data.chains
        for (const chainListKey of this.chainList) {
          this.chainType.push(chainListKey.path)
        }
        this.chainType = this.chainType.filter(uniqueFilter).sort()
        console.log('chainType => ' + JSON.stringify(this.chainType))
        if (typeof this.chainType !== undefined && this.chainType.length > 0) {
          this.chainValue = this.chainType[0]
          console.log('chainValue => ' + this.chainValue)
        } else {
          this.$message({
            type: 'warning',
            message: '链类型列表为空!'
          })
          this.chainValue = null
        }

        if (callback !== null) {
          console.log('==> callback')
          callback()
        }
      })
    },
    handleCurrentRowChange(val) {
      if (val != null) {
        console.log('val: ' + val)
      }
    },
    handleFresh() {
      // this.$refs.singleTable.setCurrentRow(null);
      this.resetAllData()
      this.refreshChainList(this.handleSearch)
    },
    handleCurrentPageChange(currentPage) {
      this.handleSearch()
      console.log('===>>' + this.currentPage)
    },
    handleSearch() {
      if (this.chainValue === null) {
        this.$message({
          type: 'warning',
          message: '链类型为空，请选择链类型'
        })
        return
      }

      console.log('chain: ' + this.chainValue + ' ,offset: ' + this.offset)

      var params = {
        chain: this.chainValue,
        blockNumber: this.blockNumber,
        offset: this.offset,
        size: 10
      }

      listTransactions(params).then((resp) => {
        // console.log("resp: " + JSON.stringify(resp));
        if (typeof resp.errorCode === undefined || resp.errorCode !== 0) {
          this.$message({
            type: 'error',
            message: '查询交易列表失败, 错误信息: ' + JSON.stringify(resp)
          })
          return
        }

        var blk = resp.data.nextBlockNumber
        var offset = resp.data.nextOffset
        var txs = resp.data.transactions

        this.blockNumber = blk
        this.offset = offset
        this.transactionList = txs

        console.log(
          'transactionList => ' + JSON.stringify(this.transactionList)
        )

        console.log(
          'blk: ' +
            this.blockNumber +
            ' ,offset: ' +
            this.offset +
            ' ,transactionList size: ' +
            this.transactionList.length
        )
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
