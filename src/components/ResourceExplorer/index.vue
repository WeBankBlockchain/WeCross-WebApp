<template>
  <div>
    <el-table
      :data="resources"
      highlight-current-row
      tooltip-effect="light"
      height="calc(100% - 80px)"
    >
      <el-table-column label="资源路径" min-width="80px" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.path }}</template>
      </el-table-column>
      <el-table-column label="资源类型" min-width="50px">
        <template slot-scope="scope">{{ scope.row.stubType }}</template>
      </el-table-column>
      <el-table-column label="属性" min-width="100px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ JSON.stringify(scope.row.properties) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" style="min-width: 70px">
        <template slot-scope="scope">
          <el-button-group style="padding: 5px">
            <el-button
              plain
              icon="el-icon-edit-outline"
              style="padding: 8px"
              @click="onSend(scope.row.path)"
            >发交易</el-button>
            <el-button
              plain
              icon="el-icon-view"
              style="padding: 8px"
              @click="onCall(scope.row.path)"
            >查状态</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="total"
      style="text-align: center; margin-top: 10px; min-height: 40px"
      :current-page="page"
      @prev-click="prevPage"
      @next-click="nextPage"
      @current-change="setPage"
    />

    <el-dialog :title="'调用资源'" :visible.sync="callDialogOpen" :destroy-on-close="true" width="45%">
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form v-loading="loading">
            <TransactionForm
              :transaction="transactionData"
              :submit-response="submitResponse"
              @clearClick="onClearTransaction"
              @submitClick="onSubmit"
            >
              <el-input slot="path" v-model="transactionData.path" readonly />
            </TransactionForm>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getResourceList
} from '@/api/resource'

import { call, sendTransaction } from '@/api/transaction'

export default {
  name: 'ResourceExplorer',
  components: {
    TransactionForm: () => import('@/views/transaction/components/TransactionForm')
  },
  props: {
    chain: {
      type: String,
      default: () => { return null }
    },
    pageSize: {
      type: Number,
      default: () => { return 0 }
    }},
  data: function() {
    return {
      total: 0,
      page: 1,
      resources: [],
      queryStatus: {},
      callDialogOpen: false,
      transactionDatas: {},
      transactionData: {
        transactionID: null,
        path: null,
        method: null,
        args: [{
          value: null,
          key: 0
        }],
        execMethod: 'sendTransaction',
        isXATransaction: false
      },
      loading: false,
      submitResponse: null
    }
  },
  watch: {
    chain: function() {
      this.refresh()
    }
  },
  methods: {
    getQueryStatus(path) {
      var status = this.queryStatus[path]
      if (status === undefined) {
        this.queryStatus[path] = {
          page: 0
        }

        status = this.queryStatus[path]
      }

      return status
    },
    refresh() {
      var path = this.chain
      var status = this.getQueryStatus(path)

      getResourceList({
        path: path,
        offset: status.page * this.pageSize,
        size: this.pageSize
      }, {
        ignoreRemote: false
      }).then((response) => {
        if (response.errorCode === 0) {
          this.resources = response.data.resourceDetails
          this.total = response.data.total
          this.page = status.page + 1
        } else {
          this.$message({
            type: 'error',
            message: '查询交易列表失败, errorCode: ' + response.errorCode
          })
        }
      }).catch((error) => {
        console.log(error)
        this.$message({
          type: 'error',
          message: '网络异常'
        })
      })
    },
    prevPage() {
      var status = this.getQueryStatus(this.chain)

      --status.page
      this.page = status.page + 1

      this.refresh()
    },
    nextPage() {
      var status = this.getQueryStatus(this.chain)

      ++status.page
      this.page = status.page + 1

      this.refresh()
    },
    setPage(value) {
      var status = this.getQueryStatus(this.chain)

      status.page = value - 1
      this.page = status.page + 1

      this.refresh()
    },
    getTransactionData(path) {
      let data = this.transactionDatas[path]
      if (data === undefined) {
        this.transactionDatas[path] = {
          path: path,
          method: null,
          args: [{
            value: null,
            key: 0
          }]
        }

        data = this.transactionDatas[path]
      }

      return data
    },
    clearTransactionData(path) {
      delete this.transactionDatas[path]
    },
    onCall(path) {
      this.transactionData = this.getTransactionData(path)
      this.transactionData.execMethod = 'call'
      this.callDialogOpen = true
    },
    onSend(path) {
      this.transactionData = this.getTransactionData(path)
      this.transactionData.execMethod = 'sendTransaction'
      this.callDialogOpen = true
    },
    onClearTransaction() {
    },
    onSubmit(transaction) {
      this.loading = true
      this.submitResponse = null
      const args = []
      for (const arg of transaction.args) {
        args.push(arg.value)
      }
      console.log('execMethod: ' + transaction.execMethod)
      if (transaction.execMethod === 'sendTransaction') {
        sendTransaction({
          version: '1',
          path: transaction.path,
          data: {
            method: transaction.method,
            args: args
          }
        }).then(response => {
          this.onResponse(response)
        }).catch(error => {
          this.$message({
            message: '网络异常：' + error,
            type: 'error',
            duration: 5000
          })
        })
      } else {
        call({
          version: '1',
          path: transaction.path,
          data: {
            method: transaction.method,
            args: args
          }
        }).then(response => {
          this.onResponse(response)
        }).catch(error => {
          this.$message({
            message: '网络异常：' + error,
            type: 'error',
            duration: 5000
          })
        })
      }
    },
    onResponse(response) {
      this.loading = false
      if (response.errorCode !== 0 || response.data.errorCode !== 0) {
        this.submitResponse = null

        let code, message
        if (response.errorCode !== 0) {
          code = response.errorCode
          message = response.message
        } else {
          code = response.data.errorCode
          message = response.data.message
        }
        this.$alert(message, '错误码: ' + code, {
          confirmButtonText: '确定'
        })
      } else {
        this.submitResponse = JSON.stringify(response.data.result)
      }
    }
  }
}
</script>

<style>
</style>
