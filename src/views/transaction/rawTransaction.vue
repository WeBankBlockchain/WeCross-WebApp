<template>
  <div class="app-container">
    <el-card>
      <template slot="header">
        <el-page-header content="交易发起页面" title="交易管理" @back="() => {this.$router.push({ path: 'transactionList' })}" />
      </template>
      <el-row type="flex" justify="center" style="margin-top: 20px">
        <el-col :span="12">
          <transaction-form
            ref="transactionForm"
            v-loading="loading"
            :transaction="transactionData"
            @clearClick="onClearTransaction"
            @submitClick="onSubmit"
          >
            <template slot="path">
              <el-input v-model="transactionData.path" placeholder="请输入资源路径" style="width: 100%">
                <el-button slot="append" icon="el-icon-search" @click="onClickSerch">浏览</el-button>
              </el-input>
              <el-dialog :visible.sync="startSelectPath">
                <div class="wl-finder">
                  <el-row class="finder-title">
                    <span style="margin-left: 10px">待选资源列表</span>
                  </el-row>
                  <el-row :style="{height}">
                    <el-col>
                      <div class="finder-chain">
                        <el-tree
                          ref="from-tree"
                          lazy
                          node-key="key"
                          :load="onLoadNode"
                          :props="chainProps"
                          highlight-current
                          @node-click="onNodeClick"
                        />
                      </div>
                    </el-col>
                    <el-col>
                      <div class="finder-path">
                        <el-table
                          ref="finderTable"
                          :show-header="false"
                          stripe
                          tooltip-effect="dark"
                          :data="paths"
                          height="85%"
                          :highlight-current-row="true"
                          @row-click="onSelectRow"
                          @selection-change="onSelectChange"
                        >
                          <el-table-column fixed width="42px" type="selection" />
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
                          style="text-align: center; margin-top: 16px"
                          :current-page.sync="pageObject.currentPage"
                          @current-change="updatePageAndFetchPaths"
                        />
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <span slot="footer" style="margin-right: 80px">
                  <el-button type="primary" @click="startSelectPath = false">确 定</el-button>
                </span>
              </el-dialog>
            </template>
          </transaction-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>

import { call, sendTransaction } from '@/api/transaction'
import { getResourceList } from '@/api/resource'
import { listChains, listZones } from '@/api/conn'
import TransactionForm from '@/views/transaction/components/TransactionForm'
import { uniqueObjectArray } from '@/utils'

export default {
  name: 'RawTransaction',
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
      selectList: null,
      loading: false,
      selection: null
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    onClickSerch() {
      if (typeof this.selection !== 'undefined' && this.selection !== null) {
        this.transactionData.path = this.selection.path
      }
      this.startSelectPath = true
      const tempPath = this.transactionData.path
      this.$refs.transactionForm.clearForm()
      this.transactionData.path = tempPath
    },
    onSelectRow(row) {
      this.$refs.finderTable.clearSelection()
      this.$refs.finderTable.toggleRowSelection(row, true)
      this.transactionData.path = row.path
      this.selection = row
      console.log('onSelectRow, current path:', this.transactionData.path)
    },
    onSelectChange(rows) {
      this.transactionData.path = null
      if (rows.length === 1) {
        this.transactionData.path = rows[0].path
        console.log('onSelectChange, current path:', this.transactionData.path)
      } else {
        rows.filter((it, index) => {
          if (index === rows.length - 1) {
            this.$refs.finderTable.toggleRowSelection(it, true)
            this.transactionData.path = it.path
            this.selection = it
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
    onNodeClick(data) {
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
    onClearTransaction() {
      this.transactionData.method = null
      this.transactionData.args = [{
        value: null,
        key: 0
      }]
    },
    onSubmit(transaction) {
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
            args: args
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
            args: args
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
      this.$refs.transactionForm.onResponse(response)
    }
  }
}
</script>

<style lang="scss" scoped>
.wl-finder {
  position: relative;
  overflow: hidden;

  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }

  .finder-title {
    margin-left: 10%;
    border: 1px solid #ebeef5;
    width: 81%;
    color: #333;
    font-size: 16px;
    box-sizing: border-box;
    background-color: #f5f7fa;
    vertical-align: middle;
  }

  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }

  .finder-chain {
    position: absolute;
    top: 0;
    left: 0;
    margin-left: 10%;
    border: 1px solid #ebeef5;
    width: 34.1%;
    height: 100%;
    box-sizing: border-box;
    vertical-align: middle;
  }

  .finder-path {
    position: absolute;
    top: 0;
    left: 31%;
    margin-left: 13%;
    border: 1px solid #ebeef5;
    width: 47%;
    height: 100%;
    box-sizing: border-box;
    vertical-align: middle;
  }
}
</style>
