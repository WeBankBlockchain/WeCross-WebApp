<template>
  <div class="app-container">
    <el-card header="事务步骤">
      <el-row :gutter="24">
        <el-steps :active="stepActive" align-center finish-status="finish">
          <el-step title="步骤1" description="选择所需资源，开启一段事务"></el-step>
          <el-step title="步骤2" description="在本次事务中执行事务交易"></el-step>
          <el-step title="步骤3" description="结束事务，选择回滚/提交事务"></el-step>
        </el-steps>
      </el-row>
      <el-row :gutter="24" style="text-align: center; margin-top: 10px">
      </el-row>
    </el-card>

    <!--  step1  -->
    <el-collapse-transition>
      <el-row style="margin-top: 15px;" v-if="stepActive === 0">
        <el-card header="开启事务">
          <el-row :gutter="24">
            <tree-transfer
                :title="['待选资源列表', '已选资源列表']"
                filter
                lazy
                :lazyFn="loadResource"
                mode="transfer"
                :button_text="['选择资源', '取消选择']"
                :from_data="fromData"
                :to_data="toData"
                @addBtn="addBtn"
                width="100%"></tree-transfer>
            <!--            <el-col style="text-align: center">-->
            <!--              <el-transfer-->
            <!--                  filterable-->
            <!--                  :filter-method="filterMethod"-->
            <!--                  filter-placeholder="请输入资源"-->
            <!--                  :button-texts="['取消','选择']"-->
            <!--                  :titles="['待选资源列表', '已选资源列表']"-->
            <!--                  v-model="chosenPaths"-->
            <!--                  :data="paths">-->
            <!--              </el-transfer>-->
            <!--            </el-col>-->
          </el-row>
          <el-divider>完成资源路径选择</el-divider>
          <el-row style="margin-top: 20px">
            <el-col :md="{span:12, offset:6}">
              <el-form
                  ref="transactionForm"
                  label-width="auto"
                  label-position="right"
                  :model="transactionForm">
                <el-form-item
                    label="事务ID："
                    :rules="[
                        {required: true, message: '事务ID不能为空', trigger: 'blur'},
                        { pattern: /^[0-9a-zA-Z]+$/, required: true, message: '事务ID不支持特殊字符', trigger: 'blur'}
                        ]"
                    prop="transactionID">
                  <el-input v-model="transactionForm.transactionID" placeholder="请输入事务ID"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="startTransaction" v-loading.fullscreen.lock="loading">开启事务
                  </el-button>
                  <el-button icon="el-icon-circle-plus" style="margin-left: 15px" @click="creatUUID">生成事务ID</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-card>
      </el-row>
    </el-collapse-transition>

    <!--  step2  -->
    <el-collapse-transition>
      <el-row style="margin-top: 15px" v-if="stepActive === 1">
        <el-card>
          <div slot="header">
            <el-row>
              <el-col :span="11" style="text-align: left">
                <span>执行事务</span>
              </el-col>
              <el-col :span="13" style="text-align: left">
                <el-divider direction="vertical"></el-divider>
                <span style="margin-left: 10px">事务交易列表</span>
                <el-button
                    @click="endTransaction"
                    icon="el-icon-circle-close"
                    size="medium"
                    style="float: right;padding: 3px 0"
                    type="text">结束事务
                </el-button>
              </el-col>
            </el-row>
          </div>
          <el-col :span="12">
            <transaction-form
                :transaction="transactionForm"
                :submit-response="submitResponse"
                @clearClick="clearTransaction"
                @submitClick="execTransaction">
              <el-select
                  slot="path"
                  v-model="transactionForm.path"
                  placeholder="请输入跨链资源路径"
                  style="width: 75%"
                  filterable
                  default-first-option>
                <el-option
                    v-for="path in this.$store.getters.XAPaths"
                    :key="path"
                    :value="path"
                    :label="path">
                </el-option>
              </el-select>
            </transaction-form>
          </el-col>
          <el-col :span="12">
            <el-row>
              <div v-if="this.$store.getters.transactionID !== null" style="font-size: 15px">
                {{ '当前事务ID：' + this.$store.getters.transactionID }}
                <el-divider></el-divider>
              </div>
            </el-row>
            <el-row>
              <el-table
                  stripe
                  fit
                  style="width: 100%"
                  :data="transactionStep">
                <el-table-column label="序号" min-width="50px">
                  <template slot-scope="scope">
                    {{ scope.row.xaTransactionSeq }}
                  </template>
                </el-table-column>
                <el-table-column prop="path" label="资源" min-width="100px" align="center">
                </el-table-column>
                <el-table-column prop="method" label="方法" min-width="100px" align="center">
                </el-table-column>
                <el-table-column label="详情" type="expand" width="50px">
                  <template slot-scope="props">
                    <el-form inline class="table-expand">
                      <el-form-item label="事务序列：">
                        <span>{{ props.row.xaTransactionSeq }}</span>
                      </el-form-item>
                      <el-form-item label="交易发起者：">
                        <span>{{ props.row.username }}</span>
                      </el-form-item>
                      <el-form-item label="资源路径：">
                        <span>{{ props.row.path }}</span>
                      </el-form-item>
                      <el-form-item label="交易哈希：">
                        <span>{{ props.row.hash }}</span>
                      </el-form-item>
                      <el-form-item label="调用方法：">
                        <span>{{ props.row.method }}</span>
                      </el-form-item>
                      <el-form-item label="方法参数：">
                        <span>{{ props.row.args }}</span>
                      </el-form-item>
                      <el-form-item label="交易时间戳：">
                        <span>{{ props.row.timestamp }}</span>
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
      <el-row style="margin-top: 15px" v-if="stepActive === 2">
        <el-card>
          <el-row>
            <el-col>
              <el-table
                  ref="transactionDetailTable"
                  :data="transactionDetail"
                  fit
                  stripe
                  element-loading-text="Loading"
                  style="width: 100%">
                <el-table-column
                    prop="username"
                    label="用户名"
                    min-width="30">
                </el-table-column>
                <el-table-column
                    prop="xaTransactionID"
                    label="事务ID"
                    min-width="80">
                </el-table-column>
                <el-table-column
                    prop="status"
                    min-width="50"
                    label="事务状态">
                </el-table-column>
                <el-table-column
                    prop="startTimestamp"
                    min-width="50"
                    label="事务开始时间">
                </el-table-column>
                <el-table-column
                    v-if="this.transactionDetail.length >0 && this.transactionDetail[0].commitTimestamp >0"
                    prop="commitTimestamp"
                    min-width="50"
                    label="事务提交时间">
                </el-table-column>
                <el-table-column
                    v-if="this.transactionDetail.length >0 && this.transactionDetail[0].rollbackTimestamp > 0"
                    prop="rollbackTimestamp"
                    min-width="50"
                    label="事务回滚时间">
                </el-table-column>
                <el-table-column
                    min-width="80"
                    label="事务资源">
                  <template slot-scope="scope">
                    <div v-for="path in scope.row.paths">
                      {{ path }}<br>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                    type="expand"
                    width="80"
                    label="事务步骤">
                  <template slot-scope="props">
                    <div v-for="step in props.row.xaTransactionSteps">
                      <el-form inline class="table-expand">
                        <el-form-item label="事务序列：">
                          <span>{{ step.xaTransactionSeq }}</span>
                        </el-form-item>
                        <el-form-item label="交易发起者：">
                          <span>{{ step.username }}</span>
                        </el-form-item>
                        <el-form-item label="资源路径：">
                          <span>{{ step.path }}</span>
                        </el-form-item>
                        <el-form-item label="交易哈希：">
                          <span>{{ step.hash }}</span>
                        </el-form-item>
                        <el-form-item label="调用方法：">
                          <span>{{ step.method }}</span>
                        </el-form-item>
                        <el-form-item label="方法参数：">
                          <span>{{ step.args }}</span>
                        </el-form-item>
                        <el-form-item label="交易时间戳：">
                          <span>{{ step.timestamp }}</span>
                        </el-form-item>
                      </el-form>
                      <el-divider></el-divider>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px;">
            <el-col style="text-align: center">
              <el-button-group>
                <el-button icon="el-icon-back" @click="()=>this.stepActive=1">返回上一步</el-button>
                <el-button type="primary" icon="el-icon-check" @click="commitTransaction">提交事务</el-button>
                <el-button type="primary" icon="el-icon-refresh-left" @click="rollbackTransaction">回滚事务</el-button>
              </el-button-group>
            </el-col>
          </el-row>
        </el-card>
      </el-row>
    </el-collapse-transition>

    <!--  done  -->
    <el-collapse-transition>
      <el-row style="margin-top: 15px" v-if="stepActive === 3">
        <el-card>
          <el-row :gutter="24">
            <el-col :span="2" :offset="11">
              <el-image
                  style="width: 100%; height: 100%"
                  :src="require('@/assets/check-pass.svg')"
                  fit="fill"></el-image>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="text-align: center; margin-top: 20px">
              <span style="color: #579ef8;font-weight:bold; font-size: 20px">已结束当前事务</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="text-align: center; margin-top: 20px">
              <el-button-group>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="reloadTransaction">再开启一段事务
                </el-button>
                <el-button icon="el-icon-search">查看事务列表</el-button>
              </el-button-group>
            </el-col>
          </el-row>
        </el-card>
      </el-row>
    </el-collapse-transition>
  </div>
</template>

<script>
import TransactionForm from '@/views/transactionAdmin/components/TransactionForm'
// import { getResourceList } from '@/api/resource'
import { getXATransaction, sendTransaction } from '@/api/transaction'
import { v4 as uuidV4 } from 'uuid'
import { Message } from 'element-ui'
import treeTransfer from 'el-tree-transfer'
import { listChains } from '@/api/conn'

export default {
  name: 'XATransaction',
  components: {
    TransactionForm,
    treeTransfer
  },
  data() {
    return {
      stepActive: 0,
      transactionDetail: [],
      transactionStep: [],
      paths: [],
      pathDic: {},
      chosenPaths: [],
      fromData: [],
      toData: [],
      transactionForm: {
        transactionID: null,
        path: null,
        method: null,
        args: [{
          value: null,
          key: 0
        }],
        isXATransaction: true
      },
      loading: false,
      submitResponse: null
    }
  },
  created() {
    this.getPaths()
  },
  mounted() {
  },
  methods: {
    addBtn(fromData, toData, obj) {
      console.log('from', fromData)
      console.log('to', toData)
    },
    loadResource(node, resolve, from) {
      console.log(node)
      console.log(resolve)
      console.log(from)
    },
    getPaths() {
      listChains().then(response => {
        const chainList = response.data.data
        for (const chainListKey in chainList) {
          this.fromData.push({
            id: chainListKey,
            pid: 0,
            label: chainList[chainListKey].zone + '.' + chainList[chainListKey].chain,
            children: []
          })
        }
      })
      // getResourceList(null, { 'version': '1', 'data': {}})
      //   .then(response => {
      //     const resourceList = response.data.resourceDetails
      //     for (const resourceListKey in resourceList) {
      //       this.paths.push({
      //         label: resourceList[resourceListKey].path,
      //         key: resourceListKey,
      //         value: resourceList[resourceListKey].path
      //       })
      //       this.pathDic[resourceListKey] = resourceList[resourceListKey].path
      //     }
      //   })
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
    filterMethod(query, item) {
      return item.value.indexOf(query) > -1
    },
    startTransaction() {
      this.$refs['transactionForm'].validate(validate => {
        if (this.chosenPaths == null || this.chosenPaths.length < 1) {
          this.$message({
            message: '开启事务前请先选择资源！', type: 'error', center: true
          })
          return
        }
        if (validate) {
          this.loading = true
          var chosenData = []
          for (const chosenPath of this.chosenPaths) {
            chosenData.push(this.pathDic[chosenPath])
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
      sendTransaction({
        version: '1',
        path: 'test.test.test', // transaction.path,
        data: {
          method: transaction.method,
          args: transaction.args,
          options: {
            'XA_TRANSACTION_ID': this.$store.getters.transactionID,
            'XA_TRANSACTION_SEQ': Date.now()
          }
        }
      }).then(response => {
        if (response.errorCode !== 0) {
          this.$message({
            message: '执行事务失败，错误：' + response.message, type: 'error', center: true
          })
        } else {
          this.getXADetail()
          this.submitResponse = JSON.stringify(response, null, 4)
          this.loading = false
        }
      })
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
        if (response.errorCode !== 0) {
          Message.error({
            message: '获取事务详情失败，错误：' + response.message, center: true
          })
        } else {
          this.transactionDetail.push(response.data.xaTransaction)
          this.transactionStep = response.data.xaTransaction.xaTransactionSteps
        }
      })
    },
    reloadTransaction() {
      this.stepActive = 0
      Object.assign(this.$data, this.$options.data())
      this.getPaths()
    }
  }
}
</script>

<style lang="scss">
.el-transfer {
  .el-transfer-panel {
    width: 220px;
  }

  .el-checkbox {
    text-align: left;
  }
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
  width: 50%;
}

</style>
<style lang="scss" scoped>
</style>
