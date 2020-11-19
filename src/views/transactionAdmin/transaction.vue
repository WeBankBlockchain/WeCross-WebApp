<template>
  <div id="app">
    <el-row type="flex" justify="center" style="margin-top: 20px">
      <el-col :span="12">
        <transaction-form
          :transaction="transactionData"
          :submit-response="submitResponse"
          v-loading="loading"
          @clearClick="clearTransaction"
          @submitClick="onSubmit"
        >
          <template slot="path">
            <el-input v-model="transactionData.path" placeholder="请输入资源路径" style="width: 100%">
              <el-button slot="append" icon="el-icon-search" @click="startSelectPath = true"></el-button>
            </el-input>
            <el-dialog :visible.sync="startSelectPath">
              <el-row type="flex" justify="center" class="wl-finder" :style="{ width, height }">
                <el-col>
                  <div class="finder-chain">
                    <h3 class="finder-title">
                      <span>待选链列表</span>
                    </h3>
                    <el-tree
                      ref="from-tree"
                      lazy
                      node-key="key"
                      :load="onLoadNode"
                      :props="chainProps"
                      highlight-current
                      @node-click="onNodeClick"
                    ></el-tree>
                  </div>
                </el-col>
                <el-col>
                  <div class="finder-path">
                    <h3 class="finder-title">
                      <span>待选资源列表</span>
                    </h3>
                    <el-table
                      :show-header="false"
                      stripe
                      tooltip-effect="dark"
                      ref="finderTable"
                      :data="paths"
                      height="80%"
                      :highlight-current-row="true"
                      @row-click="onSelectRow"
                      @selection-change="onSelectChange"
                    >
                      <el-table-column fixed width="42px" type="selection"></el-table-column>
                      <el-table-column show-overflow-tooltip>
                        <template slot-scope="scope">{{ scope.row.path }}</template>
                      </el-table-column>
                    </el-table>
                    <el-pagination
                      small
                      :pager-count="5"
                      :page-size="pageObject.pageSize"
                      layout="prev, pager, next, jumper"
                      :total="pageObject.totalPageNumber"
                      style="text-align: center; margin-top: 5px"
                      :current-page.sync="pageObject.currentPage"
                      @current-change="updatePageAndFetchPaths"
                    ></el-pagination>
                  </div>
                </el-col>
              </el-row>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="startSelectPath = false">确 定</el-button>
              </span>
            </el-dialog>
          </template>
        </transaction-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { call, sendTransaction } from '@/api/transaction'
import { getResourceList } from '@/api/resource'
import { listChains, listZones } from '@/api/conn'
import TransactionForm from '@/views/transactionAdmin/components/TransactionForm'
import { uniqueObjectArray } from '@/utils'

export default {
  name: 'Transaction',
  components: {
    TransactionForm
  },
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    }
  },
  data() {
    return {
      paths: [],
      currentChain: null,
      chainProps: {
        children: 'children',
        label: 'name',
        disabled: 'disabled',
        isLeaf: 'hasChildren'
      },
      pageObject: {
        currentPage: 1,
        totalPageNumber: 0,
        pageSize: 10
      },
      startSelectPath: false,
      transactionData: {
        path: null,
        method: null,
        args: [{
          value: null,
          key: 0
        }],
        execMethod: 'sendTransaction',
        isXATransaction: false
      },
      selectlist: null,
      loading: false,
      submitResponse: null
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    onSelectRow(row) {
      this.$refs.finderTable.clearSelection()
      this.$refs.finderTable.toggleRowSelection(row, true)
      this.transactionData.path = row.path
      console.log('onSelectRow, current path:', this.transactionData.path)
    },
    onSelectChange(rows) {
      if (rows.length === 1) {
        this.transactionData.path = rows[0].path
        console.log('onSelectChange, current path:', this.transactionData.path)
      } else {
        rows.filter((it, index) => {
          if (index === rows.length - 1) {
            this.$refs.finderTable.toggleRowSelection(it, true)
            this.transactionData.path = it.path
            console.log('onSelectChange, current path:', this.transactionData.path)
            return true
          } else {
            this.$refs.finderTable.toggleRowSelection(it, false)
            return false
          }
        })
      }
    },
    fetchPaths() {
      console.log('fetchPaths, path:', this.currentChain, 'pageObject:', this.pageObject)
      this.paths = []
      getResourceList({
        path: this.currentChain,
        offset: (this.pageObject.currentPage - 1) * this.pageObject.pageSize,
        size: this.pageObject.pageSize
      }, {
        ignoreRemote: false
      }).then((response) => {
        if (response.errorCode === 0) {
          const resourceList = response.data.resourceDetails
          for (const resource of resourceList) {
            this.paths.push({ path: resource.path })
          }
          this.pageObject.totalPageNumber = response.data.total
          console.log('fetchPaths: ', this.paths, 'page: ', this.pageObject)
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
    updatePageAndFetchPaths(value) {
      this.pageObject.currentPage = value
      this.fetchPaths()
    },
    onNodeClick(data, node, self) {
      if (data.type === 'zone') {
        this.paths = []
      } else if (data.type === 'chain') {
        this.currentChain = data.key
        this.paths = []
        this.fetchPaths()
      }
    },
    onLoadNode(node, resolve) {
      if (node.level === 0) {
        listZones({
          offset: 0,
          size: 0
        }).then(response => {
          console.log('listZones: ', response)
          if (response.errorCode === 0) {
            let zones = []
            for (const zone of response.data.data) {
              zones.push({
                name: zone,
                children: [],
                hasChildren: false,
                type: 'zone',
                key: zone
              })
            }
            zones = uniqueObjectArray(zones)
            return resolve(zones)
          } else {
            this.$message({
              type: 'error',
              message: '获取分区列表失败: ' + response.errorCode + ' 错误信息: ' + response.message
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '网络异常'
          })
        })
      }
      if (node.level === 1) {
        const zone = node.data.key
        listChains({
          zone: zone,
          offset: 0,
          size: 0
        }).then(response => {
          if (response.errorCode === 0) {
            let chains = []
            for (const chain of response.data.data) {
              chains.push({
                name: chain.chain,
                children: [],
                hasChildren: true,
                type: 'chain',
                key: chain.zone + '.' + chain.chain
              })
            }
            chains = uniqueObjectArray(chains)
            return resolve(chains)
          } else {
            this.$message({
              type: 'error',
              message: '获取区块链列表失败: ' + response.errorCode + ' 错误信息: ' + response.message
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '网络异常'
          })
        })
      }
    },
    clearTransaction() {
      this.transactionData.args = [{
        value: null,
        key: 0
      }]
      this.submitResponse = null
    },
    onSubmit(transaction) {
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
            args: args
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
            args: args
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
      }
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  line-height: 1.666;
  color: #666;
  font-size: 14px;
}

body,
h1,
h2,
h3,
h4,
h5,
h6,
ul,
ol,
li,
p,
dl,
dt,
dd,
table,
th,
td {
  margin: 0;
  padding: 0;
}

h1,
h2,
h3,
h4,
h5,
h6,
th,
strong {
  font-size: 100%;
  font-weight: normal;
}

.wl-finder {
  position: relative;
  overflow: hidden;

  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }

  .finder-title {
    border-bottom: 1px solid #ebeef5;
    padding: 0 15px;
    height: 40px;
    line-height: 40px;
    color: #333;
    font-size: 16px;
    background-color: #f5f7fa;
  }

  .finder-chain {
    position: absolute;
    top: 0;
    left: 0;
  }

  .finder-path {
    position: absolute;
    top: 0;
    left: 31%;
  }

  .finder-chain {
    margin-left: 10%;
    border: 1px solid #ebeef5;
    width: 34%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    vertical-align: middle;
  }

  .finder-path {
    margin-left: 13%;
    border: 1px solid #ebeef5;
    width: 47%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    vertical-align: middle;
  }
}
</style>
