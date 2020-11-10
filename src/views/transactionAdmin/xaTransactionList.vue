<template>
  <div class="app-container">
    <el-row style="margin-top: 20px">
      <el-card>
        <el-row :gutter="18">
          <el-col :span="6">
            <el-button plain type="primary" icon="el-icon-refresh" @click="refresh">刷新</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-table ref="singleTable" :data="xaList" element-loading-text="加载中..." fit highlight-current-row @expand-change="onExpandChange">
            <el-table-column prop="date" label="开始时间">
              <template slot-scope="scope">
                <span>{{ scope.row.timestamp | formatDate }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="username" label="账户"> </el-table-column>
            <el-table-column prop="xaTransactionID" label="ID"> </el-table-column>
            <el-table-column prop="status" label="状态"> </el-table-column>
            <el-table-column label="锁定资源">
              <template slot-scope="scope">
                <li style="list-style-type:none" v-for="path in scope.row.paths"> {{ path }} </li>
              </template>
            </el-table-column>
            <el-table-column type="expand" label="步骤">
              <template slot-scope="scope">
                <el-card class="box-card">
                <el-divider></el-divider>
                <el-form class="table-expand">
                  <div v-for="step in xaTransaction.xaTransactionSteps">
                      <el-form-item label="日期：">
                        <span>{{ step.timestamp | formatDate }}</span>
                      </el-form-item>
                      <el-form-item label="序列：">
                        <span>{{ step.xaTransactionSeq }}</span>
                      </el-form-item>
                      <el-form-item label="账户：">
                        <span>{{ step.username }}</span>
                      </el-form-item>
                      <el-form-item label="资源：">
                        <span>{{ step.path }}</span>
                      </el-form-item>
                      <el-form-item label="方法：">
                        <span>{{ step.method }}</span>
                      </el-form-item>
                      <!-- <el-form-item label="参数：">
                          <span>{{ step.args }}</span>
                      </el-form-item> -->
                    <el-divider></el-divider>
                  </div>
                  <template>
                    <el-form-item label="提交时间：" v-if="scope.row.status === 'committed'">
                      <span>{{ xaTransaction.commitTimestamp | formatDate }}</span>
                    </el-form-item>
                    <el-form-item label="回滚时间：" v-if="scope.row.status === 'rolledback'">
                      <span>{{ xaTransaction.rollbackTimestamp | formatDate }}</span>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" v-if="scope.row.status === 'processing'" @click="onExecXATransaction">继续执行</el-button>
                    </el-form-item>
                  </template>
                </el-form>
                </el-card>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;text-align: center;">
          <el-pagination
            @next-click="handleNextClick"
            @prev-click	="handlePrevClick"
            :current-page="currentPage"
            layout="prev, pager, next"
          ></el-pagination>
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
      tableSize: 10,
      currentPage: 1,
      isFinished: false,
      offsetsCache: null,
      offsets: {},
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
  mounted() {},
  methods: {
    resetAllData() {
      this.currentPage = 1
      this.isFinished = false
      this.offsetsCache = new Map()
      this.offsets = {}
      this.xaList = []
      this.xaTransaction = null
    },
    refresh() {
      this.resetAllData()
      this.updateCurrentOffsets()
      this.fetchXATransactionList()
      this.offsetsCache.set(this.currentPage + 1, this.offsets)
    },
    fetchXATransactionList() {
      this.xaList = []
      listXATransactions({
        version: '1',
        data: {
          size: this.tableSize,
          offsets: this.offsets
        }
      }).then(response => {
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
      })
    },
    onExpandChange(row, expandedRows) {
      this.fetchXATransaction(row.xaTransactionID, row.paths)
    },
    fetchXATransaction(xaTransactionID, paths) {
      console.log('xaTransactionID ', xaTransactionID)
      console.log('paths ', paths)
      this.xaTransaction = null
      getXATransaction({
        version: '1',
        data: {
          xaTransactionID: xaTransactionID,
          paths: paths
        }
      }).then(response => {
        console.log('[getXATransaction] response => ' + JSON.stringify(response))

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
        this.updateOffsetsCache()
      }
    },
    handlePrevClick() {
      this.currentPage = this.currentPage - 1
      this.updateCurrentOffsets()
      this.fetchXATransactionList()
    },
    updateCurrentOffsets() {
      this.offsets = this.offsetsCache.get(this.currentPage)
      console.log('current page: ' + this.currentPage + ' offsets: ' + JSON.stringify(this.offsets))
    },
    updateOffsetsCache() {
      this.offsetsCache.set(this.currentPage, this.offsets)
      console.log('current page: ' + this.currentPage + ' offsets: ' + JSON.stringify(this.offsets))
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
