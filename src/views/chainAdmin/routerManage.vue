<template>
  <div class="app-container">
    <el-row style="margin-top:20px;">
      <el-card>
        <el-row :gutter="18">
          <el-col :span="6">
            <el-button type="info" plain icon="el-icon-plus" @click="deployRouter">部署跨链路由</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-table
ref="singleTable"
:data="routers"
element-loading-text="加载中..."
stripe
fit
            highlight-current-row
@current-change='onRowChange'>
            <el-table-column label="跨链路由标识" min-width="50">
              <template slot-scope="scope">
                {{ scope.row.nodeID }}
              </template>
            </el-table-column>
            <el-table-column label="IP端口" min-width="130" align="center">
              <template slot-scope="scope">
                {{ scope.row.address }}
              </template>
            </el-table-column>
            <el-table-column label="已接入区块链" min-width="110" align="center">
              <template slot-scope="scope">
                {{ scope.row.chainInfos }}
              </template>
            </el-table-column>
            <el-table-column label="运行状态" min-width="110" align="center">
                正常
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
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { listPeers } from '@/api/conn'

export default {
  name: 'RouterManage',
  props: {},
  data() {
    return {
      routers: []
    }
  },
  created() {
    this.getPeers()
  },
  mounted() {},
  methods: {
    getPeers() {
      listPeers().then(response => {
        this.routers = response.data
      })
    },
    deployRouter() {

    },
    onRowChange() {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>
