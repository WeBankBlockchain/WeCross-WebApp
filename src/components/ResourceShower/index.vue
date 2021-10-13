<template>
  <div>
    <el-table
      :data="resources"
      tooltip-effect="light"
      height="calc(100% - 40px)"
    >
      <el-table-column label="资源路径" min-width="80px" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.path }}</template>
      </el-table-column>
      <el-table-column label="属性" min-width="100px" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ JSON.stringify(scope.row.properties) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="total"
      style="text-align: center; margin-top: 10px; min-height: 40px"
      :current-page="page"
      @current-change="setPage"
    />
  </div>
</template>

<script>
import {
  getResourceList
} from '@/api/resource'

export default {
  name: 'ResourceShower',
  components: {
  },
  props: {
    chain: {
      type: String,
      default: () => { return null }
    },
    pageSize: {
      type: Number,
      default: () => { return 0 }
    }},
  data: function() {
    return {
      total: 0,
      page: 1,
      resources: [],
      loading: false
    }
  },
  watch: {
    chain: function() {
      this.refresh()
    }
  },
  methods: {
    refresh() {
      getResourceList({
        path: this.chain,
        offset: (this.page - 1) * this.pageSize,
        size: this.pageSize
      }, null).then((response) => {
        if (response.errorCode === 0) {
          this.resources = response.data.resources
          this.total = response.data.total
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
      this.page = value
      this.refresh()
    }
  }
}
</script>

<style>
</style>
