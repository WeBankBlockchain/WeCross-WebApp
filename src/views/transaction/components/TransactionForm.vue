<template>
  <div>
    <el-row>
      <el-form
        ref="transactionForm"
        label-width="auto"
        label-position="right"
        :model="transaction"
        :rules="transactionRules"
        class="dynamicForm"
      >
        <el-form-item label="调用方式:">
          <el-col>
            <el-radio-group v-model="transaction.execMethod" size="small" @change="onExecMethodChange">
              <el-radio label="sendTransaction">发交易</el-radio>
              <el-radio label="call">查状态</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="资源路径:" prop="path">
          <slot name="path" />
        </el-form-item>
        <el-form-item label="调用函数:" prop="method">
          <el-input v-model.trim="transaction.method" placeholder="请输入调用函数" @input="onInputMethod" />
        </el-form-item>
        <div v-for="(arg, index) in transaction.args" :key="arg.key">
          <el-form-item
            :label="'调用参数:'"
            :prop="'args.' + index + '.value'"
            :rules="[{ required: true, message: '参数输入不能为空，可删除该参数置空', trigger: 'blur'}]"
          >
            <el-input v-model="arg.value" :placeholder="'请输入调用参数'+index">
              <el-button slot="append" icon="el-icon-delete" @click.prevent="removeArg(arg)">删除</el-button>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item style="margin-bottom: 20px">
          <el-button
            v-loading.fullscreen.lock="loading"
            size="small"
            type="primary"
            @click="onSubmit"
          >执行调用</el-button>
          <el-button size="small" @click="clearForm">重置表单</el-button>
          <el-button size="small" @click="addArg">添加参数</el-button>
        </el-form-item>
        <el-form-item v-if="submitResponse !== null" label="调用结果:">
          <el-input
            v-if="submitResponse !== null"
            v-model="submitResponse"
            autosize
            type="textarea"
            readonly
            style="margin-bottom: 20px; width: 75%"
          />
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>

import { handleErrorMsgBox } from '@/utils/messageBox'

export default {
  name: 'TransactionForm',
  props: {
    transaction: {
      type: Object,
      default: () => {
        return {
          transactionID: null,
          path: null,
          method: null,
          args: [{
            value: null,
            key: 0
          }],
          execMethod: null,
          isXATransaction: false
        }
      }
    }
  },
  data() {
    return {
      transactionRules: {
        path: [
          {
            required: true, message: '资源路径不能为空', trigger: 'blur'
          },
          {
            required: true, message: '资源路径总长度不能超过128', trigger: 'blur', max: 128
          },
          {
            pattern: /^((?!_)(?!-)(?!.*?_$)(?!.*?-$)[\u4e00-\u9fa5\w-]+\.){2}(?!_)(?!-)(?!.*?_$)(?!.*?-$)[\u4e00-\u9fa5\w-]+$/,
            required: true,
            message: '资源路径格式错误，应形如 \'path.to.resource\'',
            trigger: 'change'
          }
        ],
        method: [
          {
            required: true, message: '调用方法不能为空', trigger: 'blur'
          },
          {
            required: true, message: '调用方法总长度不能超过128', trigger: 'blur', max: 128
          },
          {
            pattern: /^(?!_)(?!-)(?!.*?_$)(?!.*?-$)[\u4e00-\u9fa5\w-]+$/,
            required: true,
            message: '调用方法格式错误, 不支持特殊符号',
            trigger: 'blur'
          }
        ]
      },
      submitResponse: null,
      loading: false
    }
  },
  methods: {
    onInputMethod() {
      this.submitResponse = null
    },
    onExecMethodChange() {
      console.log('method:', this.transaction.execMethod)
      const tempPath = this.transaction.path
      this.clearForm()
      this.transaction.path = tempPath
      this.$forceUpdate()
    },
    addArg() {
      this.submitResponse = null
      this.transaction.args.push({
        value: '',
        key: Date.now()
      })
    },
    removeArg(item) {
      this.submitResponse = null
      const index = this.transaction.args.indexOf(item)
      if (index !== -1) {
        this.transaction.args.splice(index, 1)
      }
    },
    onSubmit() {
      this.submitResponse = null
      this.$refs['transactionForm'].validate((validate) => {
        if (validate) {
          if (this.transaction.execMethod === 'sendTransaction') {
            this.$confirm(`确定执行该调用？`, '确认信息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.$emit('submitClick', this.transaction)
            }).catch(_ => {
              this.$message({
                message: '已取消执行',
                type: 'info'
              })
            })
          } else {
            this.$emit('submitClick', this.transaction)
          }
        } else {
          this.$message({
            message: '请检查所有输入',
            type: 'warning'
          })
        }
      })
    },
    onResponse(response) {
      if (response.errorCode !== 0 || response.data.errorCode !== 0) {
        this.submitResponse = null
        let code, message
        if (response.errorCode !== 0) {
          code = response.errorCode
          message = response.message
        } else {
          code = response.data.errorCode
          message = response.data.message
        }
        handleErrorMsgBox('执行错误：', '错误码: ' + code, message)
      } else {
        this.submitResponse = JSON.stringify(response.data.result)
      }
    },
    clearForm() {
      this.$refs['transactionForm'].resetFields()
      this.submitResponse = null
      this.$emit('clearClick')
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
body {
  margin: 0;
}
.dynamicForm {
  .el-input {
    margin-right: 10px;
    width: 100%;
  }
}
</style>
