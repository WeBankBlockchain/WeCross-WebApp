<template>
  <div class="app-container">
    <el-row style="margin-top:20px;">
      <el-card>
        <el-row>
          <el-button-group>
            <el-button plain icon="el-icon-refresh" @click="refresh">刷新</el-button>
            <el-button plain icon="el-icon-plus" @click="addChain">添加区块链</el-button>
          </el-button-group>

          <el-pagination
background
:page-size="pageSize"
pager-count=9
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
          <el-table ref="singleTable" :data="chains" element-loading-text="加载中..." fit>
            <el-table-column type="expand">
              <!--
              <template slot-scope="item">
                <el-form label-position="left" class="demo-table-expand">

                  <el-form-item v-for="(propItem, propName) in item.row.properties" v-bind:label="propName">
                    <span>{{ propItem }}</span>
                  </el-form-item>

                </el-form>
              </template>
              -->
            </el-table-column>
            <el-table-column label="区块链路径">
              <template slot-scope="item">
                {{ item.row.zone }}.{{ item.row.chain}}
              </template>
            </el-table-column>
            <el-table-column label="类型">
              <template slot-scope="item">
                {{ item.row.type }}
              </template>
            </el-table-column>
            <el-table-column label="块高">
              <template slot-scope="item">
                {{ item.row.blockNumber }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="item">
                <el-button-group>
                  <el-button plain icon="el-icon-magic-stick">资源浏览</el-button>
                  <el-button plain icon="el-icon-upload2">部署资源</el-button>
                  <el-button plain icon="el-icon-minus" @click="removeChain(item.row.zone, item.row.chain)">断开</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row>
          <el-pagination
background
:page-size="pageSize"
pager-count=9
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
  listChains
} from '@/api/conn'

export default {
  name: 'ChainManage',
  props: {},
  data() {
    return {
      chains: [],
      pageSize: 10,
      total: 0,
      currentPage: 1
    }
  },
  created() {
    this.refresh()
  },
  mounted() {},
  methods: {
    refresh() {
      listChains({
        offset: (this.currentPage - 1) * 10,
        size: this.pageSize
      }).then(response => {
        this.chains = response.data.data
        this.total = response.data.size
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
