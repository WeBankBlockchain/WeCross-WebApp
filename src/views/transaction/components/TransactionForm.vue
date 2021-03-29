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
        <el-form-item label="调用方法:" prop="method">
          <el-input v-model.trim="transaction.method" style="width: calc(100% - 63px)" placeholder="请输入调用方法" @input="onInputMethod" />
        </el-form-item>
        <div v-if="transaction.args.length > 0">
          <div v-for="(arg, index) in transaction.args" :key="arg.key">
            <el-form-item
              :label="'调用参数:'"
              :prop="'args.' + index + '.value'"
            >
              <el-input v-model="arg.value" :placeholder="'若为空则参数为空字符串'" style="width: calc(100% - 63px)">
                <template slot="prepend">{{ index }}</template>
              </el-input>
              <el-button-group>
                <el-button
                  icon="el-icon-circle-plus-outline"
                  class="hoverButton"
                  type="text"
                  @click.prevent="addArg"
                />
                <el-button
                  icon="el-icon-remove-outline"
                  class="hoverButton"
                  type="text"
                  @click.prevent="removeArg(arg)"
                />
              </el-button-group>
            </el-form-item>
          </div>
        </div>
        <div v-else>
          <el-form-item
            :label="'调用参数:'"
            :rules="[{ required: true, message: '参数输入不能为空，可删除该参数置空', trigger: 'blur'}]"
          >
            <el-button-group>
              <el-button
                icon="el-icon-circle-plus-outline"
                class="hoverButton"
                type="text"
                @click.prevent="addArg"
              />
            </el-button-group>
          </el-form-item>
        </div>
        <el-form-item style="margin-bottom: 20px">
          <el-popconfirm
            title="确定执行该调用？"
            @onConfirm="onSubmit"
          >
            <el-button
              slot="reference"
              v-loading.fullscreen.lock="loading"
              size="small"
              type="primary"
            >执行调用</el-button>
          </el-popconfirm>
          <el-button size="small" style="margin-left: 10px" @click="clearForm">重置表单</el-button>
        </el-form-item>
        <el-form-item v-if="submitResponse !== null" label="调用结果:">
          <el-input
            v-if="submitResponse !== null"
            v-model="submitResponse"
            :autosize="{minRows: 1}"
            type="textarea"
            readonly
            style="margin-bottom: 20px; width: 100%"
          />
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script>

import { handleErrorMsgBox } from '@/utils/messageBox'
import { isChainAccountFit } from '@/utils/chainAccountIntro'
import { detail } from '@/api/resource'

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
            value: '',
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
            pattern: /^((?!_)(?!-)(?!.*?_$)(?!.*?-$)[\u4e00-\u9fa5\w-]+\.){2}(?!_)(?!-)(?!.*?_$)(?!.*?-$)[\u4e00-\u9fa5\w-]+$/,
            required: true,
            message: '资源路径格式错误，应形如 \'path.to.resource\'',
            trigger: 'blur'
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
          detail(this.transaction.path).then(res => {
            if (!res) {
              this.$message.error('response 为空，请检查后台运行状态')
              return
            }
            if (res.errorCode !== 0) {
              this.$message.error(res.message)
              return
            }
            if (!res.data || !res.data.stubType) {
              this.$message.error('Resource not found')
            } else {
              isChainAccountFit(res.data.stubType, () => {
                this.$emit('submitClick', this.transaction)
              })
            }
          }).catch(err => {
            this.$message.error('网络错误：' + err)
          })
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
        handleErrorMsgBox('执行错误：', '错误码: ' + code, message, null).catch(_ => {})
      } else {
        if (!response.data.result) {
          this.submitResponse = 'response返回错误，result为空'
        }
        const res = JSON.stringify(response.data.result)
        this.submitResponse = (res === '[]') ? '调用成功，返回结果为空' : res
      }
    },
    clearForm() {
      this.$refs['transactionForm'].resetFields()
      this.submitResponse = null
      this.$emit('clearClick')
      // this.$forceUpdate()
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
.hoverButton {
  font-size: 25px;
  padding: 6px 0px;
  color: #909399;
  &:hover {
    transform: rotate(180deg);
  }
}
</style>
