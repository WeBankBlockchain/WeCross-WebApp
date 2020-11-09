<template>
  <div>
    <el-table ref="singleTable" :data="transactions" element-loading-text="加载中..." fit highlight-current-row>
      <el-table-column fixed prop="txHash" label="交易哈希">
      </el-table-column>
      <el-table-column prop="blockNumber" label="块高">
      </el-table-column>
      <el-table-column prop="path" label="资源路径">
      </el-table-column>
      <el-table-column prop="time" label="时间">
      </el-table-column>
      <el-table-column prop="properties" label="更多属性">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {
  listTransactions
} from '@/api/transaction'

export default {
  name: 'TransactionExplorer',
  props: ['chain'],
  data: function() {
    return {
      transactions: [],
      resourceTotal: 0,
      queryStatus: {}
    }
  },
  methods: {
    getQueryStatus(path) {
      var status = this.queryStatus[path]
      if (status === undefined) {
        this.queryStatus[path] = {
          transactionIndex: 0,
          transactionSteps: [{
            offset: 0,
            blockNumber: -1
          }]
        }

        status = this.queryStatus[path]
      }

      return status
    },
    refreshTransaction() {
      var path = this.chain
      var status = this.getQueryStatus(path)

      listTransactions({
        // status.transactionSteps[status.transactionIndex]
      }).then((response) => {
        if (typeof response.errorCode === undefined || response.errorCode !== 0) {
          this.$message({
            type: 'error',
            message: '查询交易列表失败, errorCode: ' + response.errorCode
          })
          return
        }

        if (!(response.data.nextOffset === -1 || response.data.nextBlockNumber === -1)) {
          status.transactionSteps.push({
            offset: response.data.nextOffset,
            blockNumber: response.data.nextBlockNumber
          })
        }

        this.transactions = response.data.transactions
      }).catch((error) => {
        console.log(error)

        this.$message({
          type: 'error',
          message: '网络异常'
        })
      })
    }
  }
}
</script>

<style>
</style>
