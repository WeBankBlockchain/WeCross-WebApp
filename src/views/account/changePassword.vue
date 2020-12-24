<template>
  <div class="app-container">
    <el-card>
      <template slot="header">
        <el-page-header
          title="账户管理"
          @back="() => { this.$router.push({ path: '/account/index' }) }"
        >
          <span slot="content" style="font-size: 16px">设置新的密码</span>
        </el-page-header>
      </template>
      <el-row :gutter="10">
        <el-col :span="10" :offset="7">
          <el-form
            ref="changePasswordForm"
            :model="changePasswordForm"
            :rules="changePasswordRules"
          >
            <el-form-item prop="oldPassword">
              <el-input
                ref="oldPassword"
                v-model="changePasswordForm.oldPassword"
                placeholder="旧密码"
                :type="passwordType"
                name="oldPassword"
                tabindex="1"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon
                  :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                />
              </span>
            </el-form-item>
            <el-tooltip placement="right">
              <div slot="content">
                密码长度6~18个字符，支持数字、大小写字母、特殊字符~!@#$%^&*()，至少包含一个数字和字母
              </div>
              <el-form-item prop="newPassword">
                <el-input
                  :key="passwordType"
                  ref="newPassword"
                  v-model="changePasswordForm.newPassword"
                  :type="passwordType"
                  placeholder="新密码"
                  name="newPassword"
                  tabindex="2"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon
                    :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                  />
                </span>
              </el-form-item>
            </el-tooltip>
            <el-tooltip placement="right">
              <div slot="content">
                密码长度6~18个字符，支持数字、大小写字母、特殊字符~!@#$%^&*()，至少包含一个数字和字母
              </div>
              <el-form-item prop="confirmPassword">
                <el-input
                  :key="passwordType"
                  v-model="changePasswordForm.confirmPassword"
                  :type="passwordType"
                  placeholder="确认新密码"
                  name="confirmPassword"
                  tabindex="3"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon
                    :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                  />
                </span>
              </el-form-item>
            </el-tooltip>
            <el-row :gutter="10">
              <el-col :span="18">
                <el-form-item prop="authCode">
                  <el-input
                    v-model="changePasswordForm.authCode"
                    placeholder="验证码"
                    name="imageAuthCode"
                    tabindex="4"
                  />
                </el-form-item>
              </el-col>
              <el-col style="float:right;" :span="3">
                <div
                  style="margin-top:2px;width:104px;height:40px;text-align:center;background:white;float:right"
                >
                  <i
                    v-if="imageAuthCode.imageAuthCodeBase64URL === ''"
                    style="margin-top:12%;"
                    class="el-icon-loading"
                  />
                  <img
                    v-else
                    style="width:100%; height:auto;vertical-align: middle;"
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
              style="width:100%;margin-bottom:30px;"
              @click="handleChangePassword('changePasswordForm')"
            >确认</el-button>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { validPassword } from '@/utils/validate'
import { queryAuthCode } from '@/utils/authcode'
import { rsa_encode } from '@/utils/rsa'
import { queryPub } from '@/utils/authcode'
import { confusePassword } from '@/utils/validate'
import { getPubKey } from '@/utils/auth'
import { changePassword } from '@/api/user'
import { ErrorCode } from '@/utils/errorcode'
import { getUsername } from '@/utils/auth'

export default {
  name: 'ChangePassword',

  data() {
    const verifyOldPwd = (rule, value, callback) => {
      if (typeof value === 'undefined' || value === null || value === '') {
        callback(new Error('请输入旧密码'))
        return
      }
      callback()
    }

    const verifyPwd = (rule, value, callback) => {
      if (typeof value === 'undefined' || value === null || value === '') {
        callback(new Error('请输入新密码'))
        return
      }
      if (!validPassword(value)) {
        callback(
          new Error(
            '密码长度6~18个字符，支持数字、大小写字母、特殊字符~!@#$%^&*()，至少包含一个数字和一个字母'
          )
        )
      } else {
        callback()
      }
    }

    const confirmPwd = (rule, value, callback) => {
      if (typeof value === 'undefined' || value === null || value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.changePasswordForm.newPassword) {
        callback(new Error('两次新密码不一致!'))
      } else {
        callback()
      }
    }

    const confirmAuthCode = (rule, value, callback) => {
      if (
        typeof value === 'undefined' ||
        value === null ||
        value.length !== 4
      ) {
        callback(new Error('请输入验证码'))
      } else {
        callback()
      }
    }

    return {
      changePasswordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        authCode: ''
      },
      imageAuthCode: {
        imageAuthCodeBase64URL: '',
        randomToken: ''
      },
      changePasswordRules: {
        oldPassword: [
          { required: true, validator: verifyOldPwd, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: verifyPwd, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: confirmPwd, trigger: 'blur' }
        ],
        authCode: [
          { required: true, validator: confirmAuthCode, trigger: 'blur' }
        ]
      },
      passwordType: 'password'
    }
  },
  created() {
    this.reset()
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
  methods: {
    reset() {
      this.changePasswordForm.newPassword = ''
      this.changePasswordForm.oldPassword = ''
      this.changePasswordForm.confirmPassword = ''
      this.changePasswordForm.authCode = ''
    },

    handleChangePassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message({
            type: 'error',
            message: '输入参数无效，请重新输入'
          })
          return false
        }

        var username = getUsername()

        const params = {
          username: username,
          oldPassword: confusePassword(this.changePasswordForm.oldPassword),
          newPassword: confusePassword(this.changePasswordForm.newPassword),
          randomToken: this.imageAuthCode.randomToken,
          authCode: this.changePasswordForm.authCode
        }

        // this.reset();

        console.log('params' + JSON.stringify(params))

        // rsa encode parameters
        const pub = getPubKey()
        var encoded = rsa_encode(JSON.stringify(params), pub)

        changePassword(encoded)
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
                message: '密码修改成功!'
              })
              // 退出？？？
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
              errorCode === ErrorCode.AccountOrPasswordIncorrect
            ) {
              this.$message({
                type: 'error',
                message: '账户或者密码错误'
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
    },
    handleUpdateAuthCode() {
      const callback = (resp) => {
        this.imageAuthCode.randomToken = resp.randomToken
        this.imageAuthCode.imageAuthCodeBase64URL = `data:image/png;base64,${resp.imageBase64}`
      }

      queryAuthCode(callback)
    },
    showPwd() {
      this.passwordType = this.passwordType === 'password' ? '' : 'password'
    }
  }
}
</script>

<style lang="scss" scoped>
.show-pwd {
  position: absolute;
  right: 10px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}
</style>
