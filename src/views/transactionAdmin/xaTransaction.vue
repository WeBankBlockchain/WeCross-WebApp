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
            <el-col style="text-align: center">
              <el-transfer
                  filterable
                  :filter-method="filterMethod"
                  filter-placeholder="请输入资源"
                  :button-texts="['取消','选择']"
                  :titles="['待选资源列表', '已选资源列表']"
                  v-model="chosenPaths"
                  :data="paths">
              </el-transfer>
            </el-col>
          </el-row>
          <el-divider>完成资源路径选择</el-divider>
          <el-row style="margin-top: 20px">
            <el-col :md="{span:12, offset:6}">
              <el-form
                  ref="transactionForm"
                  label-width="auto"
                  label-position="right"
                  :model="transactionForm">
                <el-form-item label="事务ID：" prop="transactionID">
                  <el-input v-model="transactionForm.transactionID" placeholder="请输入事务ID"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="startTransaction">开启事务</el-button>
                  <el-button icon="el-icon-circle-plus" style="margin-left: 15px">生成事务ID</el-button>
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
                <span style="margin-left: 10px">{{ stepHeader }}</span>
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
                @clearClick="clearTransaction"
                @submitClick="submitTransaction"></transaction-form>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-table
                  stripe
                  fit
                  style="width: 100%"
                  :data="transactionStep">
                <el-table-column label="序号" min-width="50px">
                  <template slot-scope="scope">
                    {{scope.row.xaTransactionSeq}}
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
                    min-width="50">
                </el-table-column>
                <el-table-column
                    prop="xaTransactionID"
                    label="事务ID"
                    min-width="70">
                </el-table-column>
                <el-table-column
                    prop="status"
                    min-width="60"
                    label="事务状态">
                </el-table-column>
                <el-table-column
                    prop="startTimestamp"
                    min-width="70"
                    label="事务开始时间">
                </el-table-column>
                <el-table-column
                    v-if="this.transactionDetail[0].commitTimestamp >0"
                    prop="commitTimestamp"
                    min-width="70"
                    label="事务提交时间">
                </el-table-column>
                <el-table-column
                    v-if="this.transactionDetail[0].rollbackTimestamp > 0"
                    prop="rollbackTimestamp"
                    min-width="70"
                    label="事务回滚时间">
                </el-table-column>
                <el-table-column
                    min-width="50"
                    label="事务资源">
                  <template slot-scope="scope">
                    {{ scope.row.paths.toString() }}
                  </template>
                </el-table-column>
                <el-table-column
                    type="expand"
                    width="80px"
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
                <el-button icon="el-icon-back">返回上一步</el-button>
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
           <el-col :span="2" offset="11">
             <el-image
                 style="width: 100%; height: 100%"
                 :src="require('@/assets/check-pass.svg')"
                 fit="fill"></el-image>
           </el-col>
          </el-row>
          <el-row >
           <el-col style="text-align: center; margin-top: 20px">
             <span style="color: #579ef8;font-weight:bold; font-size: 20px">已结束当前事务</span>
           </el-col>
          </el-row>
          <el-row >
            <el-col style="text-align: center; margin-top: 20px">
              <el-button-group>
                <el-button type="primary" icon="el-icon-circle-plus-outline">再开启一段事务</el-button>
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

export default {
  name: 'XATransaction',
  components: {
    TransactionForm
  },
  props: {},
  data() {
    return {
      stepHeader: '事务交易列表',
      stepActive: 0,
      transactionDetail: [{
        'username': 'user',
        'xaTransactionID': '001',
        'status': 'committed',
        'startTimestamp': '2384923894',
        'commitTimestamp': '2384923894',
        'rollbackTimestamp': '0',
        'paths': [
          'a.b.1',
          'a.b.2'
        ],
        'xaTransactionSteps': [
          {
            'username': 'user',
            'xaTransactionSeq': 1,
            'path': 'a.b.1',
            'hash': '0x12',
            'method': 'set',
            'args': 'hello',
            'timestamp': '121289384'
          },
          {
            'username': 'user',
            'xaTransactionSeq': 2,
            'path': 'a.b.2',
            'hash': '0x123',
            'method': 'set',
            'args': 'world',
            'timestamp': '121289384'
          }
        ]
      }],
      transactionStep: [
        {
          'username': 'user',
          'xaTransactionSeq': 1,
          'path': 'a.b.1',
          'hash': '0x12',
          'method': 'set',
          'args': 'hello',
          'timestamp': '121289384'
        },
        {
          'username': 'user',
          'xaTransactionSeq': 2,
          'path': 'a.b.2',
          'hash': '0x123',
          'method': 'set',
          'args': 'world',
          'timestamp': '121289384'
        }
      ],
      paths: [{
        label: 'payment.bcos.1',
        key: 1,
        value: 'payment.bcos.1'
      }, {
        label: 'payment.bcos.2',
        key: 2,
        value: 'payment.bcos.2'
      }, {
        label: 'payment.fabric.1',
        key: 3,
        value: 'payment.fabric.1'
      }],
      chosenPaths: [],
      transactionForm: {
        transactionID: null,
        path: null,
        method: null,
        args: [{
          value: null,
          key: 0
        }],
        isXATransaction: true
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    submitTransaction(transaction) {
      console.log('外部')
      console.log(transaction)
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
    filterMethod(query, item) {
      return item.value.indexOf(query) > -1
    },
    startTransaction() {
      this.stepActive = 1
    },
    commitTransaction() {
      this.stepActive = 3
    },
    rollbackTransaction() {
      this.stepActive = 3
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
