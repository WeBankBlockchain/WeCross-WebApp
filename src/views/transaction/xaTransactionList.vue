<template>
  <div class="app-container">
    <el-row>
      <el-card v-loading="loadingList" style="height: 90vh">
        <el-row :gutter="18" style="height: 50px">
          <el-button icon="el-icon-refresh" @click="refresh">刷新</el-button>
          <el-button type="primary" icon="el-icon-s-order" @click="onStartXATransaction">发起事务</el-button>
        </el-row>
        <el-row :gutter="20">
          <el-table
            ref="singleTable"
            :data="xaList"
            fit
            height="calc(90vh - 130px)"
            style="width: 100%;"
            tooltip-effect="light"
            :expand-row-keys="expands"
            :row-key="getRowKey"
            @expand-change="onExpandChange"
          >
            <el-table-column label="开始时间" min-width="60px">
              <template slot-scope="scope">
                <span>{{ scope.row.timestamp | formatDate }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="xaTransactionID" label="事务ID" min-width="80px" show-overflow-tooltip />
            <el-table-column prop="username" label="跨链账户" min-width="40px" />
            <el-table-column label="事务状态" width="160px">
              <template slot-scope="scope">
                <el-tag :type="filterTag(scope.row.status)">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="锁定资源" min-width="50px">
              <template slot-scope="scope">
                <li v-for="path in scope.row.paths" :key="path" style="list-style-type: none">{{ path }}</li>
              </template>
            </el-table-column>
            <el-table-column type="expand" label="执行步骤" width="80px">
              <template slot-scope="scope">
                <el-form v-loading="loadingXA" inline class="table-expand">
                  <el-table
                    ref="singleTable"
                    :data="xaTransaction ? xaTransaction.xaTransactionSteps : null"
                    fit
                    highlight-current-row
                    tooltip-effect="light"
                  >
                    <el-table-column label="执行时间" width="155px">
                      <template slot-scope="step">
                        <span>{{ step.row.timestamp | formatDate }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="xaTransactionSeq" label="步骤序号" min-width="70px" />
                    <el-table-column prop="username" label="跨链账户" min-width="60px" />
                    <el-table-column prop="path" label="资源路径" min-width="80px" />
                    <el-table-column prop="method" label="调用方法" min-width="60px" />
                    <el-table-column
                      prop="args"
                      label="调用参数"
                      min-width="60px"
                      show-overflow-tooltip
                    />
                  </el-table>
                  <el-row style="margin-top: 20px">
                    <el-form>
                      <el-form-item v-if="scope.row.status === 'committed'" label="提交时间：">
                        <span>
                          {{ xaTransaction ? ( xaTransaction.commitTimestamp ) : null | formatDate }}
                        </span>
                      </el-form-item>
                      <el-form-item v-if="scope.row.status === 'rolledback'" label="回滚时间：">
                        <span>
                          {{ xaTransaction ? ( xaTransaction.rollbackTimestamp ) : null | formatDate }}
                        </span>
                      </el-form-item>
                      <el-form-item>
                        <el-button
                          v-if="scope.row.status === 'processing'"
                          type="primary"
                          @click="
                            onExecXATransaction(
                              xaTransaction.xaTransactionID,
                              xaTransaction.paths
                            )
                          "
                        >继续执行</el-button>
                      </el-form-item>
                    </el-form>
                  </el-row>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px; text-align: center ; height: 40px">
          <el-button
            :disabled="preClickDisable"
            size="small"
            icon="el-icon-back"
            @click="handlePrevClick"
          >上一页</el-button>
          <el-button
            :disabled="nextClickDisable"
            size="small"
            @click="handleNextClick"
          >
            下一页
            <i class="el-icon-right" />
          </el-button>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>

import { parseTime } from '@/utils'
import { getXATransaction, listXATransactions } from '@/api/transaction'

export default {
  name: 'XATransactionList',

  filters: {
    formatDate(time) {
      time = time * 1000
      const date = new Date(time)
      return parseTime(date)
    }
  },
  props: {},
  data() {
    return {
      loadingList: false,
      loadingXA: false,
      tableSize: 10,
      expands: [],
      currentPage: 1,
      isFinished: false,
      offsetsCache: [{}],
      offsets: new Map(),
      preClickDisable: true,
      nextClickDisable: false,
      xaList: [
        {
          xaTransactionID: null,
          username: null,
          status: null,
          timestamp: 0,
          paths: []
        }
      ],
      xaTransaction: {
        username: null,
        xaTransactionID: null,
        status: null,
        commitTimestamp: 0,
        rollbackTimestamp: 0,
        paths: [],
        xaTransactionSteps: [
          {
            timestamp: 0,
            username: null,
            xaTransactionSeq: 0,
            path: null,
            method: null,
            args: null
          }
        ]
      }
    }
  },
  created() {
    this.refresh()
  },
  mounted() { },
  methods: {
    resetAllData() {
      this.currentPage = 1
      this.isFinished = false
      this.offsetsCache = [{}]
      this.offsets = new Map()
      this.xaList = []
      this.xaTransaction = null
      this.preClickDisable = true
      this.nextClickDisable = false
    },
    refresh() {
      this.resetAllData()
      console.log('[offset0] status => offsets: ' + JSON.stringify(this.offsets))
      this.fetchXATransactionList()
    },
    filterTag(status) {
      if (status === 'committed') {
        return 'success'
      } else if (status === 'processing') {
        return 'warning'
      } else {
        return 'danger'
      }
    },
    onStartXATransaction() {
      this.$router.push({ path: 'xaTransaction' })
    },
    fetchXATransactionList() {
      this.loadingList = true
      this.xaList = []
      listXATransactions({
        version: '1',
        data: {
          size: this.tableSize,
          offsets: this.offsets
        }
      }).then(response => {
        this.loadingList = false
        console.log('[listXATransactions] response => ' + JSON.stringify(response))

        if (typeof (response.errorCode) === 'undefined' || response.errorCode !== 0) {
          this.$message({
            type: 'error',
            message: '查询事务列表失败: ' + JSON.stringify(response)
          })
          return
        }

        this.isFinished = response.data.finished
        this.offsets = response.data.nextOffsets
        this.xaList = response.data.xaList

        // update offsets cache
        this.offsetsCache[this.currentPage] = this.offsets

        // update disable button
        this.updateDisableButtonStatus()

        console.log('[after listXATransactions] status => isFinished:', this.isFinished + ', offsets: ' + JSON.stringify(this.offsets) + ', offsetsCache: ' + JSON.stringify(this.offsetsCache) + ', preClickDisable:', this.preClickDisable + ', nextClickDisable:', this.nextClickDisable)
      }).catch(error => {
        this.$message({
          message: '网络异常：' + error,
          type: 'error',
          duration: 5000
        })
      })
    },
    onExecXATransaction(xaTID, xaPaths) {
      this.$store.commit('transaction/SET_TRANSACTION', { transactionID: xaTID, paths: xaPaths })
      this.$router.push({ path: 'xaTransaction', query: { isExec: 'true' }})
    },
    getRowKey(row) {
      return row.xaTransactionID
    },
    onExpandChange(row, expandedRows) {
      if (expandedRows.length) {
        this.expands = []
        if (row) {
          this.expands.push(row.xaTransactionID)
          this.fetchXATransaction(row.xaTransactionID, row.paths)
        }
      } else {
        this.expands = []
      }
    },
    fetchXATransaction(xaTransactionID, paths) {
      console.log('xaTransactionID ', xaTransactionID)
      console.log('paths ', paths)
      this.loadingXA = true
      this.xaTransaction = null
      getXATransaction({
        version: '1',
        data: {
          xaTransactionID: xaTransactionID,
          paths: paths
        }
      }).then(response => {
        console.log('[getXATransaction] response => ' + JSON.stringify(response))
        this.loadingXA = false
        if (typeof (response.errorCode) === 'undefined' || response.errorCode !== 0) {
          this.$message({
            type: 'error',
            message: '查询事务详情失败: ' + JSON.stringify(response)
          })
          return
        }
        this.xaTransaction = response.data.xaTransaction
      }).catch(error => {
        this.$message({
          message: '网络异常：' + error,
          type: 'error',
          duration: 5000
        })
      })
    },
    handleNextClick() {
      if (!this.isFinished) {
        this.currentPage = this.currentPage + 1
        this.updateCurrentOffsets()
        this.fetchXATransactionList()
      }
    },
    handlePrevClick() {
      this.currentPage = this.currentPage - 1
      this.updateCurrentOffsets()
      this.fetchXATransactionList()
    },
    updateCurrentOffsets() {
      this.offsets = this.offsetsCache[this.currentPage - 1]
      console.log('current page: ' + this.currentPage + ' offsets: ' + JSON.stringify(this.offsets))
    },
    updateDisableButtonStatus() {
      console.log(
        ' update button status, current page: ' +
        this.currentPage +
        ' offsets: ' +
        JSON.stringify(this.offsets)
      )
      // next page
      this.nextClickDisable = this.isFinished
      // prev page
      this.preClickDisable = this.currentPage <= 1
    }
  }
}
</script>

<style lang="scss">
</style>
