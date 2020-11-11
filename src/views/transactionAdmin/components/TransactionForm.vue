<template>
  <div>
    <el-row>
      <el-form
          ref="transactionForm"
          label-width="auto"
          label-position="right"
          :model="transaction"
          :rules="transactionRules"
          class="dynamicForm">
        <el-form-item label="执行方式：" prop="execMethod">
          <el-select style="width: 75%" placeholder="请选择执行方式" v-model="transaction.execMethod">
            <el-option label="SendTransaction" value="sendTransaction">
              <span style="float: left">SendTransaction</span>
              <span style="float: right; color: #8492a6; font-size: 13px">发送交易</span>
            </el-option>
            <el-option label="Call" value="call">
              <span style="float: left">Call</span>
              <span style="float: right; color: #8492a6; font-size: 13px">调用方法</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源路径：" prop="path">
          <slot name="path"></slot>
        </el-form-item>
        <el-form-item label="调用方法：" prop="method">
          <el-input v-model="transaction.method" placeholder="请输入调用方法"></el-input>
        </el-form-item>
        <div
            v-for="(arg, index) in transaction.args"
            :key="arg.key">
          <el-form-item
              :label="'调用参数' + (index+1) + ':'"
              :prop="'args.'+index+'.value'"
              :rules="[{ required: true, message: '参数输入不能为空，可删除该参数置空', trigger: 'blur', min: 1, max: 40 }]">
            <el-input v-model="arg.value" placeholder="请输入调用参数"></el-input>
            <el-button @click.prevent="removeArg(arg)" size="small" style="padding: 3px 0" type="text">删除</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button-group >
          <el-button type="primary" @click="onSubmit" size="small">执行调用</el-button>
            <el-button @click="clearForm" size="small">重置表单</el-button>
            <el-button @click="addArg" size="small">添加参数</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-collapse-transition>
        <el-input
            autosize
            type="textarea"
            readonly
            v-model="submitResponse"
            v-if="submitResponse !== null"
            style="margin-bottom: 20px;width: 90%">
        </el-input>
      </el-collapse-transition>
    </el-row>
  </div>
</template>

<script>
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
    },
    submitResponse: null
  },
  data() {
    return {
      transactionRules: {
        execMethod: [
          {
            required: true, message: '执行方式不能为空', trigger: 'change'
          }
        ],
        path: [
          {
            required: true, message: '资源路径不能为空', trigger: 'change'
          },
          {
            required: true, message: '资源路径总长度不能超过40', trigger: 'blur', min: 1, max: 40
          },
          {
            pattern: /^[A-Za-z]+\.[A-Za-z_-]+\.[A-Za-z0-9_-]+$/,
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
            required: true, message: '调用方法总长度不能超过40', trigger: 'blur', min: 1, max: 40
          },
          {
            pattern: /^[A-Za-z0-9_]+$/,
            required: true,
            message: '调用方法格式错误, 不支持特殊符号',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    addArg() {
      this.transaction.args.push({
        value: '',
        key: Date.now()
      })
    },
    removeArg(item) {
      const index = this.transaction.args.indexOf(item)
      if (index !== -1) {
        this.transaction.args.splice(index, 1)
      }
    },
    onSubmit() {
      this.$refs['transactionForm'].validate((validate) => {
        if (validate) {
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
          this.$message({
            message: '请检查所有输入',
            type: 'warning'
          })
        }
      })
    },
    clearForm() {
      this.$refs['transactionForm'].resetFields()
      this.submitResponse = null
      this.$emit('clearClick')
    }
  }
}
</script>

<style lang="scss" scoped>
.dynamicForm {
  .el-input {
    margin-right: 10px;
    width: 75%;
  }
}
</style>
