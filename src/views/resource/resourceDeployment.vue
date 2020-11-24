<template>
  <div class="app-container">
    <el-card>
      <el-page-header content="资源部署页面" title="资源管理" @back="() => {this.$router.push({ path: 'resourceList' })}" />
      <el-divider />
      <el-row>
        <el-col :span="18" :offset="2">
          <el-form ref="deployForm" :model="form" label-width="120px" :rules="formRules">
            <el-form-item label="选择链类型：">
              <el-select v-model="form.stubType" placeholder="请选择部署的链类型" style="width:100%" @change="stubTypeChange">
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

            <!-- BCOS -->
            <div v-if="(form.stubType ==='BCOS2.0'||form.stubType ==='GM_BCOS2.0')">
              <el-form-item
                label="资源路径："
                prop="appendPath"
              >
                <el-input v-model="form.appendPath" placeholder="Path">
                  <template slot="prepend" style="padding: 5px">{{ form.prependPath }}</template>
                </el-input>
              </el-form-item>
              <el-row type="flex">
                <el-form-item label="上传文件：">
                  <el-upload
                    ref="uploadContract"
                    action=""
                    accept=".zip"
                    :file-list="fileList"
                    :on-change="changeFile"
                    :before-remove="beforeRemove"
                    :http-request="uploadContractSourceHandler"
                    :auto-upload="false"
                  >
                    <div slot="tip" class="el-upload__tip">Tips: 上传合约文件打包的zip文件</div>
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
                <el-input v-model="form.className" placeholder="Class Name" />
              </el-form-item>
              <el-form-item
                label="合约版本号："
                prop="version"
              >
                <el-input v-model="form.version" placeholder="Version" />
              </el-form-item>
              <el-form-item
                v-if="form.method ==='register'"
                label="已有合约地址："
                prop="address"
              >
                <el-input v-model="form.address" placeholder="Address">
                  <template slot="prepend">0x</template>
                </el-input>
              </el-form-item>
            </div>
            <!-- Fabric -->
            <div v-else-if="form.stubType==='Fabric1.4'">
              <el-form-item
                label="资源路径："
                prop="appendPath"
              >
                <el-input v-model="form.appendPath" placeholder="Path">
                  <template slot="prepend">{{ form.prependPath }}</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="所在组织名："
                prop="org"
              >
                <el-input v-model="form.org" placeholder="Organization" />
              </el-form-item>
              <el-form-item v-if="form.method === 'install'" label="合约文件：" prop="compressedContent">
                <el-upload
                  ref="uploadContract"
                  action=""
                  :file-list="fileList"
                  accept=".tar,.gz"
                  :on-change="changeFile"
                  :before-remove="beforeRemove"
                  :http-request="uploadContractCompressedHandler"
                  :auto-upload="false"
                >
                  <div slot="tip" class="el-upload__tip">Tips: 只能上传chaincode打包的tar/gz文件</div>
                  <el-button slot="trigger" size="mini">选取文件</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item
                label="合约版本号："
                prop="version"
              >
                <el-input v-model="form.version" placeholder="Version" />
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
                  <div slot="tip" class="el-upload__tip">只能上传policy的yaml格式文件, 默认为Default</div>
                  <el-button slot="trigger" size="mini">选取文件</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item
                v-if="form.method==='instantiate'||form.method==='upgrade'"
                label="其他参数："
                prop="args"
              >
                <el-input v-model="form.args" placeholder="Arguments" />
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
import { MessageBox } from 'element-ui'

const JSZip = require('jszip')

export default {
  name: 'ResourceDeploy',
  data() {
    return {
      form: {
        stubType: null,
        method: null,
        prependPath: '',
        appendPath: '',
        className: null,
        version: null,
        address: null,
        org: null,
        lang: null,
        policy: 'default',
        args: null,
        chosenSolidity: null,
        sourceContent: null,
        compressedContent: null,
        fileType: null
      },
      solidityFiles: [],
      zipContractFilesMap: {},
      fileList: [],
      policyFile: [],
      submitResponse: null,
      sourceContractLine: [],
      dependenciesLine: [],
      loading: false,
      formRules: {
        compressedContent: [{ required: true, message: '请上传合约文件', trigger: 'blur' }],
        chosenSolidity: [{ required: true, message: '合约文件不能为空', trigger: 'blur' }],
        appendPath: [{ required: true, message: '资源路径不能为空', trigger: 'blur' },
          { required: true, message: '资源路径总长度不能超过40', trigger: 'blur', min: 1, max: 40 },
          {
            pattern: /^[A-Za-z0-9_-]+$/,
            required: true,
            message: '资源路径格式错误，应形如 \'path.to.resource\'',
            trigger: 'blur'
          }
        ],
        org: [
          { required: true, message: '所在组织名不能为空', trigger: 'blur' },
          { required: true, message: '所在组织名最长不能超过12字', trigger: 'blur', min: 1, max: 12 },
          {
            required: true, message: '所在组织名不能包含特殊字符', trigger: 'blur',
            pattern: /^[A-Za-z0-9-_]+$/
          }
        ],
        version: [
          { required: true, message: '合约版本号不能为空', trigger: 'blur' },
          {
            required: true, message: '合约版本号格式错误', trigger: 'blur',
            pattern: /^([0-9]+)(\.([0-9]+))+$/
          }
        ],
        lang: [
          { required: true, message: '请选择合约语言', trigger: 'blur' }
        ],
        args: [
          { required: true, message: '其他参数不能为空', trigger: 'blur' },
          { required: true, message: '参数总长度不能超过40', trigger: 'blur', min: 1, max: 40 }
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
            pattern: /^[A-Za-z0-9-_]+$/
          },
          { required: true, message: '合约类名长度不能超过100', trigger: 'blur', min: 1, max: 100 }
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
    if (typeof (this.$route.query.path) !== 'undefined') {
      this.form.prependPath = this.$route.query.path + '.'
    }

    if (typeof (this.$route.query.stubType) !== 'undefined') {
      this.form.stubType = this.$route.query.stubType

      if (this.form.stubType === 'Fabric1.4') {
        this.form.method = 'install'
      } else {
        this.form.method = 'deploy'
      }
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
              this.mergeSolidityFile('./' + this.form.chosenSolidity)
              this.mergeSourceContractLineToString()
              this.onBCOSDeploy()
              break
            case 'register':
              this.mergeSolidityFile('./' + this.form.chosenSolidity)
              this.mergeSourceContractLineToString()
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
      this.fileList = []
      this.policyFile = []
      this.sourceContractLine = []
      this.dependenciesLine = []
      this.solidityFiles = []
      this.zipContractFilesMap = {}
    },
    onBCOSDeploy() {
      bcosDeploy(buildBCOSDeployRequest(this.form)).then(response => {
        this.loading = false
        if (response.errorCode !== 0) {
          this.$alert('执行FISCO BCOS部署合约失败，错误：' + (response.data === null) ? response.message : response.data.errorMessage, '错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
          this.$refs.deployForm.resetFields()
        } else {
          this.onSubmitSuccess(response)
        }
      }).catch(err => {
        this.loading = false
        this.$message(
          {
            message: err,
            type: 'error'
          }
        )
      })
    },
    onBCOSRegister() {
      bcosRegister(buildBCOSRegisterRequest(this.form)).then(response => {
        this.loading = false
        if (response.errorCode !== 0) {
          this.$alert('执行FISCO BCOS注册合约失败，错误：' + (response.data === null) ? response.message : response.data.errorMessage, '错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
          this.$refs.deployForm.resetFields()
        } else {
          this.onSubmitSuccess(response)
        }
      }).catch(err => {
        this.loading = false
        this.$message(
          {
            message: err,
            type: 'error'
          }
        )
      })
    },
    onFabricInstall() {
      fabricInstall(buildFabricInstallRequest(this.form)).then(response => {
        this.loading = false
        if (response.errorCode !== 0) {
          this.$alert('执行Hyperledger Fabric合约安装失败，错误：' + (response.data === null) ? response.message : response.data.errorMessage, '错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
          this.$refs.deployForm.resetFields()
        } else {
          this.onSubmitSuccess(response)
        }
      }).catch(err => {
        this.loading = false
        this.$message(
          {
            message: err,
            type: 'error'
          }
        )
      })
    },
    onFabricInstantiate() {
      fabricInstantiate(buildFabricInstantiateRequest(this.form)).then(response => {
        this.loading = false
        if (response.errorCode !== 0) {
          this.$alert('执行Hyperledger Fabric合约实例化失败，错误：' + (response.data === null) ? response.message : response.data.errorMessage, '错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
          this.$refs.deployForm.resetFields()
        } else {
          this.onSubmitSuccess(response)
        }
      }).catch(err => {
        this.loading = false
        this.$message(
          {
            message: err,
            type: 'error'
          }
        )
      })
    },
    onFabricUpgrade() {
      fabricUpgrade(buildFabricUpgradeRequest(this.form)).then(response => {
        this.loading = false
        if (response.errorCode !== 0) {
          this.$alert('执行Hyperledger Fabric合约升级失败，错误：' + (response.data === null) ? response.message : response.data.errorMessage, '错误', {
            confirmButtonText: '确定',
            type: 'error'
          })
          this.policyFile = []
          this.$refs.deployForm.resetFields()
        } else {
          this.onSubmitSuccess(response)
        }
      }).catch(err => {
        this.loading = false
        this.$message(
          {
            message: err,
            type: 'error'
          }
        )
      })
    },
    onSubmitSuccess(response) {
      this.$confirm(`已执行成功，返回信息：` + response.data, '执行成功', {
        confirmButtonText: '前往资源列表',
        cancelButtonText: '继续部署',
        type: 'success',
        center: true
      }).then(_ => {
        this.$refs.deployForm.resetFields()
        this.$router.push('resourceList')
      }).catch(_ => {
        this.fileList = []
        this.policyFile = []
        this.sourceContractLine = []
        this.dependenciesLine = []
        this.solidityFiles = []
        this.zipContractFilesMap = {}
        this.form.compressedContent = null
        this.form.policy = null
      })
    },
    mergeSolidityFile(targetFile) {
      if (this.$refs.uploadContract.uploadFiles.length === 0) {
        return
      }
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
        this.form.policy = null
        this.sourceContractLine = []
        this.dependenciesLine = []
        return true
      })
    },
    changeFile(file, fileList) {
      if (fileList.length === 2) {
        fileList.shift()
      }
      this.sourceContractLine = []
      this.dependenciesLine = []
      this.form.sourceContent = null
      this.form.chosenSolidity = null
      this.$refs.uploadContract.submit()
    },
    changePolicyFile(file, fileList) {
      if (fileList.length === 2) {
        fileList.shift()
      }
      this.$refs.uploadPolicy.submit()
    },
    uploadContractSourceHandler(params) {
      const jszip = new JSZip()

      this.zipContractFilesMap = {}
      this.solidityFiles = []
      this.sourceContractLine = []
      this.dependenciesLine = []
      const _this = this
      params.onProgress({ percent: 20 })
      this.form.fileType = params.file.name.split('.')[1]
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
            MessageBox.alert('zip最外层文件中不含有Solidity或ABI文件', '错误', {
              confirmButtonText: '确定',
              type: 'error'
            })
            params.onProgress({ percent: 0 })
            params.onError()
            return
          }
          params.onProgress({ percent: 100 })
          params.onSuccess()
        })
      })
    },
    uploadContractCompressedHandler(params) {
      params.onProgress({ percent: 20 })
      setTimeout(() => {
        this.readBaseBytes(params)
      }, 100)
    },
    uploadPolicyHandler(params) {
      params.onProgress({ percent: 20 })
      setTimeout(() => {
        this.readBaseBytes(params)
      }, 100)
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
      this.$refs.deployForm.clearValidate()
      clearForm(this.form)
    }
  }
}
</script>

<style scoped>

</style>

