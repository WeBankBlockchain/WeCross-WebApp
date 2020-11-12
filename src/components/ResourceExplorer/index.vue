<template>
  <div>
    <el-table ref="singleTable" :data="resources" v-loading="loading" highlight-current-row>
      <el-table-column label="资源路径" min-width="80px">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>
      <el-table-column label="资源类型" min-width="50px">
        <template slot-scope="scope">
          {{ scope.row.stubType }}
        </template>
      </el-table-column>
      <el-table-column label="属性" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.properties }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" style="min-width: 70px">
        <template slot-scope="scope">
          <el-button-group style="padding: 5px">
            <el-button plain icon="el-icon-view" @click="onCall(scope.row.path)" style="padding: 8px">调用</el-button>
            <el-button plain icon="el-icon-edit-outline" @click="onSend(scope.row.path)" style="padding: 8px">发送交易
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        :page-size='pageSize'
        layout="prev, pager, next"
        :total="total"
        style="text-align: center; margin-top: 10px"
        :current-page="page"
        @prev-click="prevPage"
        @next-click="nextPage"
        @current-change="setPage">
    </el-pagination>

    <el-dialog :title="transactionData.execMethod === 'call'?'调用方法':'发送交易'" :visible.sync="callDialogOpen" center>
      <TransactionForm
          :transaction="transactionData"
          :submit-response="submitResponse"
          @clearClick="onClearTransaction"
          @submitClick="onSendTransaction">
        <el-input slot="path" v-model="transactionData.path" readonly style="width: 75%;"></el-input>
      </TransactionForm>
    </el-dialog>
  </div>
</template>

<script>
import {
  getResourceList
} from '@/api/resource'

import { sendTransaction } from '@/api/transaction'

export default {
  name: 'ResourceExplorer',
  props: ['chain', 'pageSize'],
  components: {
    TransactionForm: () => import('@/views/transactionAdmin/components/TransactionForm')
  },
  data: function() {
    return {
      loading: false,
      total: 0,
      page: 1,
      resources: [],
      queryStatus: {},
      callDialogOpen: false,
      transactionDatas: {},
      transactionData: {
        path: null,
        method: null,
        args: [{
          value: null,
          key: 0
        }]
      },
      submitResponse: null
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
          page: 0
        }

        status = this.queryStatus[path]
      }

      return status
    },
    refresh() {
      this.loading = true

      var path = this.chain
      var status = this.getQueryStatus(path)

      getResourceList({
        ignoreRemote: false,
        path: path,
        offset: status.page * this.pageSize,
        size: this.pageSize
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

      this.loading = false
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
      var data = this.transactionDatas[path]
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
      var data = this.getTransactionData(path)
      data.execMethod = 'call'
      this.transactionData = data
      this.callDialogOpen = true
    },
    onSend(path) {
      var data = this.getTransactionData(path)
      data.execMethod = 'sendTransaction'
      this.transactionData = data
      this.callDialogOpen = true
    },
    onClearTransaction() {
    },
    onSendTransaction(transaction) {
      this.loading = true
      const args = []
      for (const arg of transaction.args) {
        args.push(arg.value)
      }
      sendTransaction({
        version: '1',
        path: transaction.path,
        data: {
          method: transaction.method,
          args: args
        }
      }).then(response => {
        if (response.errorCode !== 0 || response.data.errorCode !== 0) {
          this.submitResponse = null
          this.$message({
            message: '调用失败，错误：' + (response.data === null) ? response.message : response.data.errorMessage,
            type: 'error',
            center: true
          })
        } else {
          this.submitResponse = JSON.stringify(response, null, 4)
          this.loading = false
          this.clearTransactionData(transaction.path)
        }
      })
    }
  }
}
</script>

<style>
</style>
