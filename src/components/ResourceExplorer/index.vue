<template>
  <div>
    <el-table
      :data="resources"
      tooltip-effect="light"
      height="calc(100% - 60px)"
    >
      <el-table-column label="资源路径" min-width="100px" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.path }}</template>
      </el-table-column>
      <el-table-column label="资源类型" width="120px">
        <template slot-scope="scope"><el-tag type="info">{{ scope.row.type }}</el-tag></template>
      </el-table-column>
      <el-table-column label="属性" min-width="150px" show-overflow-tooltip>
        <template slot-scope="scope">
          <clipboard :input-data="JSON.stringify(scope.row.properties)" style="margin-right: 10px;float:left" />
          <span>{{ JSON.stringify(scope.row.properties) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180px">
        <template slot-scope="scope">
          <el-button-group style="padding: 5px; width: 100%">
            <el-button
              plain
              size="mini"
              icon="el-icon-edit-outline"
              style="padding: 8px"
              @click="onSend(scope.row.path)"
            >发交易</el-button>
            <el-button
              plain
              size="mini"
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
      @current-change="setPage"
    />

    <el-dialog :title="'调用资源'" :visible.sync="callDialogOpen" :destroy-on-close="true" width="45%">
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form v-loading="loading">
            <transaction-form
              ref="transactionForm"
              :transaction="transactionData"
              @submitClick="onSubmit"
              @clearClick="onClearTransaction"
            >
              <el-input slot="path" v-model="transactionData.path" style="width: calc(100% - 63px)" readonly />
            </transaction-form>
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
import Clipboard from '@/components/Clipboard'

export default {
  name: 'ResourceExplorer',
  components: {
    Clipboard,
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
      transactionData: {
        transactionID: null,
        path: null,
        method: null,
        args: [{
          value: '',
          key: 0
        }],
        execMethod: 'sendTransaction',
        isXATransaction: false
      },
      selection: null,
      loading: false
    }
  },
  watch: {
    chain: function() {
      this.page = 1
      this.refresh()
    }
  },
  methods: {
    refresh() {
      this.selection = null
      var path = this.chain

      getResourceList({
        path: path,
        offset: (this.page - 1) * this.pageSize,
        size: this.pageSize
      }, null).then((response) => {
        if (response.errorCode === 0) {
          this.resources = response.data.resources
          this.total = response.data.total
        } else {
          this.$message({
            type: 'error',
            message: '查询资源列表失败, 错误信息: ' + response.message
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
    setPage(value) {
      this.page = value

      this.refresh()
    },
    onCall(path) {
      this.onClearTransaction()
      this.selection = path
      this.transactionData.path = path
      this.transactionData.execMethod = 'call'
      this.callDialogOpen = true
    },
    onSend(path) {
      this.onClearTransaction()
      this.selection = path
      this.transactionData.path = path
      this.transactionData.execMethod = 'sendTransaction'
      this.callDialogOpen = true
    },
    onClearTransaction() {
      this.transactionData.method = null
      this.transactionData.args = [{
        value: '',
        key: 0
      }]
      this.transactionData.path = this.selection
    },
    onSubmit() {
      this.loading = true
      const args = []
      for (const arg of this.transactionData.args) {
        args.push(arg.value)
      }
      if (this.transactionData.execMethod === 'sendTransaction') {
        sendTransaction({
          version: '1',
          data: {
            path: this.transactionData.path,
            method: this.transactionData.method,
            args: args
          }
        }).then(response => {
          this.onReceipt(response)
        }).catch(error => {
          this.loading = false
          this.$message({
            message: '网络异常：' + error,
            type: 'error',
            duration: 5000
          })
        })
      } else {
        call({
          version: '1',
          data: {
            path: this.transactionData.path,
            method: this.transactionData.method,
            args: args
          }
        }).then(response => {
          this.onCallResponse(response)
        }).catch(error => {
          this.loading = false
          this.$message({
            message: '网络异常：' + error,
            type: 'error',
            duration: 5000
          })
        })
      }
    },
    onReceipt(response) {
      this.loading = false
      this.$refs.transactionForm.onReceipt(response)
    },
    onCallResponse(response) {
      this.loading = false
      this.$refs.transactionForm.onCallResponse(response)
    }
  }
}
</script>

<style>
</style>
