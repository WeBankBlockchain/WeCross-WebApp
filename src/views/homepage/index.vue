<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-card>
              <el-row>
                <el-col :span="16">
                  <el-row>
                    <div style="font-size: 18px;font-weight: bolder">区块链</div>
                    <div style="font-size: 14px; color: #606266; margin-top: 5px">已部署区块链</div>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-image
                    style="width: 50px;height: 50px;float:right"
                    :src="require('@/assets/icon-bc.svg')"
                    fit="fill"
                  />
                </el-col>
              </el-row>
              <el-row>
                <div style="display:inline-block;">
                  <el-button type="text" style="margin-top: 40px;font-size: 32px;font-weight: bolder;" @click="$router.push({path: 'transaction'})">
                    {{ chainNumber }}
                  </el-button>
                </div>
                <div style="margin-left: 3px; display:inline-block">条</div>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <el-row>
                <el-col :span="16">
                  <el-row>
                    <div style="font-size: 18px;font-weight: bolder">路由</div>
                    <div style="font-size: 14px; color: #606266; margin-top: 5px">已接入路由</div>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-image
                    style="width: 50px;height: 50px;float:right"
                    :src="require('@/assets/icon-ly.svg')"
                    fit="fill"
                  />
                </el-col>
              </el-row>
              <el-row>
                <div style="display:inline-block">
                  <el-button type="text" style="margin-top: 40px;font-size: 32px;font-weight: bolder;" @click="$router.push({path: 'router'})">
                    {{ routerNumber }}
                  </el-button>
                </div>
                <div style="margin-left: 3px; display:inline-block">个</div>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="margin-top: 10px">
          <el-col :span="12">
            <el-card>
              <el-row>
                <el-col :span="16">
                  <el-row>
                    <div style="font-size: 18px;font-weight: bolder">资源</div>
                    <div style="font-size: 14px; color: #606266; margin-top: 5px">已有资源</div>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-image
                    style="width: 50px;height: 50px;float:right"
                    :src="require('@/assets/icon-zy.svg')"
                    fit="fill"
                  />
                </el-col>
              </el-row>
              <el-row>
                <div style="display:inline-block">
                  <el-button type="text" style="margin-top: 40px;font-size: 32px;font-weight: bolder;" @click="$router.push({path: 'resource'})">
                    {{ resourceNumber }}
                  </el-button>
                </div>
                <div style="margin-left: 3px; display:inline-block">个</div>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <el-row>
                <el-col :span="16">
                  <el-row>
                    <div style="font-size: 18px;font-weight: bolder">事务支持</div>
                    <div style="font-size: 14px; color: #606266; margin-top: 5px">支持事务形式</div>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-image
                    style="width: 50px;height: 50px;float:right"
                    :src="require('@/assets/icon-sw.svg')"
                    fit="fill"
                  />
                </el-col>
              </el-row>
              <el-row>
                <div style="margin-top: 42px">
                  <li v-for="item in transactionType" :key="item.label" style="font-size: 16px;">
                    <el-button v-if="!item.disabled" type="text" size="medium" style="font-weight: bolder;font-size: 16px;" @click="$router.push({path:'xaTransaction'})">
                      {{ item.label }}
                    </el-button>
                    <span v-else>
                      {{ item.label }}
                    </span>
                  </li>
                </div>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-card style="height: 390px">
          <template slot="header">
            <span>区块链信息</span>
            <el-button icon="el-icon-refresh-left" type="text" style="padding: 0px;float:right" @click="refreshChainsInfo">刷新</el-button>
          </template>
          <el-table
            v-loading="chainsInfoLoading"
            :data="chainsInfo"
            style="width: 100%;"
            height="300px"
            tooltip-effect="light"
          >
            <el-table-column
              prop="path"
              label="链路径"
              min-width="100px"
              show-overflow-tooltip
            />
            <el-table-column
              prop="type"
              label="链类型"
              min-width="80px"
            >
              <template slot-scope="scope"><el-tag type="info">{{ scope.row.type }}</el-tag></template>
            </el-table-column>
            <el-table-column
              prop="number"
              label="区块高度"
              min-width="60px"
            />
            <el-table-column
              label="资源详情"
              min-width="60px"
            >
              <template slot-scope="scope">
                <el-popover
                  placement="bottom"
                  width="600"
                  trigger="click"
                  @show="pushToResourceDetail(scope.row.path)"
                >
                  <ResourceShower :ref="scope.row.path" :key="chainSelect" :chain="chainSelect" :page-size="10" style="height: 400px;width: 100%" />
                  <el-button
                    slot="reference"
                    type="text"
                    size="mini"
                  >
                    详情</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="12">
        <el-card style="min-height: 45vh;overflow-y:auto">
          <div slot="header">
            <span>本地系统信息</span>
          </div>
          <table>
            <tr>
              <td>操作系统名称：</td>
              <td>{{ systemInfo.osName }}</td>
            </tr>
            <tr>
              <td>操作系统架构：</td>
              <td>{{ systemInfo.osArch }}</td>
            </tr>
            <tr>
              <td>操作系统版本：</td>
              <td>{{ systemInfo.osVersion }}</td>
            </tr>
            <tr>
              <td>JVM名称：</td>
              <td>{{ systemInfo.javaVMName }}</td>
            </tr>
            <tr>
              <td>JVM供应商：</td>
              <td>{{ systemInfo.javaVMVendor }}</td>
            </tr>
            <tr>
              <td>JVM版本：</td>
              <td>{{ systemInfo.javaVMVersion }}</td>
            </tr>
            <tr>
              <td>密码学组件名：</td>
              <td>{{ systemInfo.providerName }}</td>
            </tr>
            <tr>
              <td>密码学组件版本：</td>
              <td>{{ systemInfo.providerVersion }}</td>
            </tr>
            <tr>
              <td>已配置的椭圆曲线：</td>
              <td>{{ systemInfo.namedGroups }}</td>
            </tr>
            <tr>
              <td>密码学组件详细信息：</td>
              <td>{{ systemInfo.providerInfo }}</td>
            </tr>
          </table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="height: 45vh">
          <div slot="header">
            <span>本地路由信息</span>
          </div>
          <table>
            <tr>
              <td>跨链路由版本：</td>
              <td>{{ routerInfo.version }}</td>
            </tr>
            <tr>
              <td>已加载的插件：</td>
              <td>{{ routerInfo.supportedStubs }}</td>
            </tr>
            <tr>
              <td>RPC接入配置：</td>
              <td>{{ routerInfo.rpcNetInfo }}</td>
            </tr>
            <tr>
              <td>P2P接入配置：</td>
              <td>{{ routerInfo.p2pNetInfo }}</td>
            </tr>
            <tr>
              <td>管理员账号：</td>
              <td>{{ routerInfo.adminAccount }}</td>
            </tr>
          </table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { systemStatus } from '@/api/status'
import { routerStatus } from '@/api/status'
import { listChains, listPeers, listZones } from '@/api/conn'
import { getResourceList } from '@/api/resource'
import ResourceShower from '@/components/ResourceShower'

export default {
  name: 'Homepage',
  components: { ResourceShower },
  props: {},
  data() {
    return {
      chainsInfoLoading: false,
      systemInfo: {},
      routerInfo: {},
      chainsInfo: [],
      chainNumber: 0,
      routerNumber: 0,
      resourceNumber: 0,
      transactionType: [{
        label: '两阶段事务',
        disabled: false
      },
      {
        label: 'HTLC',
        disabled: true
      }],
      chainSelect: null
    }
  },
  created() {
    systemStatus().then(response => {
      if (!response.data) {
        this.$message.error('本地系统信息返回为空，请检查后台信息')
      }
      this.systemInfo = response.data
    }).catch(_ => {
      this.$message({
        type: 'error',
        message: '获取系统信息失败，网络错误'
      })
    })

    routerStatus().then(response => {
      if (!response.data) {
        this.$message.error('路由信息返回为空，请检查后台信息')
      }
      this.routerInfo = response.data
    }).catch(_ => {
      this.$message({
        type: 'error',
        message: '获取插件列表失败，网络错误'
      })
    })
    this.refreshChainsInfo()
    this.getRouterNumber()
    this.getResourceNumber()
  },
  mounted() {

  },
  methods: {
    refreshChainsInfo() {
      this.chainsInfoLoading = true
      this.chainsInfo = []
      listZones(null).then(response => {
        const chainsInfo = []
        for (const zone of response.data.data) {
          listChains({ zone: zone }).then(res => {
            for (const chain of res.data.data) {
              chainsInfo.push({
                path: chain.zone + '.' + chain.chain,
                type: chain.type,
                number: chain.blockNumber
              })
            }
            this.chainNumber = this.chainsInfo.length
          }).catch(_ => {
            this.$message({
              type: 'error',
              message: '获取Chains信息失败，网络错误'
            })
            this.chainsInfoLoading = false
          })
        }
        this.chainsInfoLoading = false
        this.chainsInfo = chainsInfo
      }).catch(_ => {
        this.$message({
          type: 'error',
          message: '获取Zones信息失败，网络错误'
        })
        this.chainsInfoLoading = false
      })
    },
    getRouterNumber() {
      listPeers(null).then(response => {
        this.routerNumber = response.data.data.length
      }).catch(_ => {
        this.$message({
          type: 'error',
          message: '获取Peers信息失败，网络错误'
        })
        this.chainsInfoLoading = false
      })
    },
    getResourceNumber() {
      getResourceList(null, {
        version: 1,
        data: {
          ignoreRemote: false
        }
      }).then(response => {
        this.resourceNumber = response.data.resourceDetails.length
      }).catch(_ => {
        this.$message({
          type: 'error',
          message: '获取Resource信息失败，网络错误'
        })
        this.chainsInfoLoading = false
      })
    },
    pushToResourceDetail(path) {
      this.chainSelect = path
      this.$nextTick(() => { this.$refs[this.chainSelect].refresh() })
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  td {
    line-height: 20px;
    font-size: 14px;
    min-width: 180px;
    vertical-align: top;
    word-break: break-word;
  }
}
</style>
