<template>
  <div class="register-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="register-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">欢迎注册 WeCross</h3>
      </div>

      <el-tooltip placement="right">
        <div slot="content">
          用户名长度3～18个字符，支持数字、大小写字母、下划线_、连接符-
        </div>
        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="registerForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
          />
        </el-form-item>
      </el-tooltip>

      <el-tooltip placement="right">
        <div slot="content">
          密码长度6~18个字符，至少包含一个数字和一个字母，支持特殊字符~!@#$%^&*()
        </div>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="registerForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-tooltip placement="right">
        <div slot="content">确认密码必须一致</div>
        <el-form-item prop="checkPass">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            v-model="registerForm.checkPass"
            :type="passwordType"
            placeholder="确认密码"
            name="password"
            tabindex="3"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
      </el-tooltip>
      <el-form-item v-if="needMailAuth">
        <span class="svg-container el-icon-s-promotion" />
        <el-input
          v-model="registerForm.email"
          placeholder="邮箱"
          type="text"
          tabindex="1"
        />
      </el-form-item>
      <el-row v-if="needMailAuth" :gutter="20">
        <el-col :span="17">
          <el-form-item>
            <el-input
              v-model="registerForm.mailCode"
              placeholder="邮箱验证码"
              tabindex="4"
            />
          </el-form-item>
        </el-col>
        <el-col style="float: right; margin-right: 2px" :span="6">
          <el-button
            type="primary"
            style="
              margin-top: 2px;
              width: 116px;
              height: 45px;
              text-align: center;
              float: right;
            "
            @click="getEmailCode()"
          >发送验证码</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="17">
          <el-form-item prop="authCode">
            <el-input
              v-model="registerForm.authCode"
              placeholder="注册验证码"
              name="imageAuthCode"
              tabindex="4"
              @keyup.enter.native="handleRegister('registerForm')"
            />
          </el-form-item>
        </el-col>
        <el-col style="float: right; margin-right: 2px" :span="6">
          <div
            style="
              margin-top: 2px;
              width: 116px;
              height: 45px;
              text-align: center;
              background: white;
              float: right;
            "
          >
            <i
              v-if="imageAuthCode.imageAuthCodeBase64URL === ''"
              style="margin-top: 12%"
              class="el-icon-loading"
            />
            <img
              v-else
              style="width: 100%; height: auto; vertical-align: middle"
              :src="imageAuthCode.imageAuthCodeBase64URL"
              alt=""
              tabindex="4"
              @click="handleUpdateAuthCode"
            >
          </div>
        </el-col>
      </el-row>

      <el-button
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click="handleRegister('registerForm')"
      >注册</el-button>

      <div class="tips">
        <span style="margin-right: 20px">已有账号？</span>
        <el-button type="text" @click="handleLogin">登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername, validPassword } from '@/utils/validate'
import { queryAuthCode } from '@/utils/authcode'
import { getPubKey } from '@/utils/auth'
import { register, isNeedMailAuth, sendMailCode } from '@/api/user'
import { rsa_encode } from '@/utils/rsa'
import { queryPub } from '@/utils/authcode'
import { confusePassword } from '@/utils/validate'
import { ErrorCode } from '@/utils/errorcode'

export default {
  name: 'Register',
  data() {
    const checkUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(
          new Error(
            '用户名长度3～18个字符，支持数字、大小写字母、下划线_、连接符-'
          )
        )
      } else {
        callback()
      }
    }
    const verifyPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
        return
      }
      if (!validPassword(value)) {
        callback(
          new Error(
            '密码长度6~18个字符，至少包含一个数字和一个字母，支持特殊字符~!@#$%^&*()'
          )
        )
      } else {
        callback()
      }
    }
    const confirmPwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const confirmAuthCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }
    return {
      needMailAuth: false,
      registerForm: {
        password: '',
        checkPass: '',
        username: '',
        authCode: '',
        email: '',
        mailCode: ''

      },
      timer: null,
      imageAuthCode: {
        imageAuthCodeBase64URL: '',
        randomToken: ''
      },
      registerRules: {
        username: [
          { required: true, validator: checkUsername, trigger: 'change' }
        ],
        password: [{ required: true, validator: verifyPwd, trigger: 'blur' }],
        checkPass: [
          { required: true, validator: confirmPwd, trigger: 'change' }
        ],
        authCode: [
          { required: true, validator: confirmAuthCode, trigger: 'change' }
        ]
      },
      passwordType: 'password'
    }
  },
  created() {
    isNeedMailAuth().then((response) => {
      if (response.errorCode !== 0) {
        this.$message({
          type: 'error',
          message: '获取邮箱验证配置失败'
        })
      }
      this.needMailAuth = response.data
    })

    /**
    query publicKey for data encrypt
    */
    queryPub()

    /**
     update the authentication code periodically
     */
    const callback = (resp) => {
      this.imageAuthCode.randomToken = resp.randomToken
      this.imageAuthCode.imageAuthCodeBase64URL = `data:image/png;base64,${resp.imageBase64}`
    }

    queryAuthCode(callback)
    this.timer = setInterval(queryAuthCode, 60000, callback)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {

    getEmailCode() {
      sendMailCode(this.registerForm.username, this.registerForm.email).then((response) => {
        if (response.errorCode === 0) {
          this.$message({
            type: 'success',
            message: '已将验证码发送至您的邮箱'
          })
        } else {
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },

    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'

      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },

    handleLogin() {
      this.$router.push({
        path: '/login'
      })
    },
    handleUpdateAuthCode() {
      const callback = (resp) => {
        this.imageAuthCode.randomToken = resp.randomToken
        this.imageAuthCode.imageAuthCodeBase64URL = `data:image/png;base64,${resp.imageBase64}`
      }

      queryAuthCode(callback)
    },
    handleRegister(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message({
            type: 'error',
            message: '用户名或密码无效，请重新输入'
          })
          return false
        }

        const params = {
          username: this.registerForm.username,
          email: this.registerForm.email,
          password: confusePassword(this.registerForm.password),
          randomToken: this.imageAuthCode.randomToken,
          authCode: this.registerForm.authCode,
          mailCode: this.registerForm.mailCode
        }

        // rsa encode parameters
        const pub = getPubKey()
        var encoded = rsa_encode(JSON.stringify(params), pub)

        register(encoded)
          .then((resp) => {
            var data = resp.data
            var errorCode = data.errorCode

            if (typeof resp.errorCode !== 'undefined' && resp.errorCode !== 0) {
              this.$message({
                type: 'error',
                message: resp.message
              })
              this.handleUpdateAuthCode()
            } else if (typeof errorCode !== 'undefined' && errorCode === 0) {
              this.$message({
                type: 'success',
                message: '注册成功!'
              })
              //
              this.handleLogin()
            } else if (
              typeof errorCode !== 'undefined' &&
              errorCode === ErrorCode.InvalidParameters
            ) {
              this.$message({
                type: 'error',
                message: '无效的参数请求'
              })
              this.handleUpdateAuthCode()
            } else if (
              typeof errorCode !== 'undefined' &&
              errorCode === ErrorCode.UAAccountExist
            ) {
              this.$message({
                type: 'error',
                message: '账户已经存在'
              })
              this.handleUpdateAuthCode()
            } else if (
              typeof errorCode !== 'undefined' &&
              errorCode === ErrorCode.ImageAuthTokenExpired
            ) {
              this.$message({
                type: 'error',
                message: '验证码过期'
              })
              this.handleUpdateAuthCode()
            } else if (
              typeof errorCode !== 'undefined' &&
              (errorCode === ErrorCode.ImageAuthTokenNotExist ||
                errorCode === ErrorCode.ImageAuthTokenNotMatch)
            ) {
              this.$message({
                type: 'error',
                message: '验证码错误'
              })
              this.handleUpdateAuthCode()
            } else if (
              typeof errorCode !== 'undefined' &&
              errorCode === ErrorCode.CreateUAFailed
            ) {
              this.$message({
                type: 'error',
                message: '创建新账户失败'
              })
              this.handleUpdateAuthCode()
            } else if (
              typeof errorCode !== 'undefined' &&
              errorCode === ErrorCode.UndefinedError
            ) {
              this.$message({
                type: 'error',
                message: '未定义的错误'
              })
              this.handleUpdateAuthCode()
            } else {
              this.$message({
                type: 'error',
                message: JSON.stringify(data)
              })
              this.handleUpdateAuthCode()
            }
          })
          .catch((error) => {
            this.$message({
              message: '网络异常：' + error,
              type: 'error',
              duration: 5000
            })
          })

        return true
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
  .register-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.register-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

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
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .register-form {
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
