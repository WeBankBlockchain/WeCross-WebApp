<template>
  <div class="app-container">
    <el-row style="margin-top:20px;">
      <el-card>
        <el-row>
          <el-button-group>
            <el-button plain icon="el-icon-refresh" @click="refresh">刷新</el-button>
            <el-button plain icon="el-icon-plus" @click="addRouter">添加跨链路由</el-button>
          </el-button-group>

          <el-button-group style="margin-left: 10px">
            <el-button plain icon="el-icon-circle-plus" @click="onDeployRouter">跨链路由部署向导</el-button>
          </el-button-group>
          <el-pagination
              background
              :page-size="pageSize"
              :pager-count= "9"
              layout="prev, pager, next"
              :total="total"
              style="float: right;"
              :current-page="currentPage"
              @prev-click="prevPage"
              @next-click="nextPage"
              @current-change="setPage">
          </el-pagination>
        </el-row>
        <el-row>
          <el-table ref="singleTable" :data="routers" tooltip-effect="light" fit>
            <el-table-column label="跨链路由别名" min-width="40px" :show-overflow-tooltip="true">:show-overflow-tooltip="true"
              <template slot-scope="item">
                {{ getAlias(item.row.nodeID) !== null ? getAlias(item.row.nodeID) : '未设置' }}
              </template>
            </el-table-column>
            <el-table-column label="跨链路由标识" :show-overflow-tooltip="true">
              <template slot-scope="item">
                {{ item.row.nodeID }}
              </template>
            </el-table-column>
            <el-table-column label="IP端口" min-width="50px">
              <template slot-scope="item">
                {{ item.row.address }}
              </template>
            </el-table-column>
            <el-table-column label="已接入区块链" width="110px">
              <template slot-scope="item">
                <li style="list-style-type:none" v-for="chainItem in item.row.chainInfos">
                  {{ chainItem.name }}
                  <el-tag type="info">{{ chainItem.stubType }}</el-tag>
                </li>
              </template>
            </el-table-column>
            <el-table-column label="运行状态" min-width="30px">
              正常
            </el-table-column>
            <el-table-column label="操作" width="230px">
              <template slot-scope="item">
                <el-button-group>
                  <el-button plain icon="el-icon-edit" @click="setAlias(item.row.nodeID)">设置别名</el-button>
                  <el-button plain icon="el-icon-minus" @click="deleteRouter(item.row.address)">移除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-pagination
              background
              :page-size="pageSize"
              :pager-count= 9
              layout="prev, pager, next"
              :total="total"
              style="float: right;"
              :current-page="currentPage"
              @prev-click="prevPage"
              @next-click="nextPage"
              @current-change="setPage">
          </el-pagination>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import {
  listPeers
} from '@/api/conn'
import {
  removePeer
} from '@/api/conn'
import {
  addPeer
} from '@/api/conn'

export default {
  name: 'RouterManage',
  props: {},
  data() {
    return {
      routers: [],
      pageSize: 10,
      total: 0,
      currentPage: 1
    }
  },
  created() {
    this.refresh()
  },
  mounted() {
  },
  methods: {
    refresh() {
      listPeers({
        offset: (this.currentPage - 1) * 10,
        size: this.pageSize
      }).then(response => {
        this.total = response.data.size
        this.routers = response.data.data
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '刷新失败，网络异常'
        })
      })
    },
    addRouter() {
      this.$prompt('请输入待添加跨链路由的IP和端口，IP和端口使用:分隔', {
        inputPlaceholder: '例子：127.0.0.1:8051',
        inputPattern: /^\d+\.{1}\d+\.{1}\d+\.{1}\d+\:{1}\d+$/,
        inputErrorMessage: '请输入正确格式的IP和端口，例如\'127.0.0.1:8051\''
      }).then(data => {
        addPeer({
          version: '1',
          data: {
            address: data.value
          }
        }).then(response => {
          this.refresh()
        })
      }).catch(() => {

      })
    },
    deleteRouter(address) {
      this.$confirm('确定要删除该跨链路由吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removePeer({
          version: '1',
          data: {
            address: address
          }
        }).then(response => {
          if (response.peerData.errorCode === 0) {
            this.refresh()

            this.$message({
              type: 'success',
              message: '删除成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败，错误码: ' + response.data.errorCode + ' 错误信息: ' + response.data.message
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '删除失败，网络异常'
          })
        })
      }).catch(() => {
      })
    },
    onDeployRouter() {
      this.$router.push('routerGuide')
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
