<template>
  <transition name="el-fade-in-linear">
    <div v-show="show" class="app-container">
      <el-card class="box-card">
        <el-form label-position="left" size="small" label-width="80px">
          <el-form-item label="跨链账户">
            <el-tag v-bind:type="ua.admin ? 'warning': 'success'" ><span>{{ ua.username }}</span></el-tag>
            <el-button style="float: right" type="primary" @click="addChainAccountDrawer.show=true">添加链账户</el-button>
          </el-form-item>
          <el-form-item label="公钥">
            <el-input type="textarea" readonly autosize resize="none" v-model="ua.pubKey"></el-input>
          </el-form-item>
        </el-form>
        <el-table
          :data="chainAccountTable"
          style="width: 100%"
          row-key="id"
          lazy
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @row-click="showChainAccount"
        >
          <el-table-column label="" width="30px">
            <template slot-scope="">
            </template>
          </el-table-column>
          <el-table-column prop="type" label="链账户类型" width="180">
            <template slot-scope="scope">
              <el-tag type="info">{{ scope.row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="keyID" label="KeyID" width="180">
            <template slot-scope="scope">
              <div>{{ scope.row.keyID }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="details" label="摘要" @click="showChainAccount(scope.row)">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" content="点击查看详情" placement="top">
              <div>{{ scope.row.details }}</div>
              </el-tooltip>
            </template>

          </el-table-column>
          <el-table-column width="120">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.isDefault"
                style="float: right"
                size="small"
              >
                默认账户
              </el-button>
              <el-button
                v-else
                @click.stop="querySetDefaultAccountByColum(scope.row)"
                type="primary"
                style="float: right"
                size="small"
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
        size="680px"
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
              <el-tag type="info">{{ chainAccountDrawer.info.type }}</el-tag>
            </el-form-item>
            <el-form-item label="Identity">
              <el-tooltip class="item" effect="light" placement="bottom-start">
                <div slot="content">含义：<br>FISCO BCOS：address<br> Fabric: 公钥证书 </div>
                <el-input type="textarea" readonly autosize resize="none" v-model=" chainAccountDrawer.info.identity"></el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="公钥">
              <el-input type="textarea" readonly autosize resize="none" v-model=" chainAccountDrawer.info.pubKey"></el-input>
            </el-form-item>
            <el-form-item label="私钥">
              <el-button size="mini" class="primary" @click="chainAccountDrawer.showSec = !chainAccountDrawer.showSec" >查看 <i class="el-icon-chat-line-round"></i> </el-button>
              <el-input v-if="chainAccountDrawer.showSec && chainAccountDrawer.show" type="textarea" readonly autosize show-password resize="none" v-model=" chainAccountDrawer.info.secKey"></el-input>
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
          size="680px"
      >
        <el-card class="box-card"  style="height:100%">
            <div slot="header" class="clearfix">
              <span> 添加链账户 </span>
            </div>
          <el-form label-position="top" size="small" :rules="addChainAccountDrawerRules" ref="addChainAccountDrawer" :model="addChainAccountDrawer.params" >
            <el-form-item prop="type">
              <label><div><span>链账户类型</span></div></label>
              <el-select
                style="width:200px;margin-top:10px"
                v-model="addChainAccountDrawer.params.type"
                placeholder="请选择"
                @change="addChainAccountDrawer.params.pubKey = undefined; addChainAccountDrawer.params.secKey = undefined; addChainAccountDrawer.params.ext = undefined; addChainAccountDrawer.params.isDefault = false "
              >
                <el-option label="FISCO BCOS 2.0" value="BCOS2.0"></el-option>
                <el-option label="FISCO BCOS 2.0 国密" value="GM_BCOS2.0"></el-option>
                <el-option label="HyperLedger Fabric 1.4" value="Fabric1.4"></el-option>
              </el-select>
            </el-form-item>

            <div v-if="addChainAccountDrawer.params.type == 'BCOS2.0'">
              <el-form-item  prop="secKey">
                <label>
                  <span>私钥</span>
                </label>
                <el-upload
                  style="float:right"
                  class="upload-demo"
                  action=""
                  accept=".pem"
                  :show-file-list="false"
                  :file-list="pubKeyFileList"
                  :http-request="uploadECDSASecPemHandler"
                  :auto-upload="true">
                  <el-button-group  slot="trigger" >
                  <el-button  type="primary">上传</el-button>
                  <el-button
                  @click.stop="generateECDSASecPem()"
                  size="small"
                  type="primary">生成</el-button>
                  </el-button-group>
                </el-upload>
                <el-input
                  :change="buildECDSAData()"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  style="margin-top:10px"
                  autosize
                  v-model="addChainAccountDrawer.params.secKey">
                </el-input>
              </el-form-item>

              <el-form-item label="公钥" v-if="typeof(addChainAccountDrawer.params.pubKey) !== 'undefined'">
                <el-input
                  readonly
                  type="textarea"
                  :rows="2"
                  placeholder=""
                  autosize
                  v-model="addChainAccountDrawer.params.pubKey">
                </el-input>
              </el-form-item>

              <el-form-item label="address" v-if="typeof(addChainAccountDrawer.params.ext) !== 'undefined'">
                <el-input
                  readonly
                  placeholder=""
                  v-model="addChainAccountDrawer.params.ext"
                  clearable>
                </el-input>
              </el-form-item>

            </div>

            <div  v-if="addChainAccountDrawer.params.type == 'GM_BCOS2.0'">
              <el-form-item prop="secKey" >
                <label>
                  <span>私钥</span>
                </label>
                <el-upload
                  style="float:right"
                  class="upload-demo"
                  action=""
                  accept=".pem"
                  :show-file-list="false"
                  :file-list="pubKeyFileList"
                  :http-request="uploadSM2SecPemHandler"
                  :auto-upload="true">
                  <el-button-group slot="trigger">
                    <el-button  type="primary">上传</el-button>
                    <el-button
                    size="small"
                    @click.stop="generateSM2SecPem()"
                    type="primary">生成</el-button>
                  </el-button-group>
                </el-upload>
                <el-input
                  :change="buildSM2Data()"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  autosize
                  style="margin-top:10px"
                  v-model="addChainAccountDrawer.params.secKey">
                </el-input>
              </el-form-item>

              <el-form-item label="公钥" v-if="typeof(addChainAccountDrawer.params.pubKey) !== 'undefined'">
                <el-input
                  readonly
                  type="textarea"
                  :rows="2"
                  placeholder=""
                  autosize
                  v-model="addChainAccountDrawer.params.pubKey">
                </el-input>
              </el-form-item>

              <el-form-item label="address" v-if="typeof(addChainAccountDrawer.params.ext) !== 'undefined'">
                <el-input
                  readonly
                  placeholder=""
                  v-model="addChainAccountDrawer.params.ext"
                  clearable>
                </el-input>
              </el-form-item>
            </div>

            <div v-if="addChainAccountDrawer.params.type == 'Fabric1.4'">
              <el-form-item v-if="addChainAccountDrawer.params.type" prop="secKey">
                <label>
                  <span>私钥</span>
                </label>
                <el-upload
                  style="float:right"
                  class="upload-demo"
                  action=""
                  accept=".key,.pem"
                  :show-file-list="false"
                  :file-list="pubKeyFileList"
                  :http-request="uploadSecKeyHandler"
                  :auto-upload="true">
                  <el-button slot="trigger" type="primary">上传</el-button>
                </el-upload>
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  autosize
                  style="margin-top:10px"
                  v-model="addChainAccountDrawer.params.secKey">
                </el-input>
              </el-form-item>

              <el-form-item v-if="addChainAccountDrawer.params.type" prop="pubKey">
                <label>
                  <span>公钥证书</span>
                </label>
                <el-upload
                  style="float:right"
                  class="upload-demo"
                  action=""
                  accept=".crt"
                  :show-file-list="false"
                  :file-list="pubKeyFileList"
                  :http-request="uploadPubKeyCertHandler"
                  :auto-upload="true">
                  <el-button slot="trigger" type="primary">上传</el-button>
                </el-upload>
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  autosize
                  style="margin-top:10px"
                  v-model="addChainAccountDrawer.params.pubKey">
                </el-input>
              </el-form-item>

              <el-form-item v-if="addChainAccountDrawer.params.type=='Fabric1.4'" prop="ext">
                <label><div><span>MSPID</span></div></label>
                <el-input
                  style="margin-top:10px"
                  placeholder="请输入"
                  v-model="addChainAccountDrawer.params.ext"
                  clearable>
                </el-input>
              </el-form-item>

            </div>

            <el-form-item v-if="addChainAccountDrawer.params.type">
              <label><div><span>设为默认账户</span></div></label>
              <el-switch style="margin-top:10px" v-model="addChainAccountDrawer.params.isDefault"></el-switch>
            </el-form-item>
          </el-form>
          <div class="clearfix" style="vertical-align: bottom;">
              <el-button
                @click="queryAddChainAccount('addChainAccountDrawer')"
                style="float: right;"
                type="primary"
                >确认</el-button>
          </div>
        </el-card>
      </el-drawer>
    </div>
  </transition>
</template>
<script>
import { MessageBox } from 'element-ui'
import { listAccount } from '@/api/ua.js'
import { setDefaultAccount } from '@/api/ua.js'
import { addChainAccount } from '@/api/ua.js'
import { pem, ecdsa, sm2 } from '@/utils/pem.js'

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
        showSec: false,
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
      show: true,
      pubKeyFileList: [],
      privateKeyFileList: [],
      addChainAccountDrawerRules: {
        type: [{ required: true, trigger: 'change', message: '请选择' }],
        secKey: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          console.log('value: ', value)
          if (typeof (value) === 'undefined' || value.length === 0) {
            callback(new Error('请输入'))
          } else if (this.addChainAccountDrawer.params.type === 'BCOS2.0' && !ecdsa.isSecPem(value)) {
            callback(new Error('格式错误'))
          } else if (this.addChainAccountDrawer.params.type === 'GM_BCOS2.0' && !sm2.isSecPem(value)) {
            callback(new Error('格式错误'))
          } else if (!pem.isSecKeyFormat(value)) {
            callback(new Error('格式错误'))
          } else {
            callback()
          }
        } }],
        pubKey: [{ required: true, trigger: 'change', validator: (rule, value, callback) => {
          console.log('value: ', value)
          if (typeof (value) === 'undefined' || value.length === 0) {
            callback(new Error('请输入'))
          } else if (this.addChainAccountDrawer.params.type === 'Fabric1.4' && !pem.isCertFormat(value)) {
            callback(new Error('格式错误' + this.addChainAccountDrawer.params.type))
          } else {
            callback()
          }
        } }],
        ext: [{ required: true, trigger: 'change', message: '请输入' }]
      }
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
      this.chainAccountDrawer.showSec = false
    },
    querySetDefaultAccount() {
      MessageBox.confirm('设为默认账户？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
      })
    },
    querySetDefaultAccountByColum(chainAccount) {
      this.chainAccountDrawer.header = chainAccount.details
      this.chainAccountDrawer.info = chainAccount

      this.querySetDefaultAccount()
    },
    queryAddChainAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          MessageBox.confirm('添加链账户？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
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
          })
        }
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
    },

    generateECDSASecPem() {
      this.addChainAccountDrawer.params.secKey = ecdsa.generateSecPem()
    },
    generateSM2SecPem() {
      this.addChainAccountDrawer.params.secKey = sm2.generateSecPem()
    }, uploadECDSASecPemHandler(params) {
      var reader = new FileReader()
      reader.onload = (event) => {
        var key = event.target.result
        this.addChainAccountDrawer.params.secKey = key
      }
      reader.readAsText(params.file)
    },
    uploadSM2SecPemHandler(params) {
      var reader = new FileReader()
      reader.onload = (event) => {
        var key = event.target.result
        this.addChainAccountDrawer.params.secKey = key
      }
      reader.readAsText(params.file)
    },
    buildECDSAData() {
      var key = this.addChainAccountDrawer.params.secKey
      if (typeof (key) === 'undefined' || !ecdsa.isSecPem(key)) {
        this.addChainAccountDrawer.params.pubKey = undefined
        this.addChainAccountDrawer.params.ext = undefined
        return
      }

      var data = ecdsa.build(key)

      this.addChainAccountDrawer.params.pubKey = data.pubPem
      this.addChainAccountDrawer.params.ext = data.address
    },
    buildSM2Data() {
      var key = this.addChainAccountDrawer.params.secKey
      if (typeof (key) === 'undefined' || !sm2.isSecPem(key)) {
        this.addChainAccountDrawer.params.pubKey = undefined
        this.addChainAccountDrawer.params.ext = undefined
        return
      }

      var data = sm2.build(key)

      this.addChainAccountDrawer.params.pubKey = data.pubPem
      this.addChainAccountDrawer.params.ext = data.address
    },
    uploadPubKeyCertHandler(params) {
      console.log('uploadPubKeyCertHandler')
      var reader = new FileReader()
      reader.onload = (event) => {
        var key = event.target.result

        this.addChainAccountDrawer.params.pubKey = key
      }
      reader.readAsText(params.file)
    },
    uploadSecKeyHandler(params) {
      var reader = new FileReader()
      reader.onload = (event) => {
        var key = event.target.result
        this.addChainAccountDrawer.params.secKey = key
      }
      reader.readAsText(params.file)
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
    '---' +
    chainAccount.keyID +
    '---' +
    chainAccount.identity.replace('-----BEGIN CERTIFICATE-----', '').substr(0, 64) +
    '---' +
    chainAccount.ext
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
      if (typeof (defaultChainAccount) !== 'undefined') {
        chainAccount.id = defaultChainAccount.id * 10000 + defaultChainAccount.children.length + 1
        defaultChainAccount.children.push(chainAccount)
      } else {
        chainAccount.id = id++
        chainAccount.isDefault = true
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
