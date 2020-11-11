<template>
  <transition name="el-fade-in-linear">
    <div v-show="show" class="transition-box">
      <el-card class="box-card">
        <el-form label-position="left" size="small" label-width="80px">
          <el-form-item label="跨链账户">
            <el-tooltip class="item" effect="light" :content="ua.uaID" placement="right">
              <div slot="content">UAID:<br>{{ua.uaID.substr(0,64)}}<br>{{ua.uaID.substr(64,64)}}<br>{{ua.uaID.substr(128)}}</div>
            <el-tag v-bind:type="ua.admin ? 'warning': 'success'" ><span>{{ ua.username }}</span></el-tag>
            </el-tooltip>
            <el-button style="float: right" type="primary" @click="addChainAccountDrawer.show=true">添加链账户</el-button>
          </el-form-item>
          <el-form-item label="UA公钥">
            <el-input type="textarea" readonly autosize resize="none" v-model="ua.pubKey"></el-input>
          </el-form-item>
        </el-form>
        <el-table
          :data="chainAccountTable"
          style="width: 100%"
          row-key="id"
          :row-class-name="chainAccountTableRowClassName"
          lazy
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="type" label="链账户类型" width="180">
          </el-table-column>
          <el-table-column prop="keyID" label="KeyID" width="180">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" content="点击获取详情" placement="top">
              <div @click="showChainAccount(scope.row)">{{ scope.row.keyID }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="details" label="信息">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" content="点击获取详情" placement="top">
              <div @click="showChainAccount(scope.row)">{{ scope.row.details }}</div>
              </el-tooltip>
            </template>

          </el-table-column>
          <el-table-column width="120">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.isDefault"
                style="float: right"
              >
                默认账户
              </el-button>
              <el-button
                v-else
                @click="querySetDefaultAccountByColum(scope.row)"
                type="primary"
                style="float: right"
              >
                设为默认
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-drawer
        :visible.sync="chainAccountDrawer.show"
        :direction="chainAccountDrawer.direction"
        :with-header="false"
        size="670px"
      >
        <el-card class="box-card" style="height:100%">
          <div slot="header" class="clearfix">
            <span> 链账户 </span>
            <el-button
              v-if="!chainAccountDrawer.info.isDefault"
              @click="querySetDefaultAccount()"
              style="float: right"
              type="primary"
              >设为默认账户</el-button
            >
          </div>
          <el-form label-position="top" size="small" label-width="80px">
            <el-form-item label="KeyID">
              <span>{{ chainAccountDrawer.info.keyID }}</span>
            </el-form-item>
            <el-form-item label="链账户类型">
              <span>{{ chainAccountDrawer.info.type }}</span>
            </el-form-item>
            <el-form-item label="Identity">
              <el-input type="textarea" readonly autosize resize="none" v-model=" chainAccountDrawer.info.identity"></el-input>
            </el-form-item>
            <el-form-item label="公钥">
              <el-input type="textarea" readonly autosize resize="none" v-model=" chainAccountDrawer.info.pubKey"></el-input>
            </el-form-item>
            <el-form-item label="私钥">
              <el-input type="textarea" readonly autosize resize="none" v-model=" chainAccountDrawer.info.secKey"></el-input>
            </el-form-item>
            <el-form-item label="其它">
              <span>{{ chainAccountDrawer.info.ext }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-drawer>
      <el-drawer
          :visible.sync="addChainAccountDrawer.show"
          :direction="addChainAccountDrawer.direction"
          :with-header="false"
          size="670px"
      >
        <el-card class="box-card"  style="height:100%">
            <div slot="header" class="clearfix">
              <span> 添加链账户 </span>
            </div>
          <el-form label-position="top" size="small"  ref="form" :model="addChainAccountDrawer" >
            <el-form-item label="链账户类型">
              <el-select
                v-model="addChainAccountDrawer.params.type"
                placeholder="请选择"
              >
                <el-option label="FISCO BCOS2.0" value="BCOS2.0"></el-option>
                <el-option label="FISCO BCOS2.0 国密" value="GM_BCOS2.0"></el-option>
                <el-option label="HyperLedger Fabric1.4" value="Fabric1.4"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="公钥">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入"
                v-model="addChainAccountDrawer.params.pubKey">
              </el-input>
            </el-form-item>

            <el-form-item label="私钥">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入"
                v-model="addChainAccountDrawer.params.secKey">
              </el-input>
            </el-form-item>

            <el-form-item v-if="addChainAccountDrawer.params.type=='Fabric1.4'" label="MSPID">
              <el-input
                placeholder="请输入"
                v-model="addChainAccountDrawer.params.ext"
                clearable>
              </el-input>
            </el-form-item>

            <el-form-item label="设为默认账户">
                <el-switch v-model="addChainAccountDrawer.params.isDefault"></el-switch>
            </el-form-item>
          </el-form>
          <div class="clearfix">
              <el-button
                @click="queryAddChainAccount()"
                style="float: right"
                type="primary"
                >确认</el-button
              >
          </div>
        </el-card>
      </el-drawer>
    </div>
  </transition>
</template>
<script>
import { listAccount } from '@/api/ua.js'
import { setDefaultAccount } from '@/api/ua.js'
import { addChainAccount } from '@/api/ua.js'

export default {
  name: 'AccountAdmin',
  props: {},
  data() {
    return {
      ua: {
        uaID: null,
        pubKey: null,
        username: null,
        admin: true,
        chainAccounts: [
          {
            keyID: 0,
            type: null,
            identity: null,
            isDefault: null,
            pubKey: null,
            secKey: null,
            ext: null
          },
          {
            keyID: 1,
            type: null,
            identity: null,
            isDefault: null,
            pubKey: null,
            secKey: null,
            ext: null
          }
        ]
      },
      chainAccountTable: [],
      chainAccountDrawer: {
        show: false,
        direction: 'rtl',
        header: '',
        info: {}
      },
      addChainAccountDrawer: {
        show: false,
        direction: 'rtl',
        params: {
          type: '',
          pubKey: '',
          secKey: '',
          ext: '',
          isDefault: false
        }
      },
      fullscreenLoading: false,
      show: true
    }
  },
  methods: {
    getUA() {
      this.show = false
      return listAccount().then((response) => {
        this.ua = response.data
        this.chainAccountTable = buildChainAccountTable(this.ua)
        this.show = true
      })
    },
    showChainAccount(chainAccount) {
      console.log(chainAccount)
      this.chainAccountDrawer.header = chainAccount.details
      this.chainAccountDrawer.info = chainAccount
      this.chainAccountDrawer.show = true
    },
    querySetDefaultAccount() {
      var loadingText = 'Loading'
      const loading = this.$loading({
        lock: true,
        text: loadingText
      })

      this.chainAccountDrawer.show = false
      setDefaultAccount({
        version: '1',
        data: {
          type: this.chainAccountDrawer.info.type,
          keyID: this.chainAccountDrawer.info.keyID
        }
      }).then((response) => {
        this.handleResponse(response)
        this.getUA().then(() => {
          loading.close()
        })
      })
    },
    querySetDefaultAccountByColum(chainAccount) {
      console.log(chainAccount)
      this.chainAccountDrawer.header = chainAccount.details
      this.chainAccountDrawer.info = chainAccount

      this.querySetDefaultAccount()
    },
    queryAddChainAccount() {
      var loadingText = 'Loading'
      const loading = this.$loading({
        lock: true,
        text: loadingText
      })

      this.addChainAccountDrawer.show = false
      addChainAccount({
        version: '1',
        data: this.addChainAccountDrawer.params
      }).then((response) => {
        this.handleResponse(response)
        this.getUA().then(() => {
          loading.close()
        })
      })
    },
    handleResponse(response) {
      console.log('Response' + response)
      if (response.errorCode !== 0) {
        this.$message({
          message: '设置失败：' + response.message,
          type: 'error'
        })
      } else if (response.data.errorCode !== 0) {
        this.$message({
          message: '设置失败：' + response.data.message,
          type: 'error'
        })
      } else {
        this.$message({
          message: '设置成功',
          type: 'success'
        })
      }
    }
  },
  chainAccountTableRowClassName({ row, rowIndex }) {
    console.log('xxxxx ' + row)
    if (row.isDefault) {
      return 'success-row'
    } else {
      return ''
    }
  },

  created() {
    this.getUA()
  }
}

function buildChainDetails(chainAccount) {
  var details = ''
  details +=
    chainAccount.type +
    '-' +
    chainAccount.keyID +
    '-' +
    chainAccount.identity.substr(0, 32)
  return details
}

function buildChainAccountTable(ua) {
  var localChainAccounts = []

  // build table requirements
  for (var chainAccount of ua.chainAccounts) {
    chainAccount.details = buildChainDetails(chainAccount)
    chainAccount.children = []
  }

  // add default account
  var id = 1
  for (chainAccount of ua.chainAccounts) {
    if (chainAccount.isDefault === true) {
      chainAccount.id = id++
      // chainAccount.hasChildren = true
      localChainAccounts.push(chainAccount)
    }
  }

  // add non-default to children
  for (chainAccount of ua.chainAccounts) {
    if (chainAccount.isDefault === false) {
      var defaultChainAccount = localChainAccounts.find(
        (u) => u.type === chainAccount.type
      )
      if (defaultChainAccount !== undefined) {
        chainAccount.id = defaultChainAccount.id * 10000
        defaultChainAccount.children.push(chainAccount)
      } else {
        chainAccount.id =
          defaultChainAccount.id * 10000 + defaultChainAccount.children.length
        localChainAccounts.push(chainAccount)
      }
    }
  }
  console.log('localChainAccounts', localChainAccounts)
  return localChainAccounts
}
</script>

<style lang="scss">
.el-drawer.rtl{
    overflow-y: auto;
}
</style>
