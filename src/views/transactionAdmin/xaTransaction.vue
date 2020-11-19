<template>
  <div class="app-container">
    <el-card header="事务步骤">
      <el-row :gutter="24">
        <el-steps :active="stepActive" align-center finish-status="finish">
          <el-step title="步骤1" description="选择所需资源，开启一段事务"></el-step>
          <el-step title="步骤2" description="在本次事务中执行事务交易"></el-step>
          <el-step title="步骤3" deszhecription="结束事务，选择回滚/提交事务"></el-step>
        </el-steps>
      </el-row>
    </el-card>

    <!--  step1  -->
    <el-collapse-transition>
      <el-row style="margin-top: 15px;" v-if="stepActive === 0">
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
                        {required: true, message: '事务ID不能为空', trigger: 'blur'},
                        { pattern: /^[0-9a-fA-F]+$/, required: true, message: '请检查事务ID格式：16进制', trigger: 'blur'}
                        ]"
                    prop="transactionID"
                >
                  <el-input
                      v-model="transactionForm.transactionID"
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
            <resource-finder
                height="43vh"
                :page-object="pageObject"
                :resource-data="resourceData"
                :to_data.sync="toResourceData"
                @current-change="setPage"
                @chain-click="onChainClick"
            ></resource-finder>
          </el-row>
        </el-card>
      </el-row>
    </el-collapse-transition>

    <!--  step2  -->
    <el-collapse-transition>
      <el-row style="margin-top: 10px; " v-if="stepActive === 1">
        <el-card style="height: 60vh">
          <div slot="header">
            <el-row>
              <el-col :span="11" style="text-align: left">
                <span>执行事务</span>
              </el-col>
              <el-col :span="13" style="text-align: left">
                <el-divider direction="vertical"></el-divider>
                <span style="margin-left: 10px">事务交易列表</span>
              </el-col>
            </el-row>
          </div>
          <el-col :span="10">
            <transaction-form
                :transaction="transactionForm"
                :submit-response="submitResponse"
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
              >
                <el-option
                    v-for="path in this.$store.getters.XAPaths"
                    :key="path"
                    :value="path"
                    :label="path"
                ></el-option>
              </el-select>
            </transaction-form>
          </el-col>
          <el-col :span="12" :offset="2">
            <el-row>
              <div v-if="this.$store.getters.transactionID !== null" style="font-size: 15px">
                {{ "当前事务ID：" + this.$store.getters.transactionID }}
                <el-divider></el-divider>
              </div>
            </el-row>
            <el-row>
              <el-table stripe fit style="width: 100%;" height="45vh" :data="transactionStep">
                <el-table-column label="序号" min-width="80px">
                  <template slot-scope="scope">{{ scope.row.xaTransactionSeq }}</template>
                </el-table-column>
                <el-table-column prop="username" label="账户" min-width="60px" align="center"></el-table-column>
                <el-table-column prop="path" label="资源" min-width="90px" align="center"></el-table-column>
                <el-table-column prop="method" label="方法" min-width="60px" align="center"></el-table-column>
                <el-table-column label="详情" type="expand" width="60px">
                  <template slot-scope="props">
                    <el-form inline class="table-expand">
                      <el-form-item label="日期: ">
                        <span>{{ props.row.timestamp | formatDate }}</span>
                      </el-form-item>
                      <el-form-item label="序号: ">
                        <span>{{ props.row.xaTransactionSeq }}</span>
                      </el-form-item>
                      <el-form-item label="账户: ">
                        <span>{{ props.row.username }}</span>
                      </el-form-item>
                      <el-form-item label="资源: ">
                        <span>{{ props.row.path }}</span>
                      </el-form-item>
                      <el-form-item label="方法: ">
                        <span>{{ props.row.method }}</span>
                      </el-form-item>
                      <el-form-item label="参数: ">
                        <span>{{ props.row.args }}</span>
                      </el-form-item>
                    </el-form>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-col>
        </el-card>
      </el-row>
    </el-collapse-transition>

    <!--  step3  -->
    <el-collapse-transition>
      <el-row style="margin-top: 10px" v-if="stepActive === 2">
        <el-card style="height: 70vh">
          <el-row>
            <el-col>
              <el-table
                  ref="transactionDetailTable"
                  :data="transactionDetail"
                  :row-key="(row) => {return row.xaTransactionID}"
                  :expand-row-keys="[transactionForm.transactionID]"
                  fit
                  stripe
                  height="60vh"
                  style="width: 100%"
              >
                <el-table-column prop="username" label="用户名" min-width="30"></el-table-column>
                <el-table-column prop="xaTransactionID" label="事务ID" min-width="80"></el-table-column>
                <el-table-column prop="status" min-width="50" label="事务状态"></el-table-column>
                <el-table-column prop="startTimestamp" min-width="50" label="事务开始时间"></el-table-column>
                <el-table-column
                    v-if="
                    this.transactionDetail.length > 0 &&
                    this.transactionDetail[0].commitTimestamp > 0
                  "
                    prop="commitTimestamp"
                    min-width="50"
                    label="事务提交时间"
                ></el-table-column>
                <el-table-column
                    v-if="
                    this.transactionDetail.length > 0 &&
                    this.transactionDetail[0].rollbackTimestamp > 0
                  "
                    prop="rollbackTimestamp"
                    min-width="50"
                    label="事务回滚时间"
                ></el-table-column>
                <el-table-column min-width="80" label="事务资源">
                  <template slot-scope="scope">
                    <div v-for="path in scope.row.paths">
                      {{ path }}
                      <br/>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column type="expand" width="80" label="事务步骤">
                  <template slot-scope="props">
                    <div v-for="step in props.row.xaTransactionSteps">
                      <el-form inline class="table-expand">
                        <el-form-item label="步骤序号：">
                          <span>{{ step.xaTransactionSeq }}</span>
                        </el-form-item>
                        <el-form-item label="交易账户：">
                          <span>{{ step.username }}</span>
                        </el-form-item>
                        <el-form-item label="资源路径：">
                          <span>{{ step.path }}</span>
                        </el-form-item>
                        <el-form-item label="交易时间：">
                          <span>{{ step.timestamp | formatDate }}</span>
                        </el-form-item>
                        <el-form-item label="调用方法：">
                          <span>{{ step.method }}</span>
                        </el-form-item>
                        <el-form-item label="调用参数：">
                          <span>{{ step.args }}</span>
                        </el-form-item>
                      </el-form>
                      <el-divider></el-divider>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px;">
            <el-col style="text-align: center">
              <el-button-group>
                <el-button @click="stepActive = 1"> 返回上一步</el-button>
                <el-button type="primary" icon="el-icon-check" @click="commitTransaction">提交事务</el-button>
                <el-button
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
      <el-row style="margin-top: 10px" v-if="stepActive === 3">
        <el-card>
          <el-row :gutter="24">
            <el-col :span="2" :offset="11">
              <el-image
                  style="width: 100%; height: 100%"
                  :src="require('@/assets/check-pass.svg')"
                  fit="fill"
              ></el-image>
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
    <el-card style="margin-top: 10px" v-if="stepActive < 2 ">
      <el-row :gutter="24" style="text-align: center;">
        <el-button-group>
          <el-button
              type="primary"
              icon="el-icon-arrow-left"
              :disabled="this.stepActive!==2"
              @click="() => (this.stepActive = 1)"
          >{{ stepBackBtnText }}
          </el-button>
          <el-button
              type="primary"
              :disabled="this.stepActive === 2 || this.stepActive === 3"
              @click="stepBtnClick"
              v-loading.fullscreen.lock="loading"
          >
            {{ stepForwardBtnText }}
            <i class="el-icon-arrow-right el-icon--right"></i>
          </el-button>
        </el-button-group>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import TransactionForm from '@/views/transactionAdmin/components/TransactionForm'
import ResourceFinder from '@/components/ResourceFinder/index'
import { getResourceList } from '@/api/resource'
import { call, getXATransaction, sendTransaction } from '@/api/transaction'
import { v4 as uuidV4 } from 'uuid'
import { Message } from 'element-ui'
import { parseTime } from '@/utils'

export default {
  name: 'XATransaction',
  components: {
    TransactionForm,
    ResourceFinder
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
      loading: false,
      submitResponse: null
    }
  },
  created() {
    this.loadXATransaction(this.$route.query.isExec)
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
  filters: {
    formatDate(time) {
      time = time * 1000
      const date = new Date(time)
      return parseTime(date)
    }
  },
  methods: {
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
    loadXATransaction(isExec) {
      const xaID = this.$store.getters.transactionID
      if (xaID !== null && typeof (isExec) === 'undefined') {
        const h = this.$createElement
        this.$msgbox({
          title: '提示',
          message: h('p', null, [
            h('h3', { style: 'font-weight: bold; margin-left:10px' }, '目前有事务正在执行中，是否恢复：'),
            h('li', { style: 'font-weight: bold; margin-left:10px' }, '事务ID：' + xaID),
            h('li', { style: 'font-weight: bold; margin-left:10px' }, '资源路径：'),
            h('ol', { script: '' }, this.$store.getters.XAPaths.join(',  \n'))
          ]),
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showCancelButton: true,
          confirmButtonText: '恢复事务',
          cancelButtonText: '重开事务'
        }).then(_ => {
          this.transactionForm.transactionID = this.$store.getters.transactionID
          this.transactionForm.path = this.$store.getters.XAPaths
          this.stepActive = 1
        }).catch(_ => {
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
    onChainClick(path, data) {
      this.currentChain = path
      this.resourceData = []
      this.refresh()
    },
    creatUUID() {
      this.transactionForm.transactionID = uuidV4().replaceAll('-', '')
      this.$refs['transactionForm'].clearValidate('transactionID')
    },
    clearTransaction() {
      this.transactionForm.args = [{
        value: null,
        key: 0
      }]
      this.submitResponse = null
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
          var chosenData = []
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
            args: args,
            options: {
              'XA_TRANSACTION_ID': this.$store.getters.transactionID,
              'XA_TRANSACTION_SEQ': Date.now()
            }
          }
        }).then(response => {
          this.onResponse(response)
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
        })
      }
    },
    onResponse(response) {
      this.loading = false
      if (response.errorCode !== 0 || response.data.errorCode !== 0) {
        this.submitResponse = null

        var code, message
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
        this.getXADetail()
      }
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
        }).catch(_ => {
          this.loading = false
          // TODO: error page
          this.stepActive = 3
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
        }).catch(() => {
          this.loading = false
          // TODO: error page
          this.stepActive = 3
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
          Message.error({
            message: '获取事务详情失败，错误：' + JSON.stringify(response.data.xaResponse, null, 4) || response.message,
            center: true,
            duration: 5000
          })
        } else {
          const detail = []
          detail.push(response.data.xaTransaction)
          this.transactionDetail = detail
          this.transactionStep = response.data.xaTransaction.xaTransactionSteps
        }
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
