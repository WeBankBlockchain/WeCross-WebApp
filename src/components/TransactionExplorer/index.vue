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
    <el-button-group style="float: right;">
      <el-button plain icon="el-icon-edit" @click="prevPage">上一页</el-button>
      <el-button plain icon="el-icon-minus" @click="nextPage">下一页</el-button>
    </el-button-group>
  </div>
</template>

<script>
import {
  listTransactions
} from '@/api/transaction'

export default {
  name: 'TransactionExplorer',
  props: ['chain', 'pageSize'],
  data: function() {
    return {
      page: 1,
      transactions: [],
      queryStatus: {}
    }
  },
  watch: {
    chain: function(val) {
      this.refresh()
    }
  },
  methods: {
    getQueryStatus(path) {
      var status = this.queryStatus[path]
      if (status === undefined) {
        this.queryStatus[path] = {
          index: 0,
          steps: [{
            offset: 0,
            blockNumber: -1
          }]
        }

        status = this.queryStatus[path]
      }

      return status
    },
    refresh() {
      var path = this.chain
      var status = this.getQueryStatus(path)
      var step = status.steps[status.index]

      listTransactions({
        path: path,
        blockNumber: step.blockNumber,
        offset: step.offset,
        size: this.pageSize
      }).then((response) => {
        if (typeof response.errorCode === undefined || response.errorCode !== 0) {
          this.$message({
            type: 'error',
            message: '查询交易列表失败, errorCode: ' + response.errorCode
          })
          return
        }

        if (!(response.data.nextOffset === -1 || response.data.nextBlockNumber === -1) && (status.index === (
          status.steps.length - 1))) {
          status.steps.push({
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
    },
    prevPage() {
      var path = this.chain
      var status = this.getQueryStatus(path)

      if (status.index > 0) {
        --status.index
      }

      this.refresh()
    },
    nextPage() {
      var path = this.chain
      var status = this.getQueryStatus(path)

      if (status.index + 1 < status.steps.length) {
        ++status.index
      }

      this.refresh()
    }
  }
}
</script>

<style>
</style>
