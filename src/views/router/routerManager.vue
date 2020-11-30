<template>
  <div class="app-container">
    <el-row>
      <el-card style="height: 90vh">
        <el-row>
          <el-button-group>
            <el-button plain icon="el-icon-refresh" :disabled="loading" @click="refresh">刷新</el-button>
            <el-button plain icon="el-icon-plus" :disabled="loading" @click="addRouter">添加跨链路由</el-button>
          </el-button-group>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-table ref="singleTable" v-loading="loading" :data="routers" fit tooltip-effect="light" height="calc( 90vh - 120px)">
            <el-table-column label="跨链路由别名" min-width="40px" show-overflow-tooltip>
              <template slot-scope="item">
                {{ getAlias(item.row.nodeID) !== null ? getAlias(item.row.nodeID) : '未设置' }}
              </template>
            </el-table-column>
            <el-table-column label="跨链路由标识" :show-overflow-tooltip="true" min-width="60px">
              <template slot-scope="item">
                {{ item.row.nodeID }}
              </template>
            </el-table-column>
            <el-table-column label="IP端口" min-width="60px">
              <template slot-scope="item">
                {{ item.row.address }}
              </template>
            </el-table-column>
            <el-table-column label="已接入区块链" min-width="100px">
              <template slot-scope="item">
                <li v-for="chainItem in item.row.chainInfos" :key="chainItem.name" style="list-style-type:none; margin: 5px">
                  {{ chainItem.name }}
                  <el-tag type="info">{{ chainItem.stubType }}</el-tag>
                </li>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140px">
              <template slot-scope="item">
                <el-button-group>
                  <el-button plain icon="el-icon-edit" @click="setAlias(item.row.nodeID)">设置别名</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-pagination
            style="text-align: center;"
            background
            :page-size="pageSize"
            :pager-count="9"
            layout="prev, pager, next"
            :total="total"
            :current-page="currentPage"
            :disabled="loading"
            @prev-click="prevPage"
            @next-click="nextPage"
            @current-change="setPage"
          />
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { listPeers } from '@/api/conn'
import { addPeer } from '@/api/conn'

export default {
  name: 'RouterManager',
  props: {},
  data() {
    return {
      routers: [],
      pageSize: 10,
      total: 0,
      currentPage: 1,
      loading: false
    }
  },
  created() {
    this.refresh()
  },
  mounted() {
  },
  methods: {
    refresh() {
      this.loading = true
      listPeers({
        offset: (this.currentPage - 1) * 10,
        size: this.pageSize
      }).then(response => {
        this.total = response.data.size
        this.routers = response.data.data

        this.loading = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '刷新失败，网络异常'
        })
        this.loading = false
      })
    },
    addRouter() {
      this.$prompt('请输入待添加跨链路由的IP和端口，IP和端口使用:分隔', {
        inputPlaceholder: '例子：127.0.0.1:8051',
        inputPattern: /^(((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5])):[1-9]\d{0,4}$/,
        inputErrorMessage: '请输入正确格式的IP和端口，例如\'127.0.0.1:8051\''
      }).then(data => {
        addPeer({
          version: '1',
          data: {
            address: data.value
          }
        }).then(response => {
          if (response.errorCode === 0) {
            this.$message({
              type: 'success',
              message: '添加路由 ' + data.value + ' 成功'
            })
            this.refresh()
          } else {
            this.$message({
              type: 'error',
              message: '添加路由 ' + data.value + ' 失败'
            })
          }
        })
      }).catch(() => {

      })
    },
    setAlias(nodeID) {
      this.$prompt('为当前跨链路由设置别名', {}).then(data => {
        localStorage.setItem('routerAlias-' + nodeID, data.value)

        this.refresh()
      })
    },
    getAlias(nodeID) {
      return localStorage.getItem('routerAlias-' + nodeID)
    },
    nextPage() {
      ++this.currentPage
      this.refresh()
    },
    prevPage() {
      --this.currentPage
      this.refresh()
    },
    setPage(page) {
      this.currentPage = page
      this.refresh()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
