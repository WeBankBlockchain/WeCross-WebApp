<template>
  <div class="app-container">
    <el-form
      :model="registerForm"
      status-icon
      :rules="rules"
      ref="registerForm"
      label-width="100px"
      class="registerForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model.number="registerForm.username"
          style="width:20%;"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input
          type="password"
          style="width:20%;"
          v-model="registerForm.pass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          style="width:20%;"
          v-model="registerForm.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="width:20%;"
          @click="submitForm('registerForm')"
          >注册</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { register } from '@/api/user'

export default {
  data() {
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户名不能为空'))
      }
      if (value.length < 8) {
        callback(new Error('用户名长度不少于8个字符'))
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
        if (this.registerForm.checkPass !== '') {
          this.$refs.registerForm.validateField('checkPass')
        }
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
      rules: {
        pass: [{ validator: verifyPwd, trigger: 'change' }],
        checkPass: [{ validator: confirmPwd, trigger: 'change' }],
        username: [{ validator: checkUsername, trigger: 'change' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.$message({
            type: 'error',
            message: '参数校验失败，请重新输入'
          })
          return false
        }

        // register operation
        var params = {
          username: this.registerForm.username,
          password: this.registerForm.pass
        }

        register(params)
          .then((resp) => {
            console.log(' resp ==> ' + JSON.stringify(resp))

            var data = resp.data
            var errorCode = data.errorCode
            var ua = data.universalAccount

            console.log('resp = ' + JSON.stringify(resp))

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

<style scoped></style>
