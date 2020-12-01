<template>
  <div class="app-container">
    <el-card>
      <template slot="header">
        <el-page-header content="资源部署页面" title="资源管理" @back="() => {this.$router.push({ path: 'resourceList' })}" />
      </template>
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form ref="deployForm" :model="form" label-width="120px" :rules="formRules">
            <el-form-item label="选择链类型：" prop="stubType">
              <el-select v-model="form.stubType" :disabled="lockDown" placeholder="请选择部署的链类型" style="width:100%" @change="stubTypeChange">
                <el-option-group label="FISCO BCOS">
                  <el-option label="FISCO BCOS 2.0" value="BCOS2.0" />
                  <el-option label="FISCO BCOS 2.0 国密版" value="GM_BCOS2.0" />
                </el-option-group>
                <el-option-group label="Hyperledger Fabric">
                  <el-option label="Hyperledger Fabric 1.4" value="Fabric1.4" />
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="选择操作：" prop="method">
              <el-select key="methodSelect" v-model="form.method" placeholder="选择操作类型" @change="methodChange">
                <el-option
                  v-if="(form.stubType ==='BCOS2.0'||form.stubType ==='GM_BCOS2.0')"
                  label="部署合约"
                  value="deploy"
                >
                  <span style="float: left">部署合约</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">Deploy</span>
                </el-option>
                <el-option
                  v-if="(form.stubType ==='BCOS2.0'||form.stubType ==='GM_BCOS2.0')"
                  label="注册已有合约"
                  value="register"
                >
                  <span style="float: left">注册已有合约</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">Register</span>
                </el-option>
                <el-option v-if="form.stubType ==='Fabric1.4'" label="安装合约" value="install">
                  <span style="float: left">安装合约</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">Install</span>
                </el-option>
                <el-option v-if="form.stubType ==='Fabric1.4'" label="实例化合约" value="instantiate">
                  <span style="float: left">实例化合约</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">Instantiate</span>
                </el-option>
                <el-option v-if="form.stubType ==='Fabric1.4'" label="升级合约" value="upgrade">
                  <span style="float: left">升级合约</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">Upgrade</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="form.prependPath !== null"
              label="资源路径："
              prop="appendPath"
            >
              <el-input v-model.trim="form.appendPath" placeholder="Path">
                <template slot="prepend" style="padding: 5px">{{ form.prependPath }}</template>
              </el-input>
            </el-form-item>

            <el-form-item
              v-else
              label="资源路径："
              prop="fullPath"
            >
              <el-input v-model.trim="form.fullPath" placeholder="Path" />
            </el-form-item>

            <!-- BCOS -->
            <div v-if="(form.stubType ==='BCOS2.0'||form.stubType ==='GM_BCOS2.0')">
              <el-row type="flex">
                <el-form-item label="上传文件：" prop="zipContract">
                  <el-upload
                    ref="uploadContract"
                    action=""
                    accept=".zip"
                    :file-list="fileList"
                    :on-change="changeContractFile"
                    :before-remove="beforeRemove"
                    :http-request="uploadContractSourceHandler"
                    :auto-upload="false"
                  >
                    <div slot="tip" class="el-upload__tip">只能上传合约文件打包的zip文件</div>
                    <el-button slot="trigger">选取文件</el-button>
                  </el-upload>
                </el-form-item>
                <el-form-item label="合约入口文件：" prop="chosenSolidity">
                  <el-select v-model="form.chosenSolidity" placeholder="选择编译的合约文件">
                    <el-option
                      v-for="item in solidityFiles"
                      :key="item.path"
                      :label="item.path"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-row>
              <el-form-item
                label="合约类名："
                prop="className"
              >
                <el-input v-model.trim="form.className" placeholder="Class Name" />
              </el-form-item>
              <el-form-item
                label="合约版本号："
                prop="version"
              >
                <el-input v-model.trim="form.version" placeholder="Version" />
              </el-form-item>
              <el-form-item
                v-if="form.method ==='register'"
                label="已有合约地址："
                prop="address"
              >
                <el-input v-model.trim="form.address" placeholder="Address">
                  <template slot="prepend">0x</template>
                </el-input>
              </el-form-item>
            </div>
            <!-- Fabric -->
            <div v-else-if="form.stubType==='Fabric1.4'">
              <el-form-item
                v-if="form.method==='install'"
                label="所属机构名："
                prop="org"
              >
                <el-tooltip effect="light" content="被安装链码的endorser所属的机构" placement="top">
                  <el-input v-model="form.org" placeholder="Organization" />
                </el-tooltip>
              </el-form-item>
              <el-form-item
                v-if="form.method !=='install'"
                label="机构列表："
                prop="org"
              >
                <el-tooltip effect="light" placement="top">
                  <div slot="content">链码被安装的的机构列表 <br>注意：必须以JSON数组形式填入，例：["Org1"] </div>
                  <el-input v-model="form.org" placeholder="Organizations" />
                </el-tooltip>
              </el-form-item>
              <el-form-item v-if="form.method === 'install'" label="合约文件：" prop="compressedContent">
                <el-upload
                  ref="uploadChaincode"
                  action=""
                  :file-list="fileList"
                  accept=".tar,.gz"
                  :on-change="changeChaincodeFile"
                  :before-remove="beforeRemove"
                  :http-request="uploadContractCompressedHandler"
                  :auto-upload="false"
                >
                  <div slot="tip" class="el-upload__tip">
                    只能上传chaincode打包的tar/gz文件 <br>
                    注意：Golang版本的链码必须将链码放在'src/chaincode/'的目录下在能正确安装
                  </div>
                  <el-button slot="trigger" size="mini">选取文件</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item
                label="合约版本号："
                prop="version"
              >
                <el-input v-model.trim="form.version" placeholder="Version" />
              </el-form-item>
              <el-form-item label="合约语言：" prop="lang">
                <el-select v-model="form.lang" placeholder="请选择合约语言" style="width:100%">
                  <el-option label="Golang" value="GO_LANG" />
                  <el-option label="Java" value="JAVA" />
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="form.method==='instantiate'||form.method==='upgrade'"
                label="背书策略："
                prop="policy"
              >
                <el-upload
                  ref="uploadPolicy"
                  action=""
                  accept=".yaml"
                  :file-list="policyFile"
                  :on-change="changePolicyFile"
                  :before-remove="beforeRemove"
                  :http-request="uploadPolicyHandler"
                  :auto-upload="false"
                >
                  <div slot="tip" class="el-upload__tip">只能上传policy的yaml格式文件, 不上传默认为default</div>
                  <el-button slot="trigger" size="mini">选取文件</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item
                v-if="form.method==='instantiate'||form.method==='upgrade'"
                label="其他参数："
                prop="args"
              >
                <el-tooltip effect="light" placement="top">
                  <div slot="content">注意：必须以JSON数组形式填入，例：["a","10"]</div>
                  <el-input v-model="form.args" placeholder="Arguments" />
                </el-tooltip>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button v-loading.fullscreen.lock="loading" type="primary" @click="onSubmit">执行</el-button>
              <el-button @click="onCancel">重置表单</el-button>
            </el-form-item>
            <el-form-item>
              <el-input
                v-if="submitResponse !== null"
                v-model="submitResponse"
                autosize
                type="textarea"
                readonly
                style="margin-bottom: 20px;width: 90%"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {
  buildBCOSDeployRequest,
  buildBCOSRegisterRequest,
  buildFabricInstallRequest,
  buildFabricInstantiateRequest, buildFabricUpgradeRequest, clearForm
} from '@/utils/resource'
import {
  bcosDeploy, bcosRegister, fabricInstall, fabricInstantiate, fabricUpgrade
} from '@/api/resource'
import { handleSuccessMsgBox, handleErrorMsgBox } from '@/utils/messageBox'

const JSZip = require('jszip')

export default {
  name: 'ResourceDeploy',
  data() {
    return {
      form: {
        stubType: null,
        method: null,
        prependPath: null,
        appendPath: null,
        fullPath: null,
        className: null,
        version: null,
        address: null,
        org: null,
        lang: null,
        policy: 'default',
        args: null,
        chosenSolidity: null,
        sourceContent: null,
        compressedContent: null
      },
      solidityFiles: [],
      zipContractFilesMap: {},
      fileList: [],
      policyFile: [],
      submitResponse: null,
      sourceContractLine: [],
      dependenciesLine: [],
      loading: false,
      lockDown: false,
      isFullPath: false,
      formRules: {
        stubType: [{ required: true, message: '请选择链类型', trigger: 'blur' }],
        compressedContent: [{ required: true, message: '请上传合约文件', trigger: 'blur' }],
        chosenSolidity: [{ required: true, message: '合约文件不能为空', trigger: 'blur' }],
        fullPath: [{ required: true, message: '资源路径不能为空', trigger: 'blur' },
          { required: true, message: '资源路径总长度不能超过128', trigger: 'blur', max: 128 },
          {
            pattern: /^((?!_)(?!-)(?!.*?_$)(?!.*?-$)[\u4e00-\u9fa5\w-]+\.){2}(?!_)(?!-)(?!.*?_$)(?!.*?-$)[\u4e00-\u9fa5\w-]+$/,
            required: true,
            message: '资源路径格式错误，应形如 \'path.to.resource\'',
            trigger: 'blur'
          }],
        appendPath: [{ required: true, message: '资源路径不能为空', trigger: 'blur' },
          { required: true, message: '资源路径总长度不能超过40', trigger: 'blur', max: 128 },
          {
            pattern: /^(?!_)(?!-)(?!.*?_$)(?!.*?-$)[\u4e00-\u9fa5\w-]+$/,
            required: true,
            message: '资源路径格式错误，应形如 \'path.to.resource\'',
            trigger: 'blur'
          }
        ],
        org: [
          { required: true, message: '所在组织名不能为空', trigger: 'blur' },
          { required: true, message: '所在组织名最长不能超过128', trigger: 'blur', max: 128 }
        ],
        version: [
          { required: true, message: '合约版本号不能为空', trigger: 'blur' },
          {
            required: true, message: '合约版本号格式错误', trigger: 'blur',
            pattern: /^([0-9]+)(\.([0-9]+)){0,5}$/
          }
        ],
        lang: [
          { required: true, message: '请选择合约语言', trigger: 'blur' }
        ],
        args: [
          { required: true, message: '其他参数不能为空，至少需要填入JSON数组：[]', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '已有合约地址不能为空', trigger: 'blur' },
          {
            required: true, message: '合约地址已包含0x前缀，无需重复添加', trigger: 'blur',
            pattern: /^(?!0x|0X).*/
          },
          {
            required: true, message: '合约地址格式错误', trigger: 'blur',
            pattern: /^[0-9a-fA-F]*$/, min: 1, max: 128
          }
        ],
        className: [
          { required: true, message: '合约类名不能为空', trigger: 'blur' },
          {
            required: true, message: '合约类名不能包含特殊字符', trigger: 'blur',
            pattern: /^(?!_)(?!-)(?!.*?_$)(?!.*?-$)[\u4e00-\u9fa5\w-]+$/
          },
          { required: true, message: '合约类名长度不能超过128', trigger: 'blur', max: 128 }
        ],
        method: [{ required: true, message: '请选择操作类型', trigger: 'blur' }]
      }
    }
  },
  watch: {
    solidityFiles(value) {
      if (value.length > 0) {
        this.form.chosenSolidity = value[0].value
      } else {
        this.form.chosenSolidity = null
      }
    }
  },
  created() {
    if (typeof (this.$route.query.path) !== 'undefined' && this.$route.query.path !== null) {
      this.form.prependPath = this.$route.query.path + '.'
    }

    if (typeof (this.$route.query.stubType) !== 'undefined' && this.$route.query.stubType !== null) {
      this.form.stubType = this.$route.query.stubType
      if (this.form.stubType === 'Fabric1.4') {
        this.form.method = 'install'
      } else {
        this.form.method = 'deploy'
      }
      this.lockDown = true
    } else {
      this.isFullPath = true
    }
  },
  methods: {
    mergeSourceContractLineToString() {
      this.form.sourceContent = ''
      for (const sourceContractLineElement of this.sourceContractLine) {
        this.form.sourceContent += sourceContractLineElement + '\n'
      }
    },
    onSubmit() {
      this.$refs['deployForm'].validate((validate) => {
        if (validate) {
          this.loading = true
          switch (this.form.method) {
            case 'deploy' :
              this.sourceContractLine = []
              this.dependenciesLine = []
              this.onBCOSDeploy()
              break
            case 'register':
              this.sourceContractLine = []
              this.dependenciesLine = []
              this.onBCOSRegister()
              break
            case 'install':
              this.onFabricInstall()
              break
            case 'instantiate':
              this.onFabricInstantiate()
              break
            case 'upgrade':
              this.onFabricUpgrade()
              break
            default:
              console.log(this.form)
          }
        } else {
          this.$message({
            message: '请检查所有输入',
            type: 'warning'
          })
        }
      })
    },
    onCancel() {
      this.$message({
        message: '已重置表单',
        type: 'info'
      })
      this.$refs.deployForm.resetFields()
      this.form.stubType = this.$route.query.stubType
      this.fileList = []
      this.policyFile = []
      this.sourceContractLine = []
      this.dependenciesLine = []
      this.solidityFiles = []
      this.zipContractFilesMap = {}
    },
    onBCOSDeploy() {
      try {
        this.mergeSolidityFile('./' + this.form.chosenSolidity)
        this.mergeSourceContractLineToString()
      } catch (e) {
        this.loading = false
        console.log(e)
        return
      }
      const h = this.$createElement
      this.$msgbox({
        message: h('div', null, [
          h('p', { style: { fontSize: '16px' }}, '确认执行部署合约吗？'),
          h('div', { style: { fontSize: '4px', marginTop: '5px' }}, '注意：若是升级FISCO BCOS合约，请勿修改/删除旧版本合约的ABI接口，否则会出现旧合约历史交易为空的情况！')
        ]),
        title: '注意',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: '确认部署',
        cancelButtonText: '取消部署'
      }).then(_ => {
        bcosDeploy(buildBCOSDeployRequest(this.form)).then(response => {
          this.loading = false
          if (response.errorCode !== 0) {
            handleErrorMsgBox(
              '执行FISCO BCOS部署合约失败，错误：',
              '错误码：' + response.errorCode,
              (response.data === null) ? response.message : response.data.errorMessage
            )
          } else {
            this.onSubmitSuccess(response)
          }
        }).catch(err => {
          this.loading = false
          this.$message(
            {
              message: err,
              type: 'error',
              center: true
            }
          )
        })
      }).catch(_ => {
        this.loading = false
      })
    },
    onBCOSRegister() {
      try {
        this.mergeSolidityFile('./' + this.form.chosenSolidity)
        this.mergeSourceContractLineToString()
      } catch (e) {
        this.loading = false
        console.log(e)
        return
      }
      bcosRegister(buildBCOSRegisterRequest(this.form)).then(response => {
        this.loading = false
        if (response.errorCode !== 0) {
          handleErrorMsgBox(
            '执行FISCO BCOS注册合约失败，错误：',
            '错误码：' + response.errorCode,
            (response.data === null) ? response.message : response.data.errorMessage
          )
        } else {
          this.onSubmitSuccess(response)
        }
      }).catch(err => {
        this.loading = false
        this.$message(
          {
            message: err,
            type: 'error',
            center: true
          }
        )
      })
    },
    onFabricInstall() {
      fabricInstall(buildFabricInstallRequest(this.form)).then(response => {
        this.loading = false
        if (response.errorCode !== 0) {
          handleErrorMsgBox(
            '执行Hyperledger Fabric合约安装失败，错误：',
            '错误码：' + response.errorCode,
            (response.data === null) ? response.message : response.data.errorMessage
          )
        } else {
          const h = this.$createElement
          this.$confirm('提示', {
            message: h('div', null, [
              h('p', null, '已执行成功，返回信息：'),
              h('p', null, response.data),
              h('p', { style: 'font-weight: bold;' }, '注意: 必须实例化合约/升级合约才能在资源列表显示')
            ]),
            title: '执行成功',
            confirmButtonText: '实例化合约',
            cancelButtonText: '继续安装合约',
            type: 'success'
          }).then(_ => {
            this.form.compressedContent = null
            this.form.method = 'instantiate'
            this.form.policy = 'default'
            this.form.org = null
            this.$refs.deployForm.clearValidate()
          }).catch(_ => {
            this.fileList = []
            this.policyFile = []
            this.sourceContractLine = []
            this.dependenciesLine = []
            this.solidityFiles = []
            this.zipContractFilesMap = {}
            this.$refs.deployForm.resetFields()
            this.form.sourceContent = null
          })
        }
      }).catch(err => {
        this.loading = false
        this.$message(
          {
            message: err,
            type: 'error',
            center: true
          }
        )
      })
    },
    onFabricInstantiate() {
      fabricInstantiate(buildFabricInstantiateRequest(this.form)).then(response => {
        this.loading = false
        if (response.errorCode !== 0) {
          handleErrorMsgBox(
            '执行Hyperledger Fabric合约实例化失败，错误：',
            '错误码：' + response.errorCode,
            (response.data === null) ? response.message : response.data.errorMessage
          )
        } else {
          this.onSubmitSuccess(response)
        }
      }).catch(err => {
        this.loading = false
        this.$message(
          {
            message: err,
            type: 'error',
            center: true
          }
        )
      })
    },
    onFabricUpgrade() {
      fabricUpgrade(buildFabricUpgradeRequest(this.form)).then(response => {
        this.loading = false
        if (response.errorCode !== 0) {
          handleErrorMsgBox(
            '执行Hyperledger Fabric合约升级失败，错误：',
            '错误码：' + response.errorCode,
            (response.data === null) ? response.message : response.data.errorMessage
          )
        } else {
          this.onSubmitSuccess(response)
        }
      }).catch(err => {
        this.loading = false
        this.$message(
          {
            message: err,
            type: 'error',
            center: true
          }
        )
      })
    },
    onSubmitSuccess(response) {
      handleSuccessMsgBox(
        '已执行成功，返回信息：',
        '执行成功',
        response.data,
        {
          showCancelButton: true,
          confirmButtonText: '前往资源列表',
          cancelButtonText: '继续部署'
        }
      ).then(_ => {
        this.$refs.deployForm.resetFields()
        this.$router.push('resourceList')
      }).catch(_ => {
        this.fileList = []
        this.policyFile = []
        this.sourceContractLine = []
        this.dependenciesLine = []
        this.solidityFiles = []
        this.zipContractFilesMap = {}
        this.$refs.deployForm.resetFields()
        this.form.sourceContent = null
      })
    },
    mergeSolidityFile(targetFile) {
      if (this.$refs.uploadContract.uploadFiles.length === 0) {
        return
      }
      if (typeof this.zipContractFilesMap[targetFile] === 'undefined') {
        this.$msgbox('不能找到文件依赖：' + targetFile + ' 请确认之后再执行！', '错误', 'error').catch(_ => {})
        throw new Error('Resolve files error')
      } else {
        const lines = this.zipContractFilesMap[targetFile].split('\n')
        for (const line of lines) {
          if (line.indexOf('pragma experimental ABIEncoderV2;') !== -1) {
            if (!this.dependenciesLine.includes('pragma experimental ABIEncoderV2;')) {
              this.dependenciesLine.push('pragma experimental ABIEncoderV2;')
              this.sourceContractLine.push(line)
            }
          } else if (/^\s*import\s+["'](.+)["']\s*;\s*$/.test(line)) {
            this.dependenciesLine.push(line)
            const matchObj = /^\s*import\s+["'](.+)["']\s*;\s*$/.exec(line)
            if (!this.dependenciesLine.includes(matchObj[1])) {
              this.dependenciesLine.push(matchObj[1])
              this.mergeSolidityFile(matchObj[1])
            }
          } else {
            this.sourceContractLine.push(line)
          }
        }
      }
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`, '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.zipContractFilesMap = {}
        this.solidityFiles = []
        this.form.chosenSolidity = null
        this.form.sourceContent = null
        this.form.compressedContent = null
        this.form.policy = 'default'
        this.sourceContractLine = []
        this.dependenciesLine = []
        return true
      })
    },
    changeContractFile(file, fileList) {
      if (fileList.length === 2) {
        fileList.shift()
      }
      this.sourceContractLine = []
      this.dependenciesLine = []
      this.form.sourceContent = null
      this.form.chosenSolidity = null
      this.$refs.uploadContract.submit()
    },
    changeChaincodeFile(file, fileList) {
      if (fileList.length === 2) {
        fileList.shift()
      }
      this.$refs.uploadChaincode.submit()
    },
    changePolicyFile(file, fileList) {
      if (fileList.length === 2) {
        fileList.shift()
      }
      this.$refs.uploadPolicy.submit()
    },
    uploadContractSourceHandler(params) {
      const jszip = new JSZip()
      if (params.file !== null && (/(zip)/.test(params.file.type) || /.(zip|ZIP)$/.test(params.file.name))) {
        this.zipContractFilesMap = {}
        this.solidityFiles = []
        this.sourceContractLine = []
        this.dependenciesLine = []
        const _this = this
        params.onProgress({ percent: 20 })
        var zipFiles = []
        var promises = []
        jszip.loadAsync(params.file).then(function(zip) {
          zip.forEach(function(relativePath, file) {
            if (file.dir === false) {
              promises.push(zip.file(file.name).async('string').then((data) => {
                zipFiles.push({ path: file.name, data: data })
              }))
            }
          })
          Promise.all(promises).then(() => {
            for (const zipFile of zipFiles) {
              _this.zipContractFilesMap['./' + zipFile.path] = zipFile.data
              if (zipFile.path.indexOf('/') === -1 &&
                  (zipFile.path.endsWith('.sol') || zipFile.path.endsWith('.abi'))) {
                _this.solidityFiles.push({ path: zipFile.path, value: zipFile.path })
              }
            }
            if (_this.solidityFiles.length === 0) {
              this.$alert('zip最外层文件中不含有Solidity或ABI文件', '错误', {
                confirmButtonText: '确定',
                type: 'error'
              })
              params.onProgress({ percent: 0 })
              params.onError()
              return
            }
            params.onProgress({ percent: 100 })
            params.onSuccess()
            _this.$refs.deployForm.clearValidate('chosenSolidity')
          })
        }).catch(err => {
          handleErrorMsgBox(
            '读取zip文件错误：',
            '错误',
            err.toString()
          ).catch(_ => {
          })
          this.zipContractFilesMap = {}
          this.solidityFiles = []
          params.onProgress({ percent: 0 })
          params.onError()
        })
      } else {
        this.$alert('请选择zip文件！', '错误', {
          type: 'error'
        }).catch(_ => {})
        this.zipContractFilesMap = {}
        this.solidityFiles = []
        params.onProgress({ percent: 0 })
        params.onError()
      }
    },
    uploadContractCompressedHandler(params) {
      params.onProgress({ percent: 20 })
      if (params.file !== null && (/(gzip|tar)$/.test(params.file.type) || /.(gz|tar)$/.test(params.file.name))) {
        setTimeout(() => {
          this.readBaseBytes(params)
        }, 100)
        this.$refs.deployForm.clearValidate('compressedContent')
      } else {
        this.$alert('请选择tar/gz文件！', '错误', {
          type: 'error'
        }).catch(_ => {})
        this.form.compressedContent = null
        params.onProgress({ percent: 0 })
        params.onError()
      }
    },
    uploadPolicyHandler(params) {
      params.onProgress({ percent: 20 })
      if (params.file !== null && (/.(yaml|YAML)$/.test(params.file.name) || /(yaml)$/.test(params.file.type))) {
        setTimeout(() => {
          this.readBaseBytes(params)
        }, 100)
      } else {
        this.$alert('请选择yaml文件！', '错误', {
          type: 'error'
        }).catch(_ => {})
        this.form.policy = 'default'
        params.onProgress({ percent: 0 })
        params.onError()
      }
    },
    async readText(params) {
      // UTF-8,GBK,GB2312
      const readFile = new FileReader()
      readFile.readAsText(params.file, 'UTF-8')
      readFile.onload = (e) => {
        this.form.sourceContent = e.target.result
        params.onProgress({ percent: 100 })
        params.onSuccess()
        this.$refs.deployForm.clearValidate('sourceContent')
        this.$refs.deployForm.clearValidate('policy')
      }
    },
    async readBaseBytes(params) {
      const readFile = new FileReader()
      readFile.readAsDataURL(params.file)
      readFile.onload = (e) => {
        this.form.compressedContent = e.target.result.split('base64,')[1]
        this.form.policy = e.target.result.split('base64,')[1]
        params.onProgress({ percent: 100 })
        params.onSuccess()
        this.$refs.deployForm.clearValidate('sourceContent')
        this.$refs.deployForm.clearValidate('policy')
      }
    },
    stubTypeChange() {
      this.fileList = []
      this.policyFile = []
      this.$refs.deployForm.clearValidate()
      this.form.method = null
      clearForm(this.form)
    },
    methodChange() {
      this.fileList = []
      this.policyFile = []
      this.zipContractFilesMap = {}
      this.solidityFiles = []
      this.sourceContractLine = []
      this.dependenciesLine = []
      this.$refs.deployForm.clearValidate()
      clearForm(this.form)
    }
  }
}
</script>

<style scoped>

</style>

