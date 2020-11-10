<template>
  <div>
    <el-table ref="singleTable" :data="resources" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column label="资源路径">
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>
      <el-table-column label="资源类型">
        <template slot-scope="scope">
          {{ scope.row.stubType }}
        </template>
      </el-table-column>
      <el-table-column label="属性">
        <template slot-scope="scope">
          <span>{{ scope.row.properties }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button-group>
          <el-button plain icon="el-icon-magic-stick">调用</el-button>
          <el-button plain icon="el-icon-info">详情</el-button>
        </el-button-group>
      </el-table-column>
    </el-table>
    <el-pagination
background
:page-size='pageSize'
layout="prev, pager, next"
:total="total"
style="float: right;"
      :current-page="page"
@prev-click="prevPage"
@next-click="nextPage"
@current-change="setPage">
    </el-pagination>
  </div>
</template>

<script>
import {
  getResourceList
} from '@/api/resource'

export default {
  name: 'ResourceExplorer',
  props: ['chain', 'pageSize'],
  data: function() {
    return {
      total: 0,
      page: 1,
      resources: [],
      queryStatus: {}
    }
  },
  watch: {
    chain: function(val) {
      this.refresh()
    }
  },
  methods: {
    getQueryStatus(path) {
      var status = this.queryStatus[path]
      if (status === undefined) {
        this.queryStatus[path] = {
          page: 0
        }

        status = this.queryStatus[path]
      }

      return status
    },
    refresh() {
      var path = this.chain
      var status = this.getQueryStatus(path)

      getResourceList({
        ignoreRemote: false,
        path: path,
        offset: status.page * this.pageSize,
        size: this.pageSize
      }).then((response) => {
        if (response.errorCode === 0) {
          this.resources = response.data.resourceDetails
          this.total = response.data.total
          this.page = status.page + 1
        } else {
          this.$message({
            type: 'error',
            message: '查询交易列表失败, errorCode: ' + response.errorCode
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
    prevPage() {
      var status = this.getQueryStatus(this.chain)

      --status.page
      this.page = status.page + 1

      this.refresh()
    },
    nextPage() {
      var status = this.getQueryStatus(this.chain)

      ++status.page
      this.page = status.page + 1

      this.refresh()
    },
    setPage(value) {
      var status = this.getQueryStatus(this.chain)

      status.page = value - 1
      this.page = status.page + 1

      this.refresh()
    }
  }
}
</script>

<style>
</style>
