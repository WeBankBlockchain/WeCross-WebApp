<template>
  <transition name="el-fade-in-linear">
    <div class="app-container">
      <el-row :gutter="10">
        <el-card style="height: 190px" header="管理员信息">
          <el-row>
            <el-col :span="14">
              <el-form label-position="left" size="small" label-width="80px">
                <el-form-item label="管理账户：">
                  <el-tag id="UA" :type="ua.admin ? 'warning': 'success'"><span>{{ ua.username }}</span></el-tag>
                </el-form-item>
                <el-form-item id="uaPK" label="公钥信息：">
                  <el-input v-model="ua.pubKey" type="text" readonly autosize resize="none">
                    <el-tooltip slot="prefix" effect="light" content="复制公钥信息">
                      <clipboard :input-data="ua.pubKey" />
                    </el-tooltip>
                  </el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-row>
                <el-col :span="11">
                  <div>
                    <el-row>
                      <el-col>
                        <el-row>
                          <div style="font-size: 16px;font-weight: bolder">用户数</div>
                          <div style="font-size: 14px; color: #606266; margin-top: 5px">已注册用户</div>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row>
                      <div style="display:inline-block;">
                        <el-button type="text" style="font-size: 26px;font-weight: bolder;">
                          {{ userData.length }}
                        </el-button>
                      </div>
                      <div style="margin-left: 3px; display:inline-block">人</div>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="11" :offset="2">
                  <div>
                    <el-row>
                      <el-col>
                        <el-row>
                          <div style="font-size: 16px;font-weight: bolder">区块链</div>
                          <div style="font-size: 14px; color: #606266; margin-top: 5px">已部署区块链</div>
                        </el-row>
                      </el-col>
                    </el-row>
                    <el-row>
                      <div style="display:inline-block;">
                        <el-button type="text" style="font-size: 26px;font-weight: bolder;">
                          {{ chainNumber }}
                        </el-button>
                      </div>
                      <div style="margin-left: 3px; display:inline-block">条</div>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
      </el-row>
      <el-row :gutter="10" style="margin-top: 10px">
        <el-card style="height: calc(90vh - 190px)" header="用户列表">
          <el-table
            :data="userData.filter(data => !search || data.username.toLowerCase().includes(search.toLowerCase()))"
            size="medium"
            style="width: 100%"
            :stripe="true"
            :fit="true"
          >
            <el-table-column label="用户名" prop="username" />
            <el-table-column label="可操作区块链" prop="allowChainPaths" width="400px">
              <template slot-scope="item">
                <div v-for="(chainItem, index) in item.row.allowChainPaths.slice(0,2)" :key="index" style="display: inline-block; margin: 5px">
                  <el-tag type="info">{{ chainItem }}</el-tag>
                </div>
                <el-popover
                  v-if="item.row.allowChainPaths.length > 2"
                  placement="bottom"
                  width="400px"
                  trigger="click"
                >
                  <el-table :data="makeChainsTable(item.row.allowChainPaths)" max-height="260px">
                    <el-table-column property="id" width="50px" label="序列" />
                    <el-table-column property="name" width="150px" label="区块链名" />
                  </el-table>
                  <el-button slot="reference" type="text" style="margin-left: 5px">更多...</el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="变更时间" prop="updateTimestamp">
              <template slot-scope="scope">
                {{ scope.row.updateTimestamp | formatDate }}
              </template>
            </el-table-column>
            <el-table-column align="right">
              <template slot="header" slot-scope="scope">
                <el-input v-model="search" size="small" placeholder="搜索用户">
                  <el-button slot="prepend" icon="el-icon-refresh" @click="()=>{ getUser(scope)}" />
                </el-input>
              </template>
              <template slot-scope="scope">
                <el-button size="mini" @click="handleAccessBtn(scope.row)">
                  权限管理
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-row>
      <el-dialog :title="'权限管理'" :visible.sync="dialogOpen" :destroy-on-close="true" :modal="true" width="60%">
        <el-row>
          <div style="text-emphasis: center;">
            <div>
              <el-transfer
                v-model="chosenChains"
                filterable
                :titles="['待选链', '可操作链']"
                :button-texts="['取消权限', '添加权限']"
                :format="{
                  noChecked: '${total}',
                  hasChecked: '${checked}/${total}'
                }"
                :data="chainsInfo"
              />
            </div>
          </div>
        </el-row>
        <el-row slot="footer">
          <el-button style="margin-right: 10px" @click="dialogOpen = false">取 消</el-button>
          <el-button type="primary" @click="handleSetAccess">确 定</el-button>
        </el-row>
      </el-dialog>
    </div>
  </transition>
</template>
<script>

import { accessControlListGet, listAccount } from '@/api/ua'
import Clipboard from '@/components/Clipboard/index'
import { parseTime } from '@/utils'
import { listChains, listZones } from '@/api/conn'

export default {
  name: 'AccessManager',
  components: { Clipboard },
  filters: {
    formatDate(time) {
      const date = new Date(time)
      return parseTime(date, null)
    }
  },
  props: {},
  data() {
    return {
      ua: {
        uaID: null,
        pubKey: null,
        username: null,
        admin: true,
        version: 0
      },
      userData: [],
      chainNumber: null,
      chainsInfo: [],
      chosenChains: [],
      dialogOpen: false,
      search: ''
    }
  },
  created() {
    this.getUA()
    this.getUser()
    this.getChains()
  },
  methods: {
    getUA() {
      return listAccount().then((response) => {
        if (!response) {
          this.$message.error('response 为空，请检查后台运行状态')
          return
        }
        this.ua = response.data
      }).catch(error => {
        this.$message({
          message: '网络异常：' + error,
          type: 'error',
          duration: 5000
        })
      })
    },
    getUser() {
      return accessControlListGet(null).then((response) => {
        if (!response) {
          this.$message.error('response 为空，请检查后台运行状态')
          return
        }
        this.userData = response.data
      }).catch(error => {
        this.$message({
          message: '网络异常：' + error,
          type: 'error',
          duration: 5000
        })
      })
    },
    getChains() {
      listZones(null).then(response => {
        const chainsInfo = []
        for (const zone of response.data.data) {
          listChains({ zone: zone }).then(res => {
            for (const chain of res.data.data) {
              chainsInfo.push({
                label: chain.zone + '.' + chain.chain,
                key: zone + '.' + chain.chain
              })
            }
            this.chainNumber = this.chainsInfo.length
          }).catch(_ => {
            this.$message({
              type: 'error',
              message: '获取Chains信息失败，网络错误'
            })
          })
        }
        this.chainsInfo = chainsInfo
      }).catch(_ => {
        this.$message({
          type: 'error',
          message: '获取Zones信息失败，网络错误'
        })
      })
    },
    makeChainsTable(array) {
      var chainsArray = []
      for (let i = 0; i < array.length; i++) {
        chainsArray[i] = { 'id': i, 'name': array[i] }
      }
      return chainsArray
    },
    handleAccessBtn(data) {
      this.dialogOpen = true
      console.log(data)
    },
    handleSetAccess() {
      this.dialogOpen = false
    }
  }
}
</script>

<style scoped>
/deep/ .el-transfer {
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/ .el-button+.el-button{margin-left: 0px;}
/deep/ .el-button [class*=el-icon-]+span{margin-left: 0px;}
/deep/ .el-transfer__buttons {
  display: block;
}
/deep/ .el-transfer__buttons .is-with-texts {
  height: 40px;
  display: block;
  line-height: 40px;
  padding: 0 20px;
}
/deep/ .el-transfer-panel{
  width: 40%;
}
</style>
