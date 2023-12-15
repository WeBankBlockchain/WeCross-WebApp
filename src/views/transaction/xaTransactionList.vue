<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card style="height: 90vh">
          <div slot="header">
            <span>导航</span>
            <el-tooltip
              id="resourceHelp"
              effect="light"
              content="如何使用？"
              placement="top"
            >
              <el-button
                type="text"
                size="mini"
                style="margin-left: 10px; padding: 0px"
                @click="howToUseResource"
              >
                <svg-icon style="vertical-align: 0px" icon-class="question" />
              </el-button>
            </el-tooltip>
          </div>
          <el-row
            style="height: calc(70vh - 20px); overflow-y: auto; padding: 10px"
          >
            <ChainExplorer
              id="ChainExplorer"
              :chain="currentChain"
              @zone-click="onZoneClick"
              @chain-click="onChainClick"
            />
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card id="xaTransactionListExplorer" v-loading="loadingList" style="height: 90vh">
          <el-row :gutter="18" style="height: 50px">
            <el-button icon="el-icon-refresh" @click="refresh">刷新</el-button>
            <el-button
              id="sendxaTransaction"
              type="primary"
              icon="el-icon-s-order"
              @click="onStartXATransaction"
            >发起事务</el-button>
          </el-row>
          <el-row :gutter="20">
            <el-table
              ref="singleTable"
              :data="xaList"
              fit
              stripe
              height="calc(90vh - 130px)"
              style="width: 100%"
              tooltip-effect="light"
              :expand-row-keys="expands"
              :row-key="getRowKey"
              @expand-change="onExpandChange"
            >
              <el-table-column label="开始时间" min-width="11%">
                <template slot-scope="scope">
                  <span>{{ scope.row.timestamp | formatDate }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="xaTransactionID"
                label="事务ID"
                min-width="17%"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <clipboard
                    :input-data="scope.row.xaTransactionID"
                    style="margin-right: 5px; float: left"
                  />
                  {{ scope.row.xaTransactionID }}
                </template>
              </el-table-column>
              <el-table-column label="跨链账户" min-width="9%">
                <template slot-scope="scope">
                  <el-tag
                    v-if="!nonNull(scope.row.username)"
                    type="info"
                    effect="plain"
                  >unknown</el-tag>
                  <span v-if="nonNull(scope.row.username)">{{
                    scope.row.username
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="锁定资源" min-width="13%">
                <template slot-scope="scope">
                  <li
                    v-for="path in scope.row.paths"
                    :key="path"
                    style="list-style-type: none"
                  >
                    {{ path }}
                  </li>
                </template>
              </el-table-column>
              <el-table-column label="事务状态" min-width="10%">
                <template slot-scope="scope">
                  <el-tag :type="filterTag(scope.row.status)" effect="dark">{{
                    filterData(scope.row.status)
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column type="expand" label="执行步骤" width="80%">
                <template slot-scope="scope">
                  <div v-loading="loadingXA" class="table-expand">
                    <el-table
                      ref="singleTable"
                      :data="
                        xaTransaction ? xaTransaction.xaTransactionSteps : null
                      "
                      max-height="400px"
                      fit
                      empty-text="无事务步骤"
                      tooltip-effect="light"
                    >
                      <el-table-column
                        label="执行时间"
                        min-width="10%"
                        show-overflow-tooltip
                      >
                        <template slot-scope="step">
                          <span>{{ step.row.timestamp | formatDate }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="xaTransactionSeq"
                        label="步骤序号"
                        min-width="10%"
                      />
                      <el-table-column label="跨链账户" min-width="8%">
                        <template slot-scope="step">
                          <el-tag
                            v-if="!nonNull(step.row.username)"
                            type="info"
                            effect="plain"
                          >unknown</el-tag>
                          <span v-if="nonNull(step.row.username)">{{
                            step.row.username
                          }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="path"
                        label="资源路径"
                        min-width="12%"
                        show-overflow-tooltip
                      />
                      <el-table-column
                        prop="method"
                        label="调用方法"
                        min-width="8%"
                      />
                      <el-table-column
                        prop="args"
                        label="调用参数"
                        min-width="10%"
                        show-overflow-tooltip
                      />
                    </el-table>
                    <el-row style="margin-top: 20px">
                      <el-form>
                        <el-form-item
                          v-if="scope.row.status === 'committed'"
                          label="提交时间："
                        >
                          <span>
                            {{
                              xaTransaction
                                ? xaTransaction.commitTimestamp
                                : null | formatDate
                            }}
                          </span>
                        </el-form-item>
                        <el-form-item
                          v-if="scope.row.status === 'rolledback'"
                          label="回滚时间："
                        >
                          <span>
                            {{
                              xaTransaction
                                ? xaTransaction.rollbackTimestamp
                                : null | formatDate
                            }}
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
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <el-row
            :gutter="20"
            style="margin-top: 10px; text-align: center; height: 40px"
          >
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import ChainExplorer from '@/components/ChainExplorer'
import { getXATransaction, listXATransactions } from '@/api/transaction'
import { buildXAResponseError } from '@/utils/transaction'
import { xaTransactionManagerSteps } from './transactionSteps/xaTransactionStep.js'
import { handleErrorMsgBox, handleWarningMsgBox } from '@/utils/messageBox'
import Clipboard from '@/components/Clipboard'
import introJS from 'intro.js'
import 'intro.js/introjs.css'
import 'intro.js/themes/introjs-modern.css'
export default {
  name: 'XATransactionList',
  components: { Clipboard, ChainExplorer },
  filters: {
    formatDate(time) {
      time = time * 1000
      const date = new Date(time)
      return parseTime(date, null)
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
      },
      currentChainData: {},
      currentZone: undefined,
      currentChain: undefined
    }
  },
  created() {
    // this.refresh()
  },
  mounted() {},
  methods: {
    howToUseResource() {
      introJS().setOptions({
        prevLabel: '上一步',
        nextLabel: '下一步',
        doneLabel: '结束',
        disableInteraction: true,
        steps: xaTransactionManagerSteps
      }).start()
    },
    onZoneClick(path) {
      if (this.currentZone !== path) {
        this.currentZone = path
      }
    },
    onChainClick(path, data) {
      if (this.currentChain !== path) {
        this.currentChain = path
        this.currentChainData = data
        this.currentZone = path.split('.')[0]
        this.resetAllData()
        this.fetchXATransactionList()
      }
    },
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
      this.fetchXATransactionList()
    },
    filterTag(tag) {
      if (!this.nonNull(tag)) {
        return 'info'
      } else if (tag === 'committed') {
        return 'success'
      } else if (tag === 'processing') {
        return 'warning'
      } else {
        return 'danger'
      }
    },
    filterData(data) {
      if (this.nonNull(data)) {
        return data
      } else {
        return 'unknown'
      }
    },
    nonNull(data) {
      return typeof data !== 'undefined' && data !== null
    },
    onStartXATransaction() {
      this.$router.push({ path: 'xaTransaction' })
    },
    fetchXATransactionList() {
      if (!this.currentChain) {
        this.$message.error('请先从zone-chain导航中选择对应的链')
        return
      }
      this.loadingList = true
      this.xaList = []
      listXATransactions({
        version: '1.0',
        data: {
          path: this.currentChain,
          size: this.tableSize,
          offsets: this.offsets
        }
      })
        .then((response) => {
          this.loadingList = false

          if (!response) {
            this.$message.error('response为空，请检查后台运行状态')
            return
          }

          if (
            typeof response.errorCode === 'undefined' ||
            response.errorCode !== 0
          ) {
            handleErrorMsgBox(
              '查询事务列表失败: ',
              '错误',
              buildXAResponseError(response),
              null
            ).catch((_) => {})
            return
          }

          const xaResponse = response.data.xaResponse
          if (typeof xaResponse !== 'undefined' && xaResponse.status !== 0) {
            handleWarningMsgBox(
              '警告，有错误发生: ',
              '警告',
              buildXAResponseError(response),
              null
            ).catch((_) => {})
          }

          this.isFinished = response.data.finished
          this.offsets = response.data.nextOffsets
          this.xaList = response.data.xaList

          // update offsets cache
          this.offsetsCache[this.currentPage] = this.offsets

          // update disable button
          this.updateDisableButtonStatus()
        })
        .catch((error) => {
          this.loadingList = false
          this.$message({
            message: '网络异常：' + error,
            type: 'error',
            duration: 5000
          })
        })
    },
    onExecXATransaction(xaTID, xaPaths) {
      this.$store.commit('transaction/SET_TRANSACTION', {
        transactionID: xaTID,
        paths: xaPaths
      })
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
      console.log('paths ', paths)
      this.loadingXA = true
      this.xaTransaction = null
      getXATransaction({
        version: '1',
        data: {
          xaTransactionID: xaTransactionID,
          paths: paths
        }
      })
        .then((response) => {
          this.loadingXA = false

          if (
            typeof response.errorCode === 'undefined' ||
            response.errorCode !== 0
          ) {
            handleErrorMsgBox(
              '查询事务详情失败: ',
              '错误',
              buildXAResponseError(response),
              null
            ).catch((_) => {})
            return
          }

          const xaResponse = response.data.xaResponse
          if (typeof xaResponse !== 'undefined' && xaResponse.status !== 0) {
            handleWarningMsgBox(
              '警告，有错误发生: ',
              '警告',
              buildXAResponseError(response),
              null
            ).catch((_) => {})
          }

          this.xaTransaction = response.data.xaTransaction
        })
        .catch((error) => {
          this.loadingList = false
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
    },
    updateDisableButtonStatus() {
      // next page
      this.nextClickDisable = this.isFinished
      // prev page
      this.preClickDisable = this.currentPage <= 1
    }
  }
}
</script>

<style lang="scss"></style>
