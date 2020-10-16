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
          <el-input v-model="path" placeholder="path" :disabled="true">
            <el-button slot="append" class="pan-btn light-blue-btn">Call</el-button>
            <el-button slot="append" class="pan-btn light-blue-btn">SendTransaction</el-button>
          </el-input>
        </el-card>
      </el-row>
    </div>
    <el-row style="margin-top:20px;">
      <el-card>
      <el-table
       ref="singleTable"
       v-loading="listLoading"
       :data="list"
       element-loading-text="Loading"
       stripe
       fit
       highlight-current-row
       @current-change='handleCurrentChange'
       style="width: 100%"
     >
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
       :filter-method="filterStub"
       >
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
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { getResourceList } from '@/api/resource'

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
      list: null,
      listLoading: true,
      currentRow: null,
      path: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getResourceList().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.currentRow = val
      this.path = this.currentRow.path
    },
    filterStub(value, row) {
      return row.stubtype === value
    },
    handleDetail(row) {
      console.log(row)
    },
    handleFresh() {
      console.log('fresh')
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
</style>
