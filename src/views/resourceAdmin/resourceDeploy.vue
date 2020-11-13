<template>
  <div class="app-container">
    <el-card>
      <el-page-header @back="() => {this.$router.push({ path: 'resourceList' })}" content="资源部署页面" title="资源管理">
      </el-page-header>
      <el-row style="margin-top: 20px">
        <el-col :span="5" :offset="1" style="margin-top:10px;height: 170px">
        <el-steps direction="vertical" :active="stepActive">
          <el-step title="步骤 1" description="选择链类型"></el-step>
          <el-step title="步骤 2" description="选择操作类型"></el-step>
          <el-step title="步骤 3" description="设置操作参数"></el-step>
        </el-steps>
      </el-col>
        <el-col :span="16">
        <el-form ref="deployForm" :model="form" label-width="120px" :rules="formRules">
          <el-form-item label="选择链类型：">
            <el-select v-model="form.stubType" placeholder="请选择部署的链类型" style="width:100%" @change="stubTypeChange">
              <el-option-group label="FISCO BCOS">
                <el-option label="FISCO BCOS 2.0+" value="BCOS2.0"/>
                <el-option label="FISCO BCOS 2.0+ 国密版" value="GM_BCOS2.0"/>
              </el-option-group>
              <el-option-group label="Hyperledger Fabric">
                <el-option label="Hyperledger Fabric 1.4+" value="Fabric1.4"/>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item label="选择操作：" prop="method">
            <el-select v-model="form.method" placeholder="选择操作类型" @change="methodChange" key="methodSelect">
              <el-option label="部署合约" value="deploy" v-if="(form.stubType ==='BCOS2.0'||form.stubType ==='GM_BCOS2.0')">
                <span style="float: left">部署合约</span>
                <span style="float: right; color: #8492a6; font-size: 13px">Deploy</span>
              </el-option>
              <el-option
                  label="注册已有合约"
                  value="register"
                  v-if="(form.stubType ==='BCOS2.0'||form.stubType ==='GM_BCOS2.0')">
                <span style="float: left">注册已有合约</span>
                <span style="float: right; color: #8492a6; font-size: 13px">Register</span>
              </el-option>
              <el-option label="安装合约" value="install" v-if="form.stubType ==='Fabric1.4'">
                <span style="float: left">安装合约</span>
                <span style="float: right; color: #8492a6; font-size: 13px">Install</span>
              </el-option>
              <el-option label="实例化合约" value="instantiate" v-if="form.stubType ==='Fabric1.4'">
                <span style="float: left">实例化合约</span>
                <span style="float: right; color: #8492a6; font-size: 13px">Instantiate</span>
              </el-option>
              <el-option label="升级合约" value="upgrade" v-if="form.stubType ==='Fabric1.4'">
                <span style="float: left">升级合约</span>
                <span style="float: right; color: #8492a6; font-size: 13px">Upgrade</span>
              </el-option>
            </el-select>
          </el-form-item>

          <!-- BCOS -->
          <div v-if="(form.stubType ==='BCOS2.0'||form.stubType ==='GM_BCOS2.0')">
            <el-form-item
                label="资源路径："
                prop="path">
              <el-input v-model="form.path" placeholder="Path"></el-input>
            </el-form-item>
            <el-form-item label="合约文件：" prop="sourceContent">
              <el-upload
                  class="upload-demo"
                  ref="upload"
                  action=""
                  :on-change="changeFile"
                  :before-remove="beforeRemove"
                  :http-request="uploadHandler"
                  :auto-upload="false">
                <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item
                label="合约类名："
                prop="className">
              <el-input v-model="form.className" placeholder="Class Name"></el-input>
            </el-form-item>
            <el-form-item
                label="合约版本号："
                prop="version">
              <el-input v-model="form.version" placeholder="Version"></el-input>
            </el-form-item>
            <el-form-item
                label="已有合约地址："
                v-if="form.method ==='register'"
                prop="address">
              <el-input v-model="form.address" placeholder="Address">
                <template slot="prepend">0x</template>
              </el-input>
            </el-form-item>
          </div>
          <!-- Fabric -->
          <div v-else-if="form.stubType==='Fabric1.4'">
            <el-form-item
                label="资源路径："
                prop="path">
              <el-input v-model="form.path" placeholder="Path"></el-input>
            </el-form-item>
            <el-form-item
                label="所在组织名："
                prop="org">
              <el-input v-model="form.org" placeholder="Organization"></el-input>
            </el-form-item>
            <el-form-item label="合约文件：" prop="sourceContent">
              <el-upload
                  class="upload-demo"
                  ref="upload"
                  action=""
                  :on-change="changeFile"
                  :before-remove="beforeRemove"
                  :http-request="uploadHandler"
                  :auto-upload="false">
                <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item
                label="合约版本号："
                prop="version">
              <el-input v-model="form.version" placeholder="Version"></el-input>
            </el-form-item>
            <el-form-item label="合约语言：" prop="lang">
              <el-select v-model="form.lang" placeholder="请选择合约语言" style="width:100%">
                <el-option label="Golang" value="GO_LANG"/>
                <el-option label="Java" value="JAVA"/>
              </el-select>
            </el-form-item>
            <el-form-item
                label="背书策略："
                v-if="form.method==='instantiate'||form.method==='upgrade'"
                prop="policy">
              <el-input v-model="form.policy" placeholder="Policy"></el-input>
            </el-form-item>
            <el-form-item
                label="其他参数："
                v-if="form.method==='instantiate'||form.method==='upgrade'"
                prop="args">
              <el-input v-model="form.args" placeholder="Arguments"></el-input>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">执行</el-button>
            <el-button @click="onCancel">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-input
                autosize
                type="textarea"
                readonly
                v-model="submitResponse"
                v-if="submitResponse !== null"
                style="margin-bottom: 20px;width: 90%">
            </el-input>
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
  buildFabricInstantiateRequest, clearForm
} from '@/utils/resource'
import { bcosDeploy, bcosRegister, fabricInstall, fabricInstantiate, fabricUpgrade } from '@/api/resource'

export default {
  created() {
    console.log(this.$route)

    if (this.$route.query.path !== undefined) {
      this.form.path = this.$route.query.path
    }

    if (this.$route.query.stubType !== undefined) {
      this.form.stubType = this.$route.query.stubType

      if (this.form.stubType === 'Fabric1.4') {
        this.form.method = 'install'
      } else {
        this.form.method = 'deploy'
      }
    }
  },
  data() {
    return {
      form: {
        stubType: null,
        method: null,
        path: null,
        className: null,
        version: null,
        address: null,
        org: null,
        lang: null,
        policy: null,
        args: null,
        sourceContent: null
      },
      fileList: [],
      stepActive: 0,
      submitResponse: null,
      formRules: {
        sourceContent: [
          { required: true, message: '合约文件不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '资源路径不能为空', trigger: 'blur' },
          { required: true, message: '资源路径总长度不能超过40', trigger: 'blur', min: 1, max: 40 },
          {
            pattern: /^[A-Za-z]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
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
        policy: [
          { required: true, message: '背书策略不能为空', trigger: 'blur' },
          {
            required: true, message: '背书策略格式错误', trigger: 'blur',
            pattern: /^[A-Za-z0-9-_,{}\[\]"'&|]+$/
          }
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
  methods: {
    onSubmit() {
      this.$refs['deployForm'].validate((validate) => {
        if (validate) {
          switch (this.form.method) {
            case 'deploy' :
              bcosDeploy(buildBCOSDeployRequest(this.form)).then(response => {
                if (response.errorCode !== 0) {
                  this.$message({
                    message: '执行FISCO BCOS部署合约失败，错误：' + (response.data === null) ? response.message : response.data.errorMessage,
                    type: 'error',
                    center: true
                  })
                  this.stepActive = 2
                  this.fileList = []
                  this.$refs.deployForm.resetFields()
                } else {
                  this.$message({
                    message: '执行FISCO BCOS部署合约成功！',
                    type: 'success',
                    center: true
                  })
                  this.submitResponse = JSON.stringify(response, null, 4)
                }
              }).catch(err => {
                this.$message(
                  {
                    message: err,
                    type: 'error'
                  }
                )
              })
              break
            case 'register':
              bcosRegister(buildBCOSRegisterRequest(this.form)).then(response => {
                if (response.errorCode !== 0) {
                  this.$message({
                    message: '执行FISCO BCOS注册合约失败，错误：' + (response.data === null) ? response.message : response.data.errorMessage,
                    type: 'error',
                    center: true
                  })
                  this.stepActive = 2
                  this.fileList = []
                  this.$refs.deployForm.resetFields()
                } else {
                  this.$message({
                    message: '执行FISCO BCOS注册合约成功！',
                    type: 'success',
                    center: true
                  })
                  this.submitResponse = JSON.stringify(response, null, 4)
                }
              }).catch(err => {
                this.$message(
                  {
                    message: err,
                    type: 'error'
                  }
                )
              })
              break
            case 'install':
              fabricInstantiate(buildFabricInstallRequest(this.form)).then(response => {
                if (response.errorCode !== 0) {
                  this.$message({
                    message: '执行Hyperledger Fabric合约安装失败，错误：' + (response.data === null) ? response.message : response.data.errorMessage,
                    type: 'error',
                    center: true
                  })
                  this.stepActive = 2
                  this.fileList = []
                  this.$refs.deployForm.resetFields()
                } else {
                  this.$message({
                    message: '执行Hyperledger Fabric合约安装成功！',
                    type: 'success',
                    center: true
                  })
                  this.submitResponse = JSON.stringify(response, null, 4)
                }
              }).catch(err => {
                this.$message(
                  {
                    message: err,
                    type: 'error'
                  }
                )
              })
              break
            case 'instantiate':
              fabricInstall(buildFabricInstantiateRequest(this.form)).then(response => {
                if (response.errorCode !== 0) {
                  this.$message({
                    message: '执行Hyperledger Fabric合约实例化失败，错误：' + (response.data === null) ? response.message : response.data.errorMessage,
                    type: 'error',
                    center: true
                  })
                  this.stepActive = 2
                  this.fileList = []
                  this.$refs.deployForm.resetFields()
                } else {
                  this.$message({
                    message: '执行Hyperledger Fabric合约实例化成功！',
                    type: 'success',
                    center: true
                  })
                  this.submitResponse = JSON.stringify(response, null, 4)
                }
              }).catch(err => {
                this.$message(
                  {
                    message: err,
                    type: 'error'
                  }
                )
              })
              break
            case 'upgrade':
              fabricUpgrade(buildFabricInstantiateRequest(this.form)).then(response => {
                if (response.errorCode !== 0) {
                  this.$message({
                    message: '执行Hyperledger Fabric合约升级失败，错误：' + (response.data === null) ? response.message : response.data.errorMessage,
                    type: 'error',
                    center: true
                  })
                  this.stepActive = 2
                  this.fileList = []
                  this.$refs.deployForm.resetFields()
                } else {
                  this.$message({
                    message: '执行Hyperledger Fabric合约升级成功！',
                    type: 'success',
                    center: true
                  })
                  this.submitResponse = JSON.stringify(response, null, 4)
                }
              }).catch(err => {
                this.$message(
                  {
                    message: err,
                    type: 'error'
                  }
                )
              })
              break
            default:
              console.log(this.form)
          }
          this.stepActive = 3
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
      this.stepActive = 0
      this.fileList = []
      this.form.method = null
      this.form.stubType = null
      this.$refs.deployForm.resetFields()
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
        this.fileList = []
        this.form.sourceContent = null
        return true
      })
    },
    changeFile(file, fileList) {
      if (fileList.length === 2) {
        fileList.shift()
      }
      this.$refs.upload.submit()
    },
    uploadHandler(params) {
      params.onProgress({ percent: 20 })
      setTimeout(() => {
        this.readText(params)
      }, 100)
    },
    async readText(params) {
      // UTF-8,GBK,GB2312
      const readFile = new FileReader()
      readFile.onload = (e) => {
        this.form.sourceContent = e.target.result
        params.onProgress({ percent: 100 })
        params.onSuccess()
        this.$refs.deployForm.clearValidate('sourceContent')
      }
      readFile.readAsText(params.file)
    },
    stubTypeChange() {
      this.stepActive = 1
      this.fileList = []
      this.$refs.deployForm.clearValidate()
      this.form.method = null
      clearForm(this.form)
    },
    methodChange() {
      this.stepActive = 2
      this.fileList = []
      this.$refs.deployForm.clearValidate()
      clearForm(this.form)
    }
  }
}
</script>

<style scoped>

</style>

