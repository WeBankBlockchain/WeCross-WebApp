<template>
  <div class="login-container">
    <el-form
      ref="registerForm"
      :model="registerForm"
      :rules="registerRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">欢迎注册 WeCross</h3>
      </div>

      <el-tooltip placement="top">
        <div slot="content">长度为3～16个字符，字符可以为a-zA-Z0-9_-</div>
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
            auto-complete="on"
          />
        </el-form-item>
      </el-tooltip>

      <el-tooltip placement="top">
        <div slot="content">
          长度为8~14个字符<br />字母/数字以及标点符号至少包含2种<br />不允许有空格、中文
        </div>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="registerForm.pass"
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
      <el-tooltip placement="top">
        <div slot="content">
          长度为8~14个字符<br />字母/数字以及标点符号至少包含2种<br />不允许有空格、中文
        </div>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="registerForm.checkPass"
            :type="passwordType"
            placeholder="确认密码"
            name="password"
            tabindex="3"
            auto-complete="on"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click="handleRegister('registerForm')"
        >注册</el-button
      >

      <div class="tips">
        <span style="margin-right:20px;">已有账号？</span>
        <el-button type="text" @click="handleLogin">登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { register } from '@/api/user'

export default {
  name: 'Register',
  data() {
    var checkUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('无效的用户名'))
      } else {
        callback()
      }
    }
    var verifyPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 8 || value.length > 16) {
        callback(new Error('密码长度8～16个字符'))
      } else {
        callback()
      }
    }
    var confirmPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        pass: '',
        checkPass: '',
        username: ''
      },
      registerRules: {
        username: [
          { required: true, validator: checkUsername, trigger: 'change' }
        ],
        pass: [{ required: true, validator: verifyPwd, trigger: 'change' }],
        checkPass: [
          { required: true, validator: confirmPwd, trigger: 'change' }
        ]
      },
      passwordType: 'password'
    }
  },
  methods: {
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

    handleRegister(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message({
            type: 'error',
            message: '用户名或者密码无效，请重新输入'
          })
          return false
        }

        var params = {
          username: this.registerForm.username,
          password: this.registerForm.pass
        }

        register(params)
          .then((resp) => {
            console.log(
              ' params: ' +
                JSON.stringify(params) +
                'resp ==> ' +
                JSON.stringify(resp)
            )

            var data = resp.data
            var errorCode = data.errorCode
            var ua = data.universalAccount

            if (typeof resp.errorCode !== 'undefined' && resp.errorCode !== 0) {
              this.$message({
                type: 'error',
                message: JSON.stringify(resp)
              })
            } else if (typeof errorCode !== 'undefined' && errorCode === 0) {
              this.$message({
                type: 'success',
                message: JSON.stringify(ua)
              })
              // 跳转
              this.handleLogin()
            } else {
              this.$message({
                type: 'error',
                message: JSON.stringify(data)
              })
            }
          })
          .catch((error) => {
            this.$message({
              type: 'error',
              message: error.toString()
            })
          })

        return true
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

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
