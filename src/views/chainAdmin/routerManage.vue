<template>
  <div class="app-container">
    <el-row style="margin-top:20px;">
      <el-card>
        <el-row :gutter="18">
          <el-col :span="6">
            <el-button plain icon="el-icon-refresh" @click="refresh">刷新</el-button>
            <el-button plain icon="el-icon-plus" @click="addRouter">添加跨链路由</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-table ref="singleTable" :data="routers" element-loading-text="加载中..." fit highlight-current-row>
            <el-table-column label="跨链路由标识">
              <template slot-scope="item">
                {{ item.row.nodeID }}
              </template>
            </el-table-column>
            <el-table-column label="IP端口">
              <template slot-scope="item">
                {{ item.row.address }}
              </template>
            </el-table-column>
            <el-table-column label="已接入区块链">
              <template slot-scope="item">
                <li style="list-style-type:none" v-for="chainItem in item.row.chainInfos">
                  {{ chainItem.name }} <el-tag type="info">{{ chainItem.stubType }}</el-tag>
                </li>
              </template>
            </el-table-column>
            <el-table-column label="运行状态">
              正常
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="item">
                <el-button plain icon="el-icon-minus" @click="deleteRouter(item.row.address)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
      routers: []
    }
  },
  created() {
    this.refresh()
  },
  mounted() {},
  methods: {
    refresh() {
      listPeers().then(response => {
        this.routers = response.data
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
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
