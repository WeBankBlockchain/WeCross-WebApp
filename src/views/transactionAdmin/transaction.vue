<template>
  <el-card class="box-card">
    <div id="app">
      <el-col :span="12">
        <transaction-form
            :transaction="transactionForm"
            :submit-response="submitResponse"
            @clearClick="clearTransaction"
            @submitClick="send">
          <el-select
              slot="path"
              v-model="transactionForm.path"
              placeholder="请输入跨链资源路径"
              style="width: 75%"
              filterable
              default-first-option>
            <el-option
                v-for="path in paths"
                :key="path"
                :value="path"
                :label="path">
            </el-option>
          </el-select>
        </transaction-form>
      </el-col>
    </div>
  </el-card>
</template>

<script>

import { sendTransaction } from '@/api/transaction'
import { getResourceList } from '@/api/resource'
import TransactionForm from '@/views/transactionAdmin/components/TransactionForm'

export default {
  name: 'Transaction',
  components: {
    TransactionForm
  },
  props: {},
  data() {
    return {
      paths: [],
      transactionForm: {
        path: null,
        method: null,
        args: [{
          value: null,
          key: 0
        }],
        isXATransaction: false
      },
      loading: false,
      submitResponse: null
    }
  },
  created() {
    this.getPaths()
  },
  mounted() {
  },
  methods: {
    getPaths() {
      getResourceList(null, { 'version': '1', 'data': {}})
        .then(response => {
          const resourceList = response.data.resourceDetails
          for (const key in resourceList) {
            this.paths.push(resourceList[key].path)
          }
        })
    },
    clearTransaction() {
      this.transactionForm.args = [{
        value: null,
        key: 0
      }]
      this.submitResponse = null
    },
    send(transaction) {
      this.loading = true
      const args = []
      for (const arg of transaction.args) {
        args.push(arg.value)
      }
      sendTransaction({
        version: '1',
        path: transaction.path,
        data: {
          method: transaction.method,
          args: args
        }
      }).then(response => {
        if (response.errorCode !== 0 || response.data.errorCode !== 0) {
          this.submitResponse = null
          this.$message({
            message: '调用失败，错误：' + (response.data === null) ? response.message : response.data.errorMessage, type: 'error', center: true
          })
        } else {
          this.submitResponse = JSON.stringify(response, null, 4)
          this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
