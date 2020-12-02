<template>
  <div class="wl-transfer" :style="{ width, height }">
    <!-- transfer left -->
    <div class="transfer-base">
      <h3 class="transfer-title">
        <span>待选资源列表</span>
      </h3>
      <div class="transfer-left">

        <!-- transfer left panel -->
        <div class="transfer-main">
          <el-input v-model="filterFrom" placeholder="输入关键字进行过滤" size="small" class="filter-tree" />
          <el-tree
            ref="from-tree"
            lazy
            node-key="key"
            :load="leftLoadNode"
            :props="defaultProps"
            highlight-current
            :filter-node-method="filterNodeFrom"
            @node-click="onChainClick"
          />
        </div>
      </div>
      <div class="transfer-left-table">
        <div class="transfer-main">
          <el-table
            ref="finderTable"
            stripe
            tooltip-effect="light"
            :data="tableShowData"
            height="calc(100% - 34px)"
            @selection-change="handleSelectionChange"
          >
            <el-table-column fixed width="42px" type="selection" :selectable="(row,index)=>{return !row.path.endsWith('.WeCrossHub')}" />
            <el-table-column label="可选资源路径" prop="path" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.path }}</template>
            </el-table-column>
          </el-table>
          <el-pagination
            small
            :pager-count="5"
            :page-size="pageObject.pageSize"
            layout="prev, pager, next"
            :total="pageObject.totalPageNumber"
            style="text-align: center; margin-top: 10px; height: 20px"
            :current-page.sync="pageObject.currentPage"
            @current-change="setPage"
            @prev-click="prevPage"
            @next-click="nextPage"
          />
        </div>
      </div>
    </div>
    <!-- transfer button -->
    <div class="transfer-center">
      <template>
        <p class="transfer-center-item">
          <el-button :disabled="from_disabled" @click="addToAims">
            {{ "添加" }}
            <i class="el-icon-arrow-right" />
          </el-button>
        </p>
        <p class="transfer-center-item">
          <el-button
            :disabled="to_disabled"
            icon="el-icon-arrow-left"
            @click="removeToSource"
          >{{ "移除" }}
          </el-button>
        </p>
      </template>
    </div>
    <!-- transfer right  -->
    <div class="transfer-right">
      <h3 class="transfer-title">
        <el-checkbox
          v-model="to_check_all"
          :indeterminate="to_is_indeterminate"
          @change="toAllBoxChange"
        />
        <span>已选资源列表</span>
      </h3>
      <!-- transfer right panel -->
      <div class="transfer-main">
        <el-input v-model="filterTo" placeholder="输入关键字进行过滤" size="small" class="filter-tree" />
        <el-checkbox-group v-model="to_check_keys" class="transfer-right-panel">
          <el-checkbox
            v-for="item in toDataFilter"
            :key="item.path"
            class="el-transfer-panel__item"
            :label="item.path"
          />
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>

import { listChains, listZones } from '@/api/conn'
import { uniqueObjectArray } from '@/utils'

export default {
  name: 'ResourceTransfer',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '450px'
    },
    resourceData: {
      type: Array,
      default: () => []
    },
    pageObject: {
      required: true,
      type: Object,
      default: () => {
        return {
          currentPage: 0,
          totalPageNumber: 0,
          pageSize: 0
        }
      }
    },
    toData: {
      type: Array,
      default: () => []
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'name',
          disabled: 'disabled',
          isLeaf: 'hasChildren'
        }
      }
    }
  },
  data() {
    return {
      to_is_indeterminate: false,
      to_check_all: false,
      from_disabled: true,
      to_disabled: true,
      from_check_keys: [],
      to_check_keys: [],
      filterFrom: '',
      filterTo: '',
      tableShowData: [],
      toShowData: this.toData,
      toDataFilter: []
    }
  },
  watch: {
    resourceData(val) {
      this.tableShowData = val.filter((item) => {
        return JSON.stringify(this.toShowData).indexOf(JSON.stringify(item)) === -1
      })
    },
    from_check_keys(val) {
      this.from_disabled = (val.length === 0)
    },
    to_check_keys(val) {
      if (val.length > 0) {
        this.to_disabled = false
        this.to_is_indeterminate = val.length < this.toShowData.length
        this.to_check_all = val.length === this.toShowData.length
      } else {
        this.to_disabled = true
        this.to_is_indeterminate = false
        this.to_check_all = false
      }
    },
    filterFrom(val) {
      this.$refs['from-tree'].filter(val)
    },
    filterTo(val) {
      this.toDataFilter = this.toShowData
      this.toFilter(val)
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    prevPage() {
      this.$emit('prev-click')
    },
    setPage(value) {
      this.$emit('current-change', value)
    },
    nextPage() {
      this.$emit('next-click')
    },
    addToAims() {
      this.toShowData = this.toShowData.concat(this.from_check_keys)
      this.toDataFilter = this.toShowData

      for (const fromCheckKey of this.from_check_keys) {
        this.tableShowData = this.tableShowData.filter((item) => item.path !== fromCheckKey.path)
      }
      this.from_check_keys = []

      this.$emit('add-button')
      this.$emit('update:toData', this.toShowData)
    },
    removeToSource() {
      for (const toDatum of this.to_check_keys) {
        if (toDatum.startsWith(this.$refs['from-tree'].getCurrentKey() + '.')) {
          this.tableShowData.push({ path: toDatum })
        }
        this.toShowData = this.toShowData.filter((item) => item.path !== toDatum)
      }
      this.to_check_keys = []
      this.toDataFilter = this.toShowData
      this.toFilter(this.filterTo)

      this.$emit('remove-button')
      this.$emit('update:toData', this.toShowData)
    },
    handleSelectionChange(val) {
      this.from_check_keys = val
    },
    onChainClick(data) {
      if (data.type === 'zone') {
        this.$emit('zone-click', data.key)
      } else if (data.type === 'chain') {
        this.$emit('chain-click', data.key, data.data)
      }
    },
    leftLoadNode(node, resolve) {
      if (node.level === 0) {
        listZones({
          offset: 0,
          size: 0
        }).then(response => {
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
    toAllBoxChange(val) {
      if (this.toShowData.length === 0) {
        return
      }
      if (val) {
        const check_keys = []
        for (const toData of this.toDataFilter) {
          check_keys.push(toData.path)
        }
        this.to_check_keys = check_keys
      } else {
        this.to_check_keys = []
      }
    },
    filterNodeFrom(value, data) {
      if (!value) return true
      return data['key'].indexOf(value) !== -1
    },
    toFilter(value) {
      this.toDataFilter = this.toDataFilter.filter((item) => {
        return item.path.indexOf(value) > -1
      })
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

table,
th,
td,
img {
  border: 0;
}

em,
i,
th {
  font-style: normal;
  text-decoration: none;
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

input,
select,
button,
textarea,
table {
  margin: 0;
  font-family: inherit;
  font-size: 100%;
}

input,
button {
  outline: none;
}

ul,
ol {
  list-style: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

th,
caption {
  text-align: left;
}

a {
  color: #666;
  text-decoration: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}

.wl-transfer {
  position: relative;
  overflow: hidden;

  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }

  .transfer-base {
    border: 1px solid #ebeef5;
    margin-left: 5%;
    width: 50%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    vertical-align: middle;
  }

  .transfer-left {
    position: absolute;
    top: 41px;
    left: 5%;
  }

  .transfer-left-table {
    position: absolute;
    top: 41px;
    left: 30%;
  }

  .transfer-right {
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 5%;
  }

  .transfer-right-only {
    height: 100%;
  }

  .transfer-main {
    padding: 10px;
    height: calc(100% - 40px);
    box-sizing: border-box;
    overflow: auto;
  }

  .transfer-left {
    width: 25%;
    height: 100%;
    vertical-align: middle;
  }

  .transfer-left-table {
    width: 25%;
    height: 100%;
    vertical-align: middle;
  }

  .transfer-right-panel{
    margin:0;
    padding:6px 0;
    list-style:none;
    height: calc(100% - 40px);
    overflow:auto;
    -webkit-box-sizing:border-box;
    box-sizing:border-box
  }

  .transfer-right {
    border: 1px solid #ebeef5;
    width: 25%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    vertical-align: middle;
  }

  .transfer-center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 25%;
    transform: translateY(-50%);
    text-align: center;
  }

  .transfer-center-item {
    padding: 10px;
    overflow: hidden;
  }

  .transfer-title {
    border-bottom: 1px solid #ebeef5;
    padding: 0 15px;
    height: 40px;
    line-height: 40px;
    color: #333;
    font-size: 16px;
    background-color: #f5f7fa;
  }

  .transfer-title .el-checkbox {
    margin-right: 10px;
  }

  .filter-tree {
    margin-bottom: 10px;
  }
}
</style>
