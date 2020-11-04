<template>
  <transition name="el-fade-in-linear">
    <div v-show="show" class="transition-box">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>
            <el-tag>{{ ua.admin ? "路由管理员" : "普通用户" }}</el-tag>
          </span>
          <el-button style="float: right" type="primary" @click="addChainAccountDrawer.show=true">添加链账户</el-button>
        </div>
        <el-form label-position="left" size="small" label-width="80px">
          <el-form-item label="用户名">
            <span>{{ ua.username }}</span>
          </el-form-item>
          <el-form-item label="UAID">
            <span>{{ ua.uaID }}</span>
          </el-form-item>
          <el-form-item label="UA公钥">
            <span>{{ ua.pubKey }}</span>
          </el-form-item>
        </el-form>

        <el-table
          :data="chainAccountTable"
          style="width: 100%"
          row-key="id"
          border
          stripe
          lazy
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="type" label="链账户类型" width="180">
          </el-table-column>
          <el-table-column prop="keyID" label="KeyID" width="180">
          </el-table-column>
          <el-table-column prop="details" label="信息"> </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button
                @click="showChainAccount(scope.row)"
                type="primary"
                style="margin-left: 16px"
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-drawer
          :visible.sync="chainAccountDrawer.show"
          :direction="chainAccountDrawer.direction"
          :with-header="false"
        >
          <el-card class="box-card">
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
                <span>{{ chainAccountDrawer.info.identity }}</span>
              </el-form-item>
              <el-form-item label="公钥">
                <span>{{ chainAccountDrawer.info.pubKey }}</span>
              </el-form-item>
              <el-form-item label="私钥">
                <span>{{ chainAccountDrawer.info.secKey }}</span>
              </el-form-item>
              <el-form-item label="其它">
                <span>{{ chainAccountDrawer.info.ext }}</span>
              </el-form-item>
            </el-form>
          </el-card>
        </el-drawer>
      </el-card>

      <el-drawer
          :visible.sync="addChainAccountDrawer.show"
          :direction="addChainAccountDrawer.direction"
          :with-header="false"
      >
        <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span> 添加链账户 </span>
            </div>
          <el-form label-position="top" size="small"  ref="form" :model="addChainAccountDrawer" >
            <el-form-item label="链账户类型">
              <el-select
                v-model="addChainAccountDrawer.params.type"
                placeholder="请选择"
              >
                <el-option label="BCOS2.0" value="BCOS2.0"></el-option>
                <el-option label="国密BCOS2.0" value="GM_BCOS2.0"></el-option>
                <el-option label="Fabric1.4" value="Fabric1.4"></el-option>
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
        this.$notify({
          title: '提示',
          message: '设置失败：' + response.message,
          duration: 0
        })
      } else if (response.data.errorCode !== 0) {
        this.$notify({
          title: '提示',
          message: '设置失败：' + response.data.message,
          duration: 0
        })
      } else {
        this.$notify({
          title: '提示',
          message: '设置成功',
          duration: 2000
        })
      }
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

<style lang="scss" scoped>
</style>
