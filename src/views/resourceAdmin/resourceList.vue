<template>
  <div class="app-container">
    <div class="mixin-components-container">
      <el-row>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>资源操作</span>
            <el-button size="mini" type="text" style="margin-left:20px;" icon="el-icon-refresh" @click="handleFresh">
              刷新
            </el-button>
          </div>
          <el-input v-model="path" placeholder="Path" :disabled="true">
            <el-button slot="append" class="pan-btn light-blue-btn" @click="handleCall">Call</el-button>
            <el-button slot="append" class="pan-btn light-blue-btn" @click="handleSendTransaction">SendTransaction
            </el-button>
          </el-input>
        </el-card>
      </el-row>
    </div>
    <el-row style="margin-top:20px;">
      <el-card>
        <el-row :gutter="18">
          <el-col :span="12">
            <el-select
                placeholder="请选择链类型"
                size="medium"
                v-model="chainValue"
                style="width: 100%; margin: 2px;">
              <el-option
                  v-for="chain in chainType"
                  :key="chain"
                  :label="chain"
                  :value="chain"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" plain icon="el-icon-search" @click="handleSearch">搜索</el-button>
            <el-button type="info" plain icon="el-icon-delete" @click="handleReset">重置</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-table
              ref="singleTable"
              :data="resourceList"
              element-loading-text="Loading"
              stripe
              fit
              highlight-current-row
              @current-change='handleCurrentRowChange'
              style="width: 100%">
            <el-table-column label="Path" min-width="200">
              <template slot-scope="scope">
                {{ scope.row.path }}
              </template>
            </el-table-column>
            <el-table-column
                label="Stub Type"
                min-width="130"
                align="center"
                :filters="[{text:'BCOS2.0', value: 'BCOS2.0'},{text:'GM_BCOS2.0', value: 'GM_BCOS2.0'},{text:'Fabric1.4', value: 'Fabric1.4'}]"
                :filter-method="(row,value)=> {return row.stubtype === value}">
              <template slot-scope="scope">
                <el-tag :type="scope.row.stubtype | stubFilter">{{ scope.row.stubtype }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="Distance" min-width="110" align="center">
              <template slot-scope="scope">
                {{ scope.row.distance }}
              </template>
            </el-table-column>
            <el-table-column label="Checksum" min-width="110" align="center">
              <template slot-scope="scope">
                {{ scope.row.checksum }}
              </template>
            </el-table-column>
            <el-table-column label="Properties" min-width="300" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.properties }}</span>
              </template>
            </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="资源路径">
                    <span>{{ scope.row.path }}</span>
                  </el-form-item>
                  <el-form-item label="链插件类型">
                    <span>{{ scope.row.stubtype }}</span>
                  </el-form-item>
                  <el-form-item label="路由距离">
                    <span>{{ scope.row.distance }}</span>
                  </el-form-item>
                  <el-form-item label="其他属性">
                    <span>{{ scope.row.properties }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <!--pagination-->
        <el-row :gutter="20" style="margin-top: 20px;text-align: center;">
          <el-pagination
                @current-change="handleCurrentPageChange"
                :current-page="currentPage"
                :page-sizes="[10]"
                :page-size="10"
                layout="total, prev, pager, next, jumper"
                :total="totalSize"
            ></el-pagination>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { getResourceList } from '@/api/resource'
import { listChains } from '@/api/conn'
import { uniqueFilter } from '@/utils'

export default {
  name: 'ResourceList',
  filters: {
    stubFilter(stub) {
      const stubMap = {
        'BCOS2.0': 'success',
        'GM_BCOS2.0': 'gray',
        'Fabric1.4': 'danger'
      }
      return stubMap[stub]
    }
  },
  data() {
    return {
      resourceList: [],
      chainList: [],
      currentPage: 1,
      currentRow: null,
      pageSize: 10,
      path: null,
      chainType: [],
      chainValue: null,
      totalSize: 0
    }
  },
  created() {
    this.fetchChainTypeData()
  },
  methods: {
    fetchChainTypeData() {
      listChains().then(response => {
        this.chainList = response.data.data
        for (const chainListKey of this.chainList) {
          this.chainType.push(chainListKey.zone + '.' + chainListKey.chain)
        }
        this.chainType = this.chainType.filter(uniqueFilter).sort()
      })
    },
    handleCurrentRowChange(val) {
      if (val != null) {
        this.currentRow = val
        this.path = this.currentRow.path
      }
    },
    handleDetail(row) {
      console.log(row)
    },
    handleFresh() {
      this.path = null
      this.$refs.singleTable.setCurrentRow(null)
      this.fetchChainTypeData()
    },
    handleCall() {
      if (this.path != null) {
        console.log(this.path)
      }
    },
    handleSendTransaction() {
      if (this.path != null) {
        console.log(this.path)
      }
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.handleCurrentPageChange(this.currentPage)
    },
    handleChainTypeChange(value) {
      console.log(value)
    },
    handleCurrentPageChange(currentPage) {
      this.currentPage = currentPage
      this.handleSearch()
      console.log(currentPage)
      this.path = null
    },
    handleSearch() {
      if (this.chainValue == null || this.currentPage == null) {
        return
      }
      getResourceList({ chain: this.chainValue, offset: this.currentPage * 10, size: 10 }).then(response => {
        this.resourceList = response.data.items
        const filter = this.chainValue
        this.resourceList = this.resourceList.filter(function(element) {
          return element.path.startsWith(filter + '.')
        })
        this.totalSize = this.resourceList.length
      })
    },
    handleReset() {
      this.chainValue = null
      this.totalSize = 0
      this.resourceList = []
      this.currentRow = null
      this.path = null
      this.currentPage = 1
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.cascadeText {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
