<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">欢迎登录</h3>
      </div>

      <el-form-item prop="secKey">
        <el-upload
          action=""
          accept=".key"
          :show-file-list="false"
          :http-request="uploadECDSASecPemHandler"
          :auto-upload="true"
        >
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="identity"
            v-model="loginForm.identity"
            placeholder="账户（点击上传私钥）"
            name="identity"
            type="text"
          />
        </el-upload>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>

      <div class="tips">
        <span style="margin-right:20px;">还没有账户？</span>
        <el-button type="text" @click="genSecPem">生成</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>

import { ecdsa } from '@/utils/pem'
import { downloadAsFile } from '@/utils/download'
import { MessageBox } from 'element-ui'

export default {
  name: 'Login',
  data() {
    const validateSecKey = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('请上传私钥'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      secPem: '',
      loginForm: {
        identity: null,
        secKey: null
      },
      loginRules: {
        secKey: [
          { required: true, trigger: 'change', validator: validateSecKey }
        ]
      },
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
  },
  beforeDestroy() {
  },
  methods: {
    genSecPem() {
      this.secPem = ecdsa.generateSecPem()
      var address = ecdsa.build(this.secPem).address
      MessageBox.confirm('账户地址：' + address, '账户已生成', {
        confirmButtonText: '保存私钥',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        downloadAsFile(this.secPem, address + '.key')
      })
    },
    uploadECDSASecPemHandler(params) {
      const reader = new FileReader()
      reader.onload = (event) => {
        this.secPem = event.target.result
        var keyInfo = ecdsa.build(this.secPem)
        this.loginForm.identity = keyInfo.address
        this.loginForm.secKey = keyInfo.secKeyHex
      }
      reader.readAsText(params.file)
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          var loginParams = {
            identity: this.loginForm.identity,
            secKey: this.loginForm.secKey
          }

          this.loading = true
          this.$store
            .dispatch('user/login', loginParams)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch(e => {
              console.log('error in login: ' + e)
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 90%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .el-upload {
      width: 100%;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
