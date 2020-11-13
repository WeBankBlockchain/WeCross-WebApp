<template>
  <div class="app-container">
    <el-row>
      <el-card>
        <el-button-group>
          <el-button
            icon="el-icon-d-arrow-left"
            @click="onBack"
            v-bind:disabled="history.index === 0"
            >后退</el-button
          >
          <el-button
            @click="onForward"
            v-bind:disabled="history.index + 1 >= history.list.length"
            >前进
            <i class="el-icon-d-arrow-right"></i>
          </el-button>
        </el-button-group>
        <el-button-group style="margin-left: 10px; width:40%">
          <el-input
            size="large"
            placeholder="当前路径"
            prefix-icon="el-icon-folder"
            v-model="currentChain"
            readonly
          >
          </el-input>
        </el-button-group>
        <el-button-group>
          <el-button
            icon="el-icon-search"
            @click="handleSearch"
            :disabled="currentChain === ''"
            style="margin-left: 10px"
            >查询交易</el-button
          >
        </el-button-group>
      </el-card>
    </el-row>
    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :span="4">
        <el-card header="资源选择">
          <ChainExplorer
            :chain="currentChain"
            @zone-click="onZoneClick"
            @chain-click="onChainClick"
          ></ChainExplorer>
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-card header="交易列表">
          <TransactionListExplorer
            ref="transactionList"
            :chain="currentChain"
            :pageSize="10"
          ></TransactionListExplorer>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ChainExplorer from '@/components/ChainExplorer'
import TransactionListExplorer from '@/components/TransactionListExplorer'

export default {
  name: 'Explorer',
  components: {
    ChainExplorer,
    TransactionListExplorer
  },
  /*
      beforeRouteLeave(to, from, next) {
        cached = this.$data

        next()
      },
      */
  props: {},
  data() {
    return {
      currentZone: '',
      currentChain: '',
      currentChainData: {},
      searchPath: '',
      history: {
        index: 0,
        list: []
      }
    }
  },
  mounted() {},
  methods: {
    onZoneClick(path) {
      if (this.currentZone !== path) {
        this.currentZone = path
      }
    },
    onChainClick(path, data) {
      if (this.currentChain !== path) {
        this.currentChain = path
        this.currentChainData = data
        this.currentZone = path.split('.')[0]
        this.history.list.push(path)
        this.history.index = this.history.list.length - 1
      }
    },
    onBack() {
      if (this.history.index > 0) {
        --this.history.index
        this.currentChain = this.history.list[this.history.index]
      }
    },
    onForward() {
      if (this.history.index + 1 < this.history.list.length) {
        ++this.history.index
        this.currentChain = this.history.list[this.history.index]
      }
    },
    handleSearch(path, stubType) {
      this.$refs['transactionList'].handleSearch(path, stubType)
      console.log(
        'research: ' + this.currentChain + ' ' + this.currentChainData.type
      )
    }
  }
}
</script>

<style lang="scss" scoped></style>
