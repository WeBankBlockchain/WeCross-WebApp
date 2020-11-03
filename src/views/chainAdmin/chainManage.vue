<template>
  <div class="app-container">
    <el-row style="margin-top:20px;">
      <el-card>
        <el-row :gutter="18">
          <el-col :span="6">
            <el-button plain icon="el-icon-refresh" @click="refresh">刷新</el-button>
            <el-button plain icon="el-icon-plus" @click="addChain">添加区块链</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-table ref="singleTable" :data="chains" element-loading-text="加载中..." fit>
            <el-table-column label="区块链路径">
              <template slot-scope="item">
                {{ item.row.path }}
              </template>
            </el-table-column>
            <el-table-column label="类型" min-width=30>
              <template slot-scope="item">
                {{ item.row.stubType }}
              </template>
            </el-table-column>
            <el-table-column label="属性" min-width=100>
              <template slot-scope="item">
                <li style="list-style-type:none" v-for="(propItem, propName) in item.row.properties">
                  {{ propName }}:{{ propItem }}
                </li>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="item">
                <el-button plain icon="el-icon-minus" @click="removeChain(item.row.zone, item.row.chain)">断开</el-button>
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
  listChains
} from '@/api/conn'

export default {
  name: 'ChainManage',
  props: {},
  data() {
    return {
      chains: []
    }
  },
  created() {
    this.refresh()
  },
  mounted() {},
  methods: {
    refresh() {
      listChains().then(response => {
        if (this.chains.length > 0) {
          this.$message({
            type: 'success',
            message: '刷新成功'
          })
        }
        this.chains = response.chains
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '刷新失败，网络异常'
        })
      })
    },
    addChain() {
      this.$message({
        type: 'info',
        message: '该功能尚未支持'
      })
    },
    removeChain(zone, chain) {
      this.$message({
        type: 'info',
        message: '该功能尚未支持'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
