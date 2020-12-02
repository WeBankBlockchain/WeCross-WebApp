<template>
  <div class="app-container">
    <el-card header="事务步骤">
      <template slot="header">
        <el-page-header content="事务步骤" title="事务管理" @back="() => {this.$router.push({ path: 'xaTransactionList' })}" />
      </template>
      <el-row :gutter="24">
        <el-steps :active="stepActive" align-center finish-status="finish">
          <el-step title="步骤1" description="选择所需资源，开启一段事务" />
          <el-step title="步骤2" description="在本次事务中执行事务交易" />
          <el-step title="步骤3" deszhecription="结束事务，选择回滚/提交事务" />
        </el-steps>
      </el-row>
    </el-card>

    <!--  step1  -->
    <el-collapse-transition>
      <el-row v-if="stepActive === 0" style="margin-top: 15px;">
        <el-card header="开启事务">
          <el-row>
            <el-col :md="{ span: 14, offset: 5 }">
              <el-form
                ref="transactionForm"
                label-width="auto"
                label-position="right"
                :model="transactionForm"
              >
                <el-form-item
                  label="事务ID："
                  :rules="[
                    { required: true, message: '事务ID不能为空', trigger: 'blur' },
                    { pattern: /^[0-9a-fA-F]+$/, required: true, message: '请检查事务ID格式：16进制', trigger: 'blur' },
                    { required: true, message: '事务ID长度不能超过128', trigger: 'blur', max: 128 }
                  ]"
                  prop="transactionID"
                >
                  <el-input
                    v-model.trim="transactionForm.transactionID"
                    placeholder="请输入事务ID"
                    style="width: 100%;"
                  >
                    <el-button
                      slot="append"
                      icon="el-icon-circle-plus"
                      style="padding: 5px"
                      type="primary"
                      @click="creatUUID"
                    >生成事务ID
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
          <el-row>
            <resource-transfer
              height="43vh"
              :page-object="pageObject"
              :resource-data="resourceData"
              :to-data.sync="toResourceData"
              @current-change="setPage"
              @chain-click="onChainClick"
            />
          </el-row>
        </el-card>
      </el-row>
    </el-collapse-transition>

    <!--  step2  -->
    <el-collapse-transition>
      <el-row v-if="stepActive === 1" style="margin-top: 10px; ">
        <el-card style="height: 60vh">
          <div slot="header">
            <el-row>
              <el-col :span="11" style="text-align: left">
                <span>执行事务</span>
              </el-col>
              <el-col :span="13" style="text-align: left">
                <el-divider direction="vertical" />
                <span style="margin-left: 10px">事务步骤列表</span>
              </el-col>
            </el-row>
          </div>
          <el-col :span="10">
            <transaction-form
              ref="originTransaction"
              :transaction="transactionForm"
              style="height: 50vh; overflow-y:auto; overflow-x:hidden"
              @clearClick="clearTransaction"
              @submitClick="execTransaction"
            >
              <el-select
                slot="path"
                v-model="transactionForm.path"
                placeholder="请输入跨链资源路径"
                style="width: 100%"
                filterable
                default-first-option
                @change="onSelectionChange"
              >
                <el-option
                  v-for="path in this.$store.getters.XAPaths"
                  :key="path"
                  :value="path"
                  :label="limitString(path)"
                />
              </el-select>
            </transaction-form>
          </el-col>
          <el-col :span="12" :offset="2">
            <el-row>
              <div style="font-size: 14px">
                <el-tooltip effect="light" content="复制事务ID" placement="top-start">
                  <clipboard :input-data="this.$store.getters.transactionID" style="float:right;" />
                </el-tooltip>
                <el-tooltip effect="light" :content="this.$store.getters.transactionID" placement="top-start">
                  <div>
                    {{ "当前事务ID： " + limitString(this.$store.getters.transactionID) }}
                  </div>
                </el-tooltip>
              </div>
              <el-divider />
            </el-row>
            <el-row>
              <el-table stripe fit style="width: 100%;" height="45vh" :data="transactionStep" tooltip-effect="light">
                <el-table-column prop="timestamp" label="执行时间" min-width="70px" show-overflow-tooltip>
                  <template slot-scope="props">
                    <span>{{ props.row.timestamp | formatDate }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="xaTransactionSeq" label="步骤序号" min-width="80px" show-overflow-tooltip />
                <el-table-column prop="username" label="跨链账户" min-width="70px" show-overflow-tooltip />
                <el-table-column prop="path" label="资源路径" min-width="70px" show-overflow-tooltip />
                <el-table-column prop="method" label="调用方法" min-width="70px" />
              </el-table>
            </el-row>
          </el-col>
        </el-card>
      </el-row>
    </el-collapse-transition>

    <!--  step3  -->
    <el-collapse-transition>
      <el-row v-if="stepActive === 2" style="margin-top: 10px">
        <el-card style="height: 70vh" header="事务详情">
          <el-row>
            <el-col>
              <el-table
                ref="transactionDetailTable"
                :data="transactionDetail"
                :row-key="(row) => {return row.xaTransactionID}"
                :expand-row-keys="[transactionForm.transactionID]"
                fit
                stripe
                height="calc(70vh - 140px)"
                tooltip-effect="light"
                style="width: 100%;"
              >
                <el-table-column min-width="60px" label="开始时间" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ scope.row.startTimestamp | formatDate }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="xaTransactionID" label="事务ID" min-width="90px" show-overflow-tooltip />
                <el-table-column prop="username" label="跨链账户" min-width="50px" />
                <el-table-column prop="status" min-width="50px" label="事务状态" />
                <el-table-column min-width="80px" label="锁定资源">
                  <template slot-scope="scope">
                    <div v-for="path in scope.row.paths" :key="path">
                      {{ path }}<br>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column type="expand" width="80px" label="事务步骤">
                  <template slot-scope="props">
                    <el-table stripe fit style="width: 100%;" :data="props.row.xaTransactionSteps" tooltip-effect="light">
                      <el-table-column prop="timestamp" label="执行时间" min-width="75px" show-overflow-tooltip>
                        <template slot-scope="step">
                          <span>{{ step.row.timestamp | formatDate }}</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="xaTransactionSeq" label="步骤序号" min-width="80px" show-overflow-tooltip />
                      <el-table-column prop="username" label="跨链账户" min-width="60px" />
                      <el-table-column prop="path" label="资源路径" min-width="70px" />
                      <el-table-column prop="method" label="调用方法" min-width="70px" />
                    </el-table>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px;">
            <el-col style="text-align: center">
              <el-button-group>
                <el-button @click="stepActive = 1"> 返回上一步</el-button>
                <el-button
                  v-loading.fullscreen.lock="loading"
                  type="primary"
                  icon="el-icon-check"
                  @click="commitTransaction"
                >
                  提交事务
                </el-button>
                <el-button
                  v-loading.fullscreen.lock="loading"
                  type="primary"
                  icon="el-icon-refresh-left"
                  @click="rollbackTransaction"
                >回滚事务
                </el-button>
              </el-button-group>
            </el-col>
          </el-row>
        </el-card>
      </el-row>
    </el-collapse-transition>

    <!--  done  -->
    <el-collapse-transition>
      <el-row v-if="stepActive === 3" style="margin-top: 10px">
        <el-card>
          <el-row :gutter="24">
            <el-col :span="2" :offset="11">
              <el-image
                style="width: 100%; height: 100%"
                :src="require('@/assets/check-pass.svg')"
                fit="fill"
              />
            </el-col>
          </el-row>
          <el-row>
            <el-col style="text-align: center; margin-top: 20px">
              <span style="color: #579ef8; font-weight: bold; font-size: 20px">已结束当前事务</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="text-align: center; margin-top: 20px">
              <el-button-group>
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus-outline"
                  @click="reloadTransaction"
                >再开启一段事务
                </el-button>
                <el-button
                  icon="el-icon-search"
                  @click="() => {this.$router.push({ path: 'xaTransactionList' })}"
                >查看事务列表
                </el-button>
              </el-button-group>
            </el-col>
          </el-row>
        </el-card>
      </el-row>
    </el-collapse-transition>

    <!--  button  -->
    <el-card v-if="stepActive < 2 " style="margin-top: 10px">
      <el-row :gutter="24" style="text-align: center;">
        <el-button-group>
          <el-button
            type="primary"
            icon="el-icon-arrow-left"
            :disabled="stepActive!==2"
            @click="_ => (stepActive = 1)"
          >{{ stepBackBtnText }}
          </el-button>
          <el-button
            v-loading.fullscreen.lock="loading"
            type="primary"
            :disabled="stepActive === 2 || stepActive === 3"
            @click="stepBtnClick"
          >
            {{ stepForwardBtnText }}
            <i class="el-icon-arrow-right el-icon--right" />
          </el-button>
        </el-button-group>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import TransactionForm from '@/views/transaction/components/TransactionForm'
import ResourceTransfer from '@/components/ResourceTransfer/index'
import Clipboard from '@/components/Clipboard/index'
import { getResourceList } from '@/api/resource'
import { call, getXATransaction, sendTransaction } from '@/api/transaction'
import { parseTime, limitString } from '@/utils'
import { buildXAError, removeXATX } from '@/utils/transaction'

export default {
  name: 'XATransaction',
  components: {
    TransactionForm,
    ResourceTransfer,
    Clipboard
  },
  filters: {
    formatDate(time) {
      time = time * 1000
      const date = new Date(time)
      return parseTime(date)
    }
  },
  data() {
    return {
      stepActive: 0,
      stepBackBtnText: '上一步',
      stepForwardBtnText: '开启事务',
      transactionDetail: [],
      transactionStep: [],
      resourceData: [],
      toResourceData: [],

      currentChain: null,
      pageObject: {
        currentPage: 1,
        totalPageNumber: 0,
        pageSize: 10
      },
      transactionForm: {
        transactionID: null,
        path: null,
        method: null,
        args: [{
          value: null,
          key: 0
        }],
        execMethod: 'sendTransaction',
        isXATransaction: true
      },
      loading: false
    }
  },
  watch: {
    stepActive(value) {
      if (value === 1) {
        this.stepForwardBtnText = '结束事务'
        this.stepBackBtnText = '上一步'
        this.getXADetail()
      }
    }
  },
  created() {
    this.loadXATransaction(this.$route.query.isExec)
  },
  methods: {
    limitString(str) {
      return limitString(str)
    },
    stepBtnClick() {
      switch (this.stepForwardBtnText) {
        case '开启事务':
          this.startTransaction()
          break
        case '结束事务':
          this.endTransaction()
          break
      }
    },
    onSelectionChange() {
      const tempPath = this.transactionForm.path
      this.$refs.originTransaction.clearForm()
      this.transactionForm.path = tempPath
    },
    loadXATransaction(isExec) {
      const xaID = this.$store.getters.transactionID
      if (xaID !== null && typeof (isExec) === 'undefined') {
        const h = this.$createElement
        this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('h3', { style: 'font-weight: bold; margin-left:10px' }, '目前有事务正在执行中，是否恢复？'),
            h('li', { style: 'font-weight: bold; margin-left:10px' }, '事务ID：'),
            h('ol', null, limitString(xaID)),
            h('li', { style: 'font-weight: bold; margin-left:10px' }, '锁定资源: '),
            h('ol', null, this.$store.getters.XAPaths.map(item => limitString(item)).join(',  \n'))
          ]),
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showCancelButton: true,
          confirmButtonText: '恢复事务',
          cancelButtonText: '新建事务'
        }).then(_ => {
          getXATransaction({
            version: 1,
            data: {
              xaTransactionID: this.$store.getters.transactionID,
              paths: this.$store.getters.XAPaths
            }
          }).then(response => {
            if (response.errorCode !== 0 || response.data.xaResponse.status !== 0) {
              this.$message.error({
                message: '获取事务详情失败，错误：' + buildXAError(response),
                center: true,
                duration: 5000
              })
              removeXATX()
              this.$store.commit('transaction/RESET_STATE')
            } else {
              if (response.data.xaTransaction.status !== 'processing') {
                this.$msgbox('恢复事务失败，该事务已经回滚/提交！', '错误', 'error')
                console.log('get xaTransaction error, this xaTransaction is not processing')
                removeXATX()
                this.$store.commit('transaction/RESET_STATE')
              } else {
                this.transactionForm.transactionID = this.$store.getters.transactionID
                this.transactionForm.path = this.$store.getters.XAPaths
                this.stepActive = 1
              }
            }
          }).catch(error => {
            this.$message({
              message: '网络异常：' + error,
              type: 'error',
              duration: 5000
            })
          })
        }).catch(_ => {
          removeXATX()
          this.$store.commit('transaction/RESET_STATE')
        })
      } else if (xaID !== null && typeof (isExec) !== 'undefined') {
        this.transactionForm.transactionID = this.$store.getters.transactionID
        this.transactionForm.path = this.$store.getters.XAPaths
        this.stepActive = 1
      }
    },
    refresh() {
      const path = this.currentChain
      this.resourceData = []
      getResourceList({
        path: path,
        offset: (this.pageObject.currentPage - 1) * this.pageObject.pageSize,
        size: this.pageObject.pageSize
      }, {
        ignoreRemote: false
      }).then((response) => {
        if (response.errorCode === 0) {
          const resourceList = response.data.resourceDetails
          for (const resource of resourceList) {
            this.resourceData.push({
              path: resource.path
            })
          }
          this.pageObject.totalPageNumber = response.data.total
        } else {
          this.$message({
            type: 'error',
            message: '查询资源列表失败, errorCode: ' + response.errorCode
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
      this.pageObject.currentPage = value
      this.refresh()
    },
    onChainClick(path) {
      this.currentChain = path
      this.resourceData = []
      this.refresh()
    },
    creatUUID() {
      const { v4: uuidV4 } = require('uuid')
      console.log(typeof uuidV4())
      this.transactionForm.transactionID = uuidV4().toString().replaceAll('-', '')
      this.$refs['transactionForm'].clearValidate('transactionID')
    },
    clearTransaction() {
      this.transactionForm.args = [{
        value: null,
        key: 0
      }]
    },
    endTransaction() {
      // turn to step3
      this.stepActive = 2
    },
    startTransaction() {
      this.$refs['transactionForm'].validate(validate => {
        if (this.toResourceData == null || this.toResourceData.length < 1) {
          this.$message({
            message: '开启事务前请先选择资源！', type: 'error', center: true
          })
          return
        }
        if (validate) {
          this.loading = true
          const chosenData = []
          for (const data of this.toResourceData) {
            chosenData.push(data.path)
          }
          this.$store.dispatch('transaction/startTransaction', {
            version: '1',
            data: {
              xaTransactionID: this.transactionForm.transactionID,
              paths: chosenData
            }
          }).then(() => {
            this.loading = false
            this.stepActive = 1
          }).catch(_ => {
            this.loading = false
          })
        }
      })
    },
    execTransaction(transaction) {
      this.loading = true
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
            args: args,
            options: {
              'XA_TRANSACTION_ID': this.$store.getters.transactionID,
              'XA_TRANSACTION_SEQ': Date.now()
            }
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
            args: args,
            options: {
              'XA_TRANSACTION_ID': this.$store.getters.transactionID
            }
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
      this.$refs.originTransaction.onResponse(response)
      this.getXADetail()
    },
    commitTransaction() {
      if (this.$store.getters.transactionID !== null && this.$store.getters.paths !== []) {
        this.loading = true
        this.$store.dispatch('transaction/commitTransaction', {
          version: '1',
          data: {
            xaTransactionID: this.$store.getters.transactionID,
            paths: this.$store.getters.XAPaths
          }
        }).then(() => {
          this.loading = false
          this.stepActive = 3
        }).catch(err => {
          // transaction has been rolledback/committed
          if (/(committed|rolledback)/.test(err.toString())) {
            this.stepActive = 3
          }
          this.loading = false
        })
      }
    },
    rollbackTransaction() {
      if (this.$store.getters.transactionID !== null && this.$store.getters.paths !== []) {
        this.loading = true
        this.$store.dispatch('transaction/rollbackTransaction', {
          version: '1',
          data: {
            xaTransactionID: this.$store.getters.transactionID,
            paths: this.$store.getters.XAPaths
          }
        }).then(() => {
          this.loading = false
          this.stepActive = 3
        }).catch(err => {
          // transaction has been rolledback/committed
          if (/(committed|rolledback)/.test(err.toString())) {
            this.stepActive = 3
          }
          this.loading = false
        })
      }
    },
    getXADetail() {
      getXATransaction({
        version: 1,
        data: {
          xaTransactionID: this.$store.getters.transactionID,
          paths: this.$store.getters.XAPaths
        }
      }).then(response => {
        if (response.errorCode !== 0 || response.data.xaResponse.status !== 0) {
          this.$message.error({
            message: '获取事务详情失败，错误：' + buildXAError(response),
            center: true,
            duration: 5000
          })
        } else {
          const detail = []
          detail.push(response.data.xaTransaction)
          this.transactionDetail = detail
          this.transactionStep = response.data.xaTransaction.xaTransactionSteps
        }
      }).catch(error => {
        this.$message({
          message: '网络异常：' + error,
          type: 'error',
          duration: 5000
        })
      })
    },
    reloadTransaction() {
      this.stepActive = 0
      Object.assign(this.$data, this.$options.data())
    }
  }
}
</script>

<style lang="scss">
.el-page-header__content{
  font-size: 16px;
}
.table-expand {
  font-size: 0;
}

.table-expand label {
  width: 100px;
  color: #99a9bf;
}

.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
<style lang="scss" scoped>
</style>
