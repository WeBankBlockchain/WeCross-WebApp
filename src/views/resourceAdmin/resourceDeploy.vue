<template>
  <div class="app-container">
    <el-card>
      <el-col :span="4" style="margin-top:10px;height: 170px">
        <el-steps direction="vertical" :active="stepActive">
          <el-step title="步骤 1" description="选择区块链类型"></el-step>
          <el-step title="步骤 2" description="选择操作类型"></el-step>
          <el-step title="步骤 3" description="设置操作参数"></el-step>
        </el-steps>
      </el-col>
      <el-col :span="20">
        <el-form ref="form" :model="form" label-width="120px">
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
          <el-form-item label="选择操作：">
            <el-select v-model="form.method" placeholder="选择操作类型" @change="methodChange" key="methodSelect">
              <el-option label="部署合约" value="deploy" v-show="form.stubType==='BCOS2.0'||form.stubType==='GM_BCOS2.0'">
                <span style="float: left">部署合约</span>
                <span style="float: right; color: #8492a6; font-size: 13px">Deploy</span>
              </el-option>
              <el-option
                  label="注册已有合约"
                  value="register"
                  v-show="form.stubType==='BCOS2.0'||form.stubType==='GM_BCOS2.0'">
                <span style="float: left">注册已有合约</span>
                <span style="float: right; color: #8492a6; font-size: 13px">Register</span>
              </el-option>
              <el-option label="安装合约" value="install" v-show="form.stubType==='Fabric1.4'">
                <span style="float: left">安装合约</span>
                <span style="float: right; color: #8492a6; font-size: 13px">Install</span>
              </el-option>
              <el-option label="实例化合约" value="instantiate" v-show="form.stubType==='Fabric1.4'">
                <span style="float: left">实例化合约</span>
                <span style="float: right; color: #8492a6; font-size: 13px">Instantiate</span>
              </el-option>
              <el-option label="升级合约" value="upgrade" v-show="form.stubType==='Fabric1.4'">
                <span style="float: left">升级合约</span>
                <span style="float: right; color: #8492a6; font-size: 13px">Upgrade</span>
              </el-option>
            </el-select>
          </el-form-item>

          <!-- BCOS -->
          <div v-if="form.stubType==='BCOS2.0'||form.stubType==='GM_BCOS2.0'">
            <el-form-item
                label="资源路径："
                prop="path"
                :rules="[{required: true, message: '资源路径不能为空', trigger: 'blur'}]">
              <el-input v-model="form.path" placeholder="Path"></el-input>
            </el-form-item>
            <el-form-item label="合约文件：">
              <el-upload
                  class="upload-demo"
                  ref="upload"
                  action=""
                  :on-change="changeFile"
                  :before-remove="handleRemove"
                  :http-request="uploadHandler"
                  :auto-upload="false">
                <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item
                label="合约类名："
                prop="className"
                :rules="[{required: true, message: '合约类名不能为空', trigger: 'blur'}]">
              <el-input v-model="form.className" placeholder="Class Name"></el-input>
            </el-form-item>
            <el-form-item
                label="合约版本号："
                prop="version"
                :rules="[{required: true, message: '合约版本号不能为空', trigger: 'blur'}]">
              <el-input v-model="form.version" placeholder="Version"></el-input>
            </el-form-item>
            <el-form-item
                label="已有合约地址："
                v-show="form.method==='register'"
                prop="address"
                :rules="[{required: true, message: '已有合约地址不能为空', trigger: 'blur'}]">
              <el-input v-model="form.address" placeholder="Address"/>
            </el-form-item>
          </div>
          <!-- Fabric -->
          <div v-else-if="form.stubType==='Fabric1.4'">
            <el-form ref="form" :model="form" label-width="120px" :inline="true" class="demo-form-inline">
              <el-form-item
                  label="资源路径："
                  prop="path"
                  :rules="[{required: true, message: '资源路径不能为空', trigger: 'blur'}]">
                <el-input v-model="form.path" placeholder="Path"></el-input>
              </el-form-item>
              <el-form-item
                  label="所在组织名："
                  prop="org"
                  :rules="[{required: true, message: '所在组织名不能为空', trigger: 'blur'}]">
                <el-input v-model="form.org" placeholder="Organization"></el-input>
              </el-form-item>
            </el-form>
            <el-form-item label="合约文件：">
              <el-upload
                  class="upload-demo"
                  ref="upload"
                  action=""
                  :on-change="changeFile"
                  :before-remove="handleRemove"
                  :http-request="uploadHandler"
                  :auto-upload="false">
                <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
              </el-upload>
            </el-form-item>
            <el-form ref="form" :model="form" label-width="120px" :inline="true" class="demo-form-inline">
              <el-form-item
                  label="合约版本号："
                  prop="version"
                  :rules="[{required: true, message: '合约版本号不能为空', trigger: 'blur'}]">
                <el-input v-model="form.version" placeholder="Version"></el-input>
              </el-form-item>
              <el-form-item label="合约语言：">
                <el-select v-model="form.lang" placeholder="请选择合约语言" style="width:100%">
                  <el-option label="Golang" value="GO_LANG"/>
                  <el-option label="Java" value="JAVA"/>
                </el-select>
              </el-form-item>
            </el-form>
            <el-form-item
                label="背书策略："
                v-show="form.method==='instantiate'||form.method==='upgrade'"
                prop="policy"
                :rules="[{required: true, message: '背书策略不能为空', trigger: 'blur'}]">
              <el-input v-model="form.policy" placeholder="Policy"></el-input>
            </el-form-item>
            <el-form-item
                label="其他参数："
                v-show="form.method==='instantiate'||form.method==='upgrade'"
                prop="args"
                :rules="[{required: true, message: '其他参数不能为空', trigger: 'blur'}]">
              <el-input v-model="form.args" placeholder="Arguments"></el-input>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">执行</el-button>
            <el-button @click="onCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-card>
  </div>
</template>

<script>

import { buildBCOSDeployRequest, buildBCOSRegisterRequest, buildFabricInstallRequest, buildFabricInstantiateRequest } from '@/utils/resource'
import { bcosDeploy, bcosRegister, fabricInstall, fabricInstantiate, fabricUpgrade } from '@/api/resource'

export default {
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
      stepActive: 0
    }
  },
  methods: {
    onSubmit() {
      switch (this.form.method) {
        case 'deploy' :
          bcosDeploy(buildBCOSDeployRequest(this.form)).then(response => {
            console.log(response)
          })
          break
        case 'register':
          bcosRegister(buildBCOSRegisterRequest(this.form)).then(response => {
            console.log(response)
          })
          break
        case 'install':
          fabricInstantiate(buildFabricInstallRequest(this.form)).then(response => {
            console.log(response)
          })
          break
        case 'instantiate':
          fabricInstall(buildFabricInstantiateRequest(this.form)).then(response => {
            console.log(response)
          })
          break
        case 'upgrade':
          fabricUpgrade(buildFabricInstantiateRequest(this.form)).then(response => {
            console.log(response)
          })
          break
        default:
          console.log(this.form)
      }
      this.$message('执行!')
      this.stepActive = 3
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
      this.stepActive = 0
      this.form.method = null
      this.form.stubType = null
      this.$refs.form.resetFields()
    },
    handleRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
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
      }
      readFile.readAsText(params.file)
    },
    stubTypeChange() {
      this.stepActive = 1
      this.form.method = null
      this.$refs.form.clearValidate()
    },
    methodChange() {
      this.stepActive = 2
      this.$refs.form.clearValidate()
    }
  }
}
</script>

<style scoped>

</style>

