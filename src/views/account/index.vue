<template>
  <transition name="el-fade-in-linear">
    <div v-show="show" class="app-container">
      <el-card>
        <div slot="header">
          <span>账户信息</span>
          <el-tooltip id="accountHelp" effect="light" content="如何使用？" placement="top">
            <el-button type="text" size="mini" style="margin-left: 10px;padding: 0px" @click="howToUse">
              <svg-icon style="vertical-align: 0px" icon-class="question" />
            </el-button>
          </el-tooltip>
        </div>
        <el-form label-position="left" size="small" label-width="80px">
          <el-form-item label="一级账户：">
            <el-tag id="UA" :type="ua.admin ? 'warning': 'success'"><span>{{ ua.identity }}</span></el-tag>
            <el-button id="addAlgAccount" style="float: right" type="primary" @click="addAlgAccountDrawer.show=true">添加二级账户</el-button>
          </el-form-item>
        </el-form>
        <el-table
          id="algAccountTable"
          :data="algAccountTable"
          style="width: 100%"
          row-key="id"
          lazy
          :default-sort="{prop: 'type', order: 'descending'}"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @row-click="showAlgAccount"
        >
          <el-table-column label="" width="30px" />
          <el-table-column prop="type" label="二级账户类型" width="250">
            <template slot-scope="scope">
              <el-tag :type="scope.row.type | algTypeTagFilter">{{ scope.row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="keyID" label="二级账户ID" width="180">
            <template slot-scope="scope">
              <div>{{ scope.row.keyID }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="details" label="摘要" @click="showAlgAccount(scope.row)">
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
                @click.stop="querySetDefaultAccountByColumn(scope.row)"
              >
                设为默认
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-drawer
        :visible.sync="algAccountDrawer.show"
        :direction="algAccountDrawer.direction"
        :with-header="false"
        size="680px"
      >
        <el-card style="height:100%">
          <div slot="header" class="clearfix">
            <span> 二级账户 </span>
            <i class="el-icon-close" style="float:right;cursor:pointer" @click="algAccountDrawer.show = false" />
          </div>
          <el-form label-position="top" size="small" label-width="80px">
            <el-form-item label="KeyID">
              <span>{{ algAccountDrawer.info.keyID }}</span>
            </el-form-item>
            <el-form-item label="类型">
              <el-tag :type="algAccountDrawer.info.type | algTypeTagFilter">{{ algAccountDrawer.info.type }}</el-tag>
            </el-form-item>
            <el-form-item>
              <div slot="label">
                <span>公钥</span>
              </div>
              <el-input v-model="algAccountDrawer.info.pubKey" type="textarea" readonly autosize resize="none" />
            </el-form-item>
            <el-form-item v-if="algAccountDrawer.info.secKey" label="私钥">
              <el-button size="mini" @click="algAccountDrawer.showSec = !algAccountDrawer.showSec">查看 <i class="el-icon-chat-line-round" /> </el-button>
              <el-input v-if="algAccountDrawer.showSec && algAccountDrawer.show" v-model=" algAccountDrawer.info.secKey" type="textarea" readonly autosize show-password resize="none" style="margin-top: 10px" />
            </el-form-item>
            <el-form-item label="其它属性">
              <el-table ref="dynamicTable" :data="dynamicTableData.data" fit stripe max-height="400">
                <template v-for="(col) in dynamicTableData.columns">
                  <el-table-column
                    :key="col.dataItem"
                    :show-overflow-tooltip="true"
                    :prop="col.dataItem"
                    :label="col.dataName"
                  />
                </template>
              </el-table>

            </el-form-item>
            <!--
          </el-form>

          <el-row style="float: right">
            <el-button
              v-if="!algAccountDrawer.info.isDefault"
              type="primary"
              @click="querySetDefaultAccount()"
            >设为默认</el-button>
            <el-button
              type="danger"
              @click="queryRemoveAlgAccount()"
            >删除</el-button>
          </el-row>
          -->
          </el-form></el-card>
      </el-drawer>
      <el-drawer
        :visible.sync="addAlgAccountDrawer.show"
        :direction="addAlgAccountDrawer.direction"
        :with-header="false"
        size="680px"
      >
        <el-card style="height:100%">
          <div slot="header" class="clearfix">
            <span> 添加二级账户 </span>
            <i class="el-icon-close" style="float:right;cursor:pointer" @click="addAlgAccountDrawer.show = false" />
          </div>
          <el-form ref="addAlgAccountDrawer" label-position="top" size="small" :rules="addAlgAccountDrawerRules" :model="addAlgAccountDrawer.params">
            <el-form-item prop="type">
              <label><div><span>二级账户算法类型</span></div></label>
              <el-select
                v-model="addAlgAccountDrawer.params.type"
                style="width:200px;margin-top:10px"
                placeholder="请选择二级账户算法类型"
                @change="clearAlgAccountDrawerParams()"
              >
                <el-option label="FISCO BCOS 2.0" value="BCOS2.0" />
                <el-option label="FISCO BCOS 2.0 国密" value="GM_BCOS2.0" />
                <el-option label="HyperLedger Fabric 1.4" value="Fabric1.4" />
                <!--<el-option label="HyperLedger Fabric 2.0" value="Fabric2.0" />-->
              </el-select>
            </el-form-item>

            <div v-if="addAlgAccountDrawer.params.type === 'BCOS2.0'">
              <el-form-item prop="secKey">
                <label>
                  <span>私钥文件</span>
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
                  v-model="addAlgAccountDrawer.params.secKey"
                  :change="buildECDSAData()"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  style="margin-top:10px"
                  autosize
                />
              </el-form-item>

              <el-form-item v-if="typeof(addAlgAccountDrawer.params.pubKey) !== 'undefined'" prop="pubKey">
                <label>
                  <span>公钥文件</span>
                </label>
                <el-input
                  v-model="addAlgAccountDrawer.params.pubKey"
                  readonly
                  type="textarea"
                  :rows="2"
                  placeholder=""
                  autosize
                  style="margin-top:10px"
                />
              </el-form-item>

              <el-form-item v-if="typeof(addAlgAccountDrawer.params.ext) !== 'undefined'" label="address">
                <el-input
                  v-model="addAlgAccountDrawer.params.ext"
                  readonly
                  placeholder=""
                  clearable
                />
              </el-form-item>

            </div>

            <div v-if="addAlgAccountDrawer.params.type === 'GM_BCOS2.0'">
              <el-form-item prop="secKey">
                <label>
                  <span>私钥文件</span>
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
                  v-model="addAlgAccountDrawer.params.secKey"
                  :change="buildSM2Data()"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  autosize
                  style="margin-top:10px"
                />
              </el-form-item>

              <el-form-item v-if="typeof(addAlgAccountDrawer.params.pubKey) !== 'undefined'" prop="pubKey">
                <label>
                  <span>公钥文件</span>
                </label>
                <el-input
                  v-model="addAlgAccountDrawer.params.pubKey"
                  readonly
                  type="textarea"
                  :rows="2"
                  placeholder=""
                  autosize
                  style="margin-top:10px"
                />
              </el-form-item>

              <el-form-item v-if="typeof(addAlgAccountDrawer.params.ext) !== 'undefined'" label="address">
                <el-input
                  v-model="addAlgAccountDrawer.params.ext"
                  readonly
                  placeholder=""
                  clearable
                />
              </el-form-item>
            </div>

            <div v-if="addAlgAccountDrawer.params.type === 'Fabric1.4'">
              <el-form-item v-if="addAlgAccountDrawer.params.type" prop="secKey">
                <label>
                  <span>私钥文件</span>
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
                  v-model="addAlgAccountDrawer.params.secKey"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  autosize
                  style="margin-top:10px"
                />
              </el-form-item>

              <el-form-item v-if="addAlgAccountDrawer.params.type" prop="pubKey">
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
                  v-model="addAlgAccountDrawer.params.pubKey"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  autosize
                  style="margin-top:10px"
                />
              </el-form-item>

              <el-form-item v-if="addAlgAccountDrawer.params.type === 'Fabric1.4'" prop="ext2">
                <label><div><span>目的链Path</span></div></label>
                <el-input
                  v-model="addAlgAccountDrawer.params.ext2"
                  style="margin-top:10px"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>

              <el-form-item v-if="addAlgAccountDrawer.params.type === 'Fabric1.4'" prop="ext">
                <label><div><span>MSPID</span></div></label>
                <el-input
                  v-model="addAlgAccountDrawer.params.ext"
                  style="margin-top:10px"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>

            </div>
            <!--
            <div v-if="addAlgAccountDrawer.params.type === 'Fabric2.0'">
              <el-form-item v-if="addAlgAccountDrawer.params.type" prop="secKey">
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
                  v-model="addAlgAccountDrawer.params.secKey"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  autosize
                  style="margin-top:10px"
                />
              </el-form-item>

              <el-form-item v-if="addAlgAccountDrawer.params.type" prop="pubKey">
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
                  v-model="addAlgAccountDrawer.params.pubKey"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  autosize
                  style="margin-top:10px"
                />
              </el-form-item>

              <el-form-item v-if="addAlgAccountDrawer.params.type === 'Fabric2.0'" prop="ext">
                <label><div><span>MSPID</span></div></label>
                <el-input
                  v-model="addAlgAccountDrawer.params.ext"
                  style="margin-top:10px"
                  placeholder="请输入"
                  clearable
                />
              </el-form-item>

            </div>
         -->
            <el-form-item v-if="addAlgAccountDrawer.params.type">
              <label><div><span>设为默认账户</span></div></label>
              <el-switch v-model="addAlgAccountDrawer.params.isDefault" style="margin-top:10px" />
            </el-form-item>

          </el-form>
          <div class="clearfix" style="vertical-align: bottom;">
            <el-button
              style="float: right;"
              type="primary"
              @click="queryAddAlgAccount('addAlgAccountDrawer')"
            >确认</el-button>
          </div>
        </el-card>
      </el-drawer>
    </div>
  </transition>
</template>
<script>
import { listAccount, addAlgAccount, removeAlgAccount, setDefaultAccount } from '@/api/ua.js'
import { pem, ecdsa, sm2 } from '@/utils/pem.js'
import introJS from 'intro.js'
import 'intro.js/introjs.css'
import 'intro.js/themes/introjs-modern.css'

export default {
  name: 'AccountAdmin',
  components: { },
  filters: {
    algTypeTagFilter(type) {
      if (typeof type === 'undefined' || type === null || type === 0) {
        return 'info' // UNKNOWN
      } else if (type === 'SM2_WITH_SM3') {
        return 'danger' // NOT_STARTED
      } else if (type === 'ECDSA_SECP256K1_WITH_SHA256') {
        return ''
      } else if (type === 'ECDSA_SECP256R1_WITH_SHA256') {
        return 'warning' // RUNNING
      } else {
        return 'info'
      }
    }
  },
  props: {},
  data() {
    return {
      ua: {
        identity: null,
        algAccounts: [
          {
            keyID: 0,
            type: null,
            pubKey: null,
            secKey: null,
            isDefault: true
          },
          {
            keyID: 1,
            type: null,
            pubKey: null,
            secKey: null,
            isDefault: false
          }
        ]
      },
      algAccountTable: [],
      algAccountDrawer: {
        show: false,
        showSec: false,
        direction: 'rtl',
        header: '',
        info: {}
      },
      addAlgAccountDrawer: {
        show: false,
        direction: 'rtl',
        params: {
          type: '',
          pubKey: '',
          secKey: '',
          ext: '',
          ext2: '',
          isDefault: false
        }
      },
      dynamicTableData: {
        columns: [],
        data: []
      },
      fullscreenLoading: false,
      show: false,
      pubKeyFileList: [],
      privateKeyFileList: [],
      addAlgAccountDrawerRules: {
        type: [{ required: true, trigger: 'change', message: '请选择' }],
        secKey: [{ required: true, trigger: 'blur', validator: (rule, value, callback) => {
          if (typeof (value) === 'undefined' || value.length === 0) {
            callback(new Error('请输入私钥'))
          } else if (this.addAlgAccountDrawer.params.type === 'BCOS2.0' && !ecdsa.isSecPem(value)) {
            callback(new Error('FISCO BCOS 2.0 私钥格式错误'))
          } else if (this.addAlgAccountDrawer.params.type === 'GM_BCOS2.0' && !sm2.isSecPem(value)) {
            callback(new Error('FISCO BCOS 2.0 国密私钥格式错误'))
          } else if (!pem.isSecKeyFormat(value)) {
            callback(new Error('私钥格式错误'))
          } else {
            callback()
          }
        } }],
        pubKey: [{ required: true, trigger: 'blur', validator: (rule, value, callback) => {
          if (typeof (value) === 'undefined' || value.length === 0) {
            callback(new Error('请输入公钥'))
          } else if (this.addAlgAccountDrawer.params.type === 'Fabric1.4' && !pem.isCertFormat(value)) {
            callback(new Error('格式错误' + this.addAlgAccountDrawer.params.type))
          } else if (this.addAlgAccountDrawer.params.type === 'Fabric2.0' && !pem.isCertFormat(value)) {
            callback(new Error('格式错误' + this.addAlgAccountDrawer.params.type))
          } else {
            callback()
          }
        } }],
        ext: [{ required: true, trigger: 'blur', message: '请输入' }],
        ext2: [{ required: true, trigger: 'blur', message: '请输入' }]
      }
    }
  },
  activated() {
    if (!this.show) {
      this.getUA()
    }
  },
  methods: {
    getUA() {
      this.show = false
      return listAccount().then((response) => {
        if (!response) {
          this.$message.error('response 为空，请检查后台运行状态')
          return
        }
        if (response.errorCode !== 0) {
          this.$message.error('账户服务错误：' + response.message)
          return
        }
        this.ua = response.data
        this.algAccountTable = buildAlgAccountTable(this.ua)
        console.log(this.algAccountTable)
        this.show = true
      }).catch(error => {
        this.$message({
          message: '网络异常：' + error,
          type: 'error',
          duration: 5000
        })
      })
    },
    showAlgAccount(algAccount) {
      this.algAccountDrawer.header = algAccount.details
      this.algAccountDrawer.info = algAccount
      this.dynamicTableData = propertyToDynamicTableData(algAccount.properties)
      this.algAccountDrawer.show = true
      this.algAccountDrawer.showSec = false
    },
    clearAlgAccountDrawerParams() {
      this.addAlgAccountDrawer.params.pubKey = undefined
      this.addAlgAccountDrawer.params.secKey = undefined
      this.addAlgAccountDrawer.params.ext = undefined
      this.addAlgAccountDrawer.params.isDefault = false

      const myAddAlgAccountDrawer = this.$refs['addAlgAccountDrawer']
      if (typeof (myAddAlgAccountDrawer) !== 'undefined') {
        this.$refs['addAlgAccountDrawer'].clearValidate(['secKey', 'pubKey', 'ext'])
      }
    },
    querySetDefaultAccount() {
      this.$confirm('设为默认账户？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loadingText = 'Loading'
        const loading = this.$loading({
          lock: true,
          text: loadingText
        })

        this.algAccountDrawer.show = false
        setDefaultAccount({
          version: '1',
          data: {
            type: this.algAccountDrawer.info.type,
            keyID: this.algAccountDrawer.info.keyID
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
    querySetDefaultAccountByColumn(algAccount) {
      this.algAccountDrawer.header = algAccount.details
      this.algAccountDrawer.info = algAccount

      this.querySetDefaultAccount()
    },
    queryAddAlgAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('添加二级账户？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            const loadingText = 'Loading'
            const loading = this.$loading({
              lock: true,
              text: loadingText
            })

            this.addAlgAccountDrawer.show = false
            addAlgAccount({
              version: '1',
              data: this.addAlgAccountDrawer.params
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
    queryRemoveAlgAccount() {
      this.$confirm('删除二级账户？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loadingText = 'Loading'
        const loading = this.$loading({
          lock: true,
          text: loadingText
        })

        this.algAccountDrawer.show = false
        removeAlgAccount({
          version: '1',
          data: {
            type: this.algAccountDrawer.info.type,
            keyID: this.algAccountDrawer.info.keyID
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
    handleResponse(response) {
      if (!response) {
        this.$message({
          message: 'response为空，请查看后台运行状态',
          type: 'error'
        })
        return
      }
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
        this.clearAlgAccountDrawerParams()
      }
    },

    generateECDSASecPem() {
      this.clearAlgAccountDrawerParams()
      this.addAlgAccountDrawer.params.secKey = ecdsa.generateSecPem()
    },
    generateSM2SecPem() {
      this.clearAlgAccountDrawerParams()
      this.addAlgAccountDrawer.params.secKey = sm2.generateSecPem()
    },
    uploadECDSASecPemHandler(params) {
      this.clearAlgAccountDrawerParams()
      const reader = new FileReader()
      reader.onload = (event) => {
        this.addAlgAccountDrawer.params.secKey = event.target.result
      }
      reader.readAsText(params.file)
    },
    uploadSM2SecPemHandler(params) {
      this.clearAlgAccountDrawerParams()
      const reader = new FileReader()
      reader.onload = (event) => {
        this.addAlgAccountDrawer.params.secKey = event.target.result
      }
      reader.readAsText(params.file)
    },
    buildECDSAData() {
      const key = this.addAlgAccountDrawer.params.secKey
      if (typeof (key) === 'undefined' || !ecdsa.isSecPem(key)) {
        this.addAlgAccountDrawer.params.pubKey = undefined
        this.addAlgAccountDrawer.params.ext = undefined
        return
      }

      const data = ecdsa.build(key)

      this.addAlgAccountDrawer.params.pubKey = data.pubPem
      this.addAlgAccountDrawer.params.ext = data.address
    },
    buildSM2Data() {
      const key = this.addAlgAccountDrawer.params.secKey
      if (typeof (key) === 'undefined' || !sm2.isSecPem(key)) {
        this.addAlgAccountDrawer.params.pubKey = undefined
        this.addAlgAccountDrawer.params.ext = undefined
        return
      }

      const data = sm2.build(key)

      this.addAlgAccountDrawer.params.pubKey = data.pubPem
      this.addAlgAccountDrawer.params.ext = data.address
    },
    uploadPubKeyCertHandler(params) {
      const reader = new FileReader()
      reader.onload = (event) => {
        this.addAlgAccountDrawer.params.pubKey = event.target.result
      }
      reader.readAsText(params.file)
    },
    uploadSecKeyHandler(params) {
      const reader = new FileReader()
      reader.onload = (event) => {
        this.addAlgAccountDrawer.params.secKey = event.target.result
      }
      reader.readAsText(params.file)
    },
    howToUse() {
      introJS().setOptions({
        prevLabel: '上一步',
        nextLabel: '下一步',
        doneLabel: '结束',
        disableInteraction: true,
        steps: [
          {
            element: '#UA',
            title: '一级账户',
            intro: '展示一级账户名',
            position: 'right'
          }, {
            element: '#uaPK',
            title: '一级账户公钥',
            intro: '展示一级账户的公钥信息',
            position: 'top'
          }, {
            element: '#algAccountTable',
            title: '二级账户信息',
            intro: '展示一级账户的所有二级账户信息，可点击表行查看详细信息<br>也可展开某种二级账户类型,设置默认二级账户',
            position: 'top'
          },
          {
            element: '#addAlgAccount',
            title: '添加二级账户',
            intro: '点击"添加二级账户"按钮进行二级账户添加操作',
            position: 'left'
          }
        ]
      }).start()
    }
  }
}

function buildChainDetails(algAccount) {
  let details = ''
  details +=
    algAccount.type +
    '---' +
    algAccount.keyID +
    '---' +
    algAccount.pubKey.replace('-----BEGIN CERTIFICATE-----', '').substr(0, 64) +
    '---' +
    algAccount.isDefault
  return details
}

function buildAlgAccountTable(ua) {
  let algAccount
  const localAlgAccounts = []

  // build table requirements
  for (algAccount of ua.algAccounts) {
    algAccount.details = buildChainDetails(algAccount)
    algAccount.children = []
  }

  // add default account
  let id = 1
  for (algAccount of ua.algAccounts) {
    if (algAccount.isDefault === true) {
      algAccount.id = id++
      // algAccount.hasChildren = true
      localAlgAccounts.push(algAccount)
    }
  }

  // add non-default to children
  for (algAccount of ua.algAccounts) {
    if (algAccount.isDefault === false) {
      const defaultAlgAccount = localAlgAccounts.find(
        (u) => u.type === algAccount.type
      )
      if (typeof (defaultAlgAccount) !== 'undefined') {
        algAccount.id = defaultAlgAccount.id * 10000 + defaultAlgAccount.children.length + 1
        defaultAlgAccount.children.push(algAccount)
      } else {
        algAccount.id = id++
        algAccount.isDefault = true
        localAlgAccounts.push(algAccount)
      }
    }
  }
  return localAlgAccounts
}

function propertyToDynamicTableData(properties) {
  var dynamicTableData = {
    columns: [{
      dataItem: 'key',
      dataName: 'Key'
    },
    { dataItem: 'value',
      dataName: 'Value' }],
    data: []
  }
  console.log('try to')
  if (!properties) {
    console.log('properties is null')
    return dynamicTableData
  }
  console.log(dynamicTableData)
  for (var key in properties) {
    dynamicTableData.data.push({
      key: key,
      value: properties[key]
    })
  }

  console.log(dynamicTableData)

  return dynamicTableData
}

</script>

<style lang="scss">
.el-drawer.rtl{
    overflow-y: auto;
}
</style>
