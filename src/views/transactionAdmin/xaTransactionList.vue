<template>
  <div class="app-container">
    <el-row style="margin-top: 20px">
      <el-card v-loading="loadingList">
        <el-row :gutter="18">
          <el-button plain icon="el-icon-refresh" @click="refresh">刷新</el-button>
          <el-button plain icon="el-icon-s-order" @click="onStartXATransaction">发起事务</el-button>
        </el-row>
        <el-row :gutter="20">
          <el-table
            ref="singleTable"
            :data="xaList"
            fit
            highlight-current-row
            @expand-change="onExpandChange"
            style="width: 100%"
          >
            <el-table-column label="开始时间">
              <template slot-scope="scope">
                <span>{{ scope.row.timestamp | formatDate }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="username" label="账户"></el-table-column>
            <el-table-column width="400" prop="xaTransactionID" label="ID"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column label="锁定资源">
              <template slot-scope="scope">
                <li style="list-style-type: none" v-for="path in scope.row.paths">{{ path }}</li>
              </template>
            </el-table-column>
            <el-table-column type="expand" label="步骤">
              <template slot-scope="scope">
                <el-card class="box-card" v-loading="loadingXA">
                  <el-form inline class="table-expand">
                    <el-table
                      ref="singleTable"
                      :data="xaTransaction.xaTransactionSteps"
                      fit
                      highlight-current-row
                    >
                      <el-table-column label="日期">
                        <template slot-scope="scope">
                          <span>{{ scope.row.timestamp | formatDate }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="xaTransactionSeq" label="序号"></el-table-column>
                      <el-table-column prop="username" label="账户"></el-table-column>
                      <el-table-column prop="path" label="资源"></el-table-column>
                      <el-table-column prop="method" label="方法"></el-table-column>
                    </el-table>
                    <el-row style="margin-top: 20px">
                      <template>
                        <el-form-item label="提交时间：" v-if="scope.row.status === 'committed'">
                          <span>
                            {{
                            xaTransaction.commitTimestamp | formatDate
                            }}
                          </span>
                        </el-form-item>
                        <el-form-item label="回滚时间：" v-if="scope.row.status === 'rolledback'">
                          <span>
                            {{
                            xaTransaction.rollbackTimestamp | formatDate
                            }}
                          </span>
                        </el-form-item>
                        <el-form-item>
                          <el-button
                            type="primary"
                            v-if="scope.row.status === 'processing'"
                            @click="
                              onExecXATransaction(
                                xaTransaction.xaTransactionID,
                                xaTransaction.paths
                              )
                            "
                          >继续执行</el-button>
                        </el-form-item>
                      </template>
                    </el-row>
                  </el-form>
                </el-card>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px; text-align: center">
          <el-button
            :disabled="preClickDisable"
            size="small"
            type="primary"
            plain
            icon="el-icon-back"
            @click="handlePrevClick"
          >上一页</el-button>
          <el-button
            :disabled="nextClickDisable"
            size="small"
            type="primary"
            plain
            icon="el-icon-right"
            @click="handleNextClick"
          >下一页</el-button>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>

import { parseTime } from '@/utils/index'
import { getXATransaction, listXATransactions } from '@/api/transaction'

export default {
  name: 'XATransactionList',
  props: {},

  filters: {
    formatDate(time) {
      time = time * 1000
      const date = new Date(time)
      return parseTime(date)
    }
  },
  data() {
    return {
      loadingList: false,
      loadingXA: false,
      tableSize: 10,
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

        if (typeof response.errorCode === undefined || response.errorCode !== 0) {
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
      })
    },
    onExecXATransaction(xaTID, xaPaths) {
      this.$store.commit('transaction/SET_TRANSACTION', { transactionID: xaTID, paths: xaPaths })
      this.$router.push({ path: 'xaTransaction' })
    },
    onExpandChange(row, expandedRows) {
      this.fetchXATransaction(row.xaTransactionID, row.paths)
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
        if (typeof response.errorCode === undefined || response.errorCode !== 0) {
          this.$message({
            type: 'error',
            message: '查询事务详情失败: ' + JSON.stringify(response)
          })
          return
        }
        this.xaTransaction = response.data.xaTransaction
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
      if (this.isFinished) {
        this.nextClickDisable = true
      } else {
        this.nextClickDisable = false
      }

      // prev page
      if (this.currentPage > 1) {
        this.preClickDisable = false
      } else {
        this.preClickDisable = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
