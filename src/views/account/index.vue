<template>
  <transition name="el-fade-in-linear">
    <div v-show="show" class="app-container">
      <el-card>
        <el-form label-position="left" size="small" label-width="80px">
          <el-form-item label="跨链账户">
            <el-tag :type="ua.admin ? 'warning': 'success'"><span>{{ ua.username }}</span></el-tag>
            <el-button style="float: right" type="primary" @click="addChainAccountDrawer.show=true">添加链账户</el-button>
          </el-form-item>
          <el-form-item label="公钥">
            <el-input v-model="ua.pubKey" type="textarea" readonly autosize resize="none" />
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
          <el-table-column label="" width="30px" />
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
              <el-tooltip effect="light" content="点击查看详情" placement="top">
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
                @click.stop=""
              >
                默认账户
              </el-button>
              <el-button
                v-else
                type="primary"
                style="float: right"
                size="small"
                @click.stop="querySetDefaultAccountByColum(scope.row)"
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
        <el-card style="height:100%">
          <div slot="header" class="clearfix">
            <span> 链账户 </span>
            <i class="el-icon-close" style="float:right;cursor:pointer" @click="chainAccountDrawer.show = false" />
          </div>
          <el-form label-position="top" size="small" label-width="80px">
            <el-form-item label="KeyID">
              <span>{{ chainAccountDrawer.info.keyID }}</span>
            </el-form-item>
            <el-form-item label="链账户类型">
              <el-tag type="info">{{ chainAccountDrawer.info.type }}</el-tag>
            </el-form-item>
            <el-form-item label="Identity">
              <el-tooltip effect="light" placement="bottom-start">
                <div slot="content">含义：<br>FISCO BCOS：address<br> Fabric: 公钥证书 </div>
                <el-input v-model=" chainAccountDrawer.info.identity" type="textarea" readonly autosize resize="none" />
              </el-tooltip>
            </el-form-item>
            <el-form-item label="公钥">
              <el-input v-model=" chainAccountDrawer.info.pubKey" type="textarea" readonly autosize resize="none" />
            </el-form-item>
            <el-form-item label="私钥">
              <el-button size="mini" @click="chainAccountDrawer.showSec = !chainAccountDrawer.showSec">查看 <i class="el-icon-chat-line-round" /> </el-button>
              <el-input v-if="chainAccountDrawer.showSec && chainAccountDrawer.show" v-model=" chainAccountDrawer.info.secKey" type="textarea" readonly autosize show-password resize="none" style="margin-top: 10px" />
            </el-form-item>
            <el-form-item label="其它">
              <span>{{ chainAccountDrawer.info.ext }}</span>
            </el-form-item>
          </el-form>
          <el-row style="float: right">
            <el-button
              v-if="!chainAccountDrawer.info.isDefault"
              type="primary"
              @click="querySetDefaultAccount()"
            >设为默认</el-button>
            <el-button
              type="danger"
              @click="queryRemoveChainAccount()"
            >删除</el-button>
          </el-row>
        </el-card>
      </el-drawer>
      <el-drawer
        :visible.sync="addChainAccountDrawer.show"
        :direction="addChainAccountDrawer.direction"
        :with-header="false"
        size="680px"
      >
        <el-card style="height:100%">
          <div slot="header" class="clearfix">
            <span> 添加链账户 </span>
            <i class="el-icon-close" style="float:right;cursor:pointer" @click="addChainAccountDrawer.show = false" />
          </div>
          <el-form ref="addChainAccountDrawer" label-position="top" size="small" :rules="addChainAccountDrawerRules" :model="addChainAccountDrawer.params">
            <el-form-item prop="type">
              <label><div><span>链账户类型</span></div></label>
              <el-select
                v-model="addChainAccountDrawer.params.type"
                style="width:200px;margin-top:10px"
                placeholder="请选择链账户类型"
                @change="clearChainAccountDrawerParams()"
              >
                <el-option label="FISCO BCOS 2.0" value="BCOS2.0" />
                <el-option label="FISCO BCOS 2.0 国密" value="GM_BCOS2.0" />
                <el-option label="HyperLedger Fabric 1.4" value="Fabric1.4" />
              </el-select>
            </el-form-item>

            <div v-if="addChainAccountDrawer.params.type === 'BCOS2.0'">
              <el-form-item prop="secKey">
                <label>
                  <span>私钥</span>
                </label>
                <el-upload
                  style="float:right"
                  action=""
                  accept=".pem"
                  :show-file-list="false"
                  :file-list="pubKeyFileList"
                  :http-request="uploadECDSASecPemHandler"
                  :auto-upload="true"
                >
                  <el-button-group slot="trigger">
                    <el-button type="primary">上传</el-button>
                    <el-button
                      size="small"
                      type="primary"
                      @click.stop="generateECDSASecPem()"
                    >生成</el-button>
                  </el-button-group>
                </el-upload>
                <el-input
                  v-model="addChainAccountDrawer.params.secKey"
                  :change="buildECDSAData()"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  style="margin-top:10px"
                  autosize
                />
              </el-form-item>

              <el-form-item v-if="typeof(addChainAccountDrawer.params.pubKey) !== 'undefined'" prop="pubKey">
                <label>
                  <span>公钥</span>
                </label>
                <el-input
                  v-model="addChainAccountDrawer.params.pubKey"
                  readonly
                  type="textarea"
                  :rows="2"
                  placeholder=""
                  autosize
                  style="margin-top:10px"
                />
              </el-form-item>

              <el-form-item v-if="typeof(addChainAccountDrawer.params.ext) !== 'undefined'" label="address">
                <el-input
                  v-model="addChainAccountDrawer.params.ext"
                  readonly
                  placeholder=""
                  clearable
                />
              </el-form-item>

            </div>

            <div v-if="addChainAccountDrawer.params.type === 'GM_BCOS2.0'">
              <el-form-item prop="secKey">
                <label>
                  <span>私钥</span>
                </label>
                <el-upload
                  style="float:right"
                  action=""
                  accept=".pem"
                  :show-file-list="false"
                  :file-list="pubKeyFileList"
                  :http-request="uploadSM2SecPemHandler"
                  :auto-upload="true"
                >
                  <el-button-group slot="trigger">
                    <el-button type="primary">上传</el-button>
                    <el-button
                      size="small"
                      type="primary"
                      @click.stop="generateSM2SecPem()"
                    >生成</el-button>
                  </el-button-group>
                </el-upload>
                <el-input
                  v-model="addChainAccountDrawer.params.secKey"
                  :change="buildSM2Data()"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  autosize
                  style="margin-top:10px"
                />
              </el-form-item>

              <el-form-item v-if="typeof(addChainAccountDrawer.params.pubKey) !== 'undefined'" prop="pubKey">
                <label>
                  <span>公钥</span>
                </label>
                <el-input
                  v-model="addChainAccountDrawer.params.pubKey"
                  readonly
                  type="textarea"
                  :rows="2"
                  placeholder=""
                  autosize
                  style="margin-top:10px"
                />
              </el-form-item>

              <el-form-item v-if="typeof(addChainAccountDrawer.params.ext) !== 'undefined'" label="address">
                <el-input
                  v-model="addChainAccountDrawer.params.ext"
                  readonly
                  placeholder=""
                  clearable
                />
              </el-form-item>
            </div>

            <div v-if="addChainAccountDrawer.params.type === 'Fabric1.4'">
              <el-form-item v-if="addChainAccountDrawer.params.type" prop="secKey">
                <label>
                  <span>私钥</span>
                </label>
                <el-upload
                  style="float:right"
                  action=""
                  accept=".key,.pem"
                  :show-file-list="false"
                  :file-list="pubKeyFileList"
                  :http-request="uploadSecKeyHandler"
                  :auto-upload="true"
                >
                  <el-button slot="trigger" type="primary">上传</el-button>
                </el-upload>
                <el-input
                  v-model="addChainAccountDrawer.params.secKey"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  autosize
                  style="margin-top:10px"
                />
              </el-form-item>

              <el-form-item v-if="addChainAccountDrawer.params.type" prop="pubKey">
                <label>
                  <span>公钥证书</span>
                </label>
                <el-upload
                  style="float:right"
                  action=""
                  accept=".crt"
                  :show-file-list="false"
                  :file-list="pubKeyFileList"
                  :http-request="uploadPubKeyCertHandler"
                  :auto-upload="true"
                >
                  <el-button slot="trigger" type="primary">上传</el-button>
                </el-upload>
                <el-input
                  v-model="addChainAccountDrawer.params.pubKey"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  autosize
                  style="margin-top:10px"
                />
              </el-form-item>

              <el-form-item v-if="addChainAccountDrawer.params.type === 'Fabric1.4'" prop="ext">
                <label><div><span>MSPID</span></div></label>
                <el-input
                  v-model="addChainAccountDrawer.params.ext"
                  style="margin-top:10px"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>

            </div>

            <el-form-item v-if="addChainAccountDrawer.params.type">
              <label><div><span>设为默认账户</span></div></label>
              <el-switch v-model="addChainAccountDrawer.params.isDefault" style="margin-top:10px" />
            </el-form-item>
          </el-form>
          <div class="clearfix" style="vertical-align: bottom;">
            <el-button
              style="float: right;"
              type="primary"
              @click="queryAddChainAccount('addChainAccountDrawer')"
            >确认</el-button>
          </div>
        </el-card>
      </el-drawer>
    </div>
  </transition>
</template>
<script>
import { MessageBox } from 'element-ui'
import { listAccount, addChainAccount, removeChainAccount, setDefaultAccount } from '@/api/ua.js'
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
        version: 0,
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
        secKey: [{ required: true, trigger: 'blur', validator: (rule, value, callback) => {
          console.log('value: ', value)
          if (typeof (value) === 'undefined' || value.length === 0) {
            callback(new Error('请输入私钥'))
          } else if (this.addChainAccountDrawer.params.type === 'BCOS2.0' && !ecdsa.isSecPem(value)) {
            callback(new Error('FISCO BCOS 2.0 私钥格式错误'))
          } else if (this.addChainAccountDrawer.params.type === 'GM_BCOS2.0' && !sm2.isSecPem(value)) {
            callback(new Error('FISCO BCOS 2.0 国密私钥格式错误'))
          } else if (!pem.isSecKeyFormat(value)) {
            callback(new Error('私钥格式错误'))
          } else {
            callback()
          }
        } }],
        pubKey: [{ required: true, trigger: 'blur', validator: (rule, value, callback) => {
          console.log('value: ', value)
          if (typeof (value) === 'undefined' || value.length === 0) {
            callback(new Error('请输入公钥'))
          } else if (this.addChainAccountDrawer.params.type === 'Fabric1.4' && !pem.isCertFormat(value)) {
            callback(new Error('格式错误' + this.addChainAccountDrawer.params.type))
          } else {
            callback()
          }
        } }],
        ext: [{ required: true, trigger: 'blur', message: '请输入' }]
      }
    }
  },

  created() {
    this.getUA()
  },
  methods: {
    getUA() {
      this.show = false
      return listAccount().then((response) => {
        this.ua = response.data
        this.chainAccountTable = buildChainAccountTable(this.ua)
        this.show = true
      }).catch(error => {
        this.$message({
          message: '网络异常：' + error,
          type: 'error',
          duration: 5000
        })
      })
    },
    showChainAccount(chainAccount) {
      console.log(chainAccount)
      this.chainAccountDrawer.header = chainAccount.details
      this.chainAccountDrawer.info = chainAccount
      this.chainAccountDrawer.show = true
      this.chainAccountDrawer.showSec = false
    },
    clearChainAccountDrawerParams() {
      this.addChainAccountDrawer.params.pubKey = undefined
      this.addChainAccountDrawer.params.secKey = undefined
      this.addChainAccountDrawer.params.ext = undefined
      this.addChainAccountDrawer.params.isDefault = false

      const myAddChainAccountDrawer = this.$refs['addChainAccountDrawer']
      if (typeof (myAddChainAccountDrawer) !== 'undefined') {
        this.$refs['addChainAccountDrawer'].clearValidate(['secKey', 'pubKey', 'ext'])
      }
    },
    querySetDefaultAccount() {
      MessageBox.confirm('设为默认账户？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loadingText = 'Loading'
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
        }).catch(error => {
          loading.close()
          this.$message({
            message: '网络异常：' + error,
            type: 'error',
            duration: 5000
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
            const loadingText = 'Loading'
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
            }).catch(error => {
              loading.close()
              this.$message({
                message: '网络异常：' + error,
                type: 'error',
                duration: 5000
              })
            })
          })
        }
      })
    },
    queryRemoveChainAccount() {
      MessageBox.confirm('删除链账户？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loadingText = 'Loading'
        const loading = this.$loading({
          lock: true,
          text: loadingText
        })

        this.chainAccountDrawer.show = false
        removeChainAccount({
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
        }).catch(error => {
          this.$message({
            message: '网络异常：' + error,
            type: 'error',
            duration: 5000
          })
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
        this.clearChainAccountDrawerParams()
      }
    },

    generateECDSASecPem() {
      this.addChainAccountDrawer.params.secKey = ecdsa.generateSecPem()
    },
    generateSM2SecPem() {
      this.addChainAccountDrawer.params.secKey = sm2.generateSecPem()
    }, uploadECDSASecPemHandler(params) {
      const reader = new FileReader()
      reader.onload = (event) => {
        this.addChainAccountDrawer.params.secKey = event.target.result
      }
      reader.readAsText(params.file)
    },
    uploadSM2SecPemHandler(params) {
      const reader = new FileReader()
      reader.onload = (event) => {
        this.addChainAccountDrawer.params.secKey = event.target.result
      }
      reader.readAsText(params.file)
    },
    buildECDSAData() {
      const key = this.addChainAccountDrawer.params.secKey
      if (typeof (key) === 'undefined' || !ecdsa.isSecPem(key)) {
        this.addChainAccountDrawer.params.pubKey = undefined
        this.addChainAccountDrawer.params.ext = undefined
        return
      }

      const data = ecdsa.build(key)

      this.addChainAccountDrawer.params.pubKey = data.pubPem
      this.addChainAccountDrawer.params.ext = data.address
    },
    buildSM2Data() {
      const key = this.addChainAccountDrawer.params.secKey
      if (typeof (key) === 'undefined' || !sm2.isSecPem(key)) {
        this.addChainAccountDrawer.params.pubKey = undefined
        this.addChainAccountDrawer.params.ext = undefined
        return
      }

      const data = sm2.build(key)

      this.addChainAccountDrawer.params.pubKey = data.pubPem
      this.addChainAccountDrawer.params.ext = data.address
    },
    uploadPubKeyCertHandler(params) {
      console.log('uploadPubKeyCertHandler')
      const reader = new FileReader()
      reader.onload = (event) => {
        this.addChainAccountDrawer.params.pubKey = event.target.result
      }
      reader.readAsText(params.file)
    },
    uploadSecKeyHandler(params) {
      const reader = new FileReader()
      reader.onload = (event) => {
        this.addChainAccountDrawer.params.secKey = event.target.result
      }
      reader.readAsText(params.file)
    }
  }
}

function buildChainDetails(chainAccount) {
  let details = ''
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
  let chainAccount
  const localChainAccounts = []

  // build table requirements
  for (chainAccount of ua.chainAccounts) {
    chainAccount.details = buildChainDetails(chainAccount)
    chainAccount.children = []
  }

  // add default account
  let id = 1
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
      const defaultChainAccount = localChainAccounts.find(
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
