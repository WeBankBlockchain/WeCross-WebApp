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
        <el-form-item label="调用方式:" prop="path">
          <el-col :offset="5">
            <el-radio-group v-model="transaction.execMethod" size="small">
              >
              <el-radio-button label="sendTransaction">发交易</el-radio-button>
              <el-radio-button label="call">查状态</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="资源路径:" prop="path">
          <slot name="path"></slot>
        </el-form-item>
        <el-form-item label="调用函数:" prop="method">
          <el-input v-model="transaction.method" placeholder="请输入调用函数"></el-input>
        </el-form-item>
        <div v-for="(arg, index) in transaction.args" :key="arg.key">
          <el-form-item
            :label="'调用参数:'"
            :prop="'args.' + index + '.value'"
            :rules="[
              {
                required: true,
                message: '参数输入不能为空，可删除该参数置空',
                trigger: 'blur',
                min: 1,
                max: 40,
              },
            ]"
          >
            <el-input v-model="arg.value" :placeholder="'请输入调用参数'+index"></el-input>
            <el-button
              @click.prevent="removeArg(arg)"
              size="small"
              style="padding: 3px 0"
              type="text"
            >删除</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-col :offset="3">
            <el-button
              type="primary"
              @click="onSubmit"
              size="small"
              v-loading.fullscreen.lock="loading"
            >执行调用</el-button>
            <el-button @click="clearForm" size="small">重置表单</el-button>
            <el-button @click="addArg" size="small">添加参数</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="调用结果:" v-if="submitResponse !== null">
          <el-input
            autosize
            type="textarea"
            readonly
            v-model="submitResponse"
            v-if="submitResponse !== null"
            style="margin-bottom: 20px; width: 75%"
          ></el-input>
        </el-form-item>
      </el-form>
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
        path: [
          {
            required: true, message: '资源路径不能为空', trigger: 'blur, change'
          },
          {
            required: true, message: '资源路径总长度不能超过40', trigger: 'blur', min: 1, max: 40
          },
          {
            pattern: /^[A-Za-z]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
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
      },
      loading: false
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
    clearForm() {
      this.$refs['transactionForm'].resetFields()
      this.submitResponse = null
      this.$emit('clearClick')
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
    width: 75%;
  }
}
</style>
