<template>
  <div class="app-container">
    <el-row :gutter="30">
      <el-col :span="5">
        <ChainExplorer @chain-click='onChainClick'></ChainExplorer>
      </el-col>
      <el-col :span="18">
        <el-tabs>
          <el-tab-pane label="资源" name="first">
            <ResourceExplorer :chain='chainPath' :pageSize=10></ResourceExplorer>
          </el-tab-pane>
          <el-tab-pane label="交易" name="second">
            <TransactionExplorer :chain='chainPath' :pageSize=10></TransactionExplorer>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ChainExplorer from '@/components/ChainExplorer'
import ResourceExplorer from '@/components/ResourceExplorer'
import TransactionExplorer from '@/components/TransactionExplorer'

export default {
  name: 'ChainDeploy',
  components: {
    ChainExplorer,
    ResourceExplorer,
    TransactionExplorer
  },
  props: {},
  data() {
    return {
      chainPath: ''
    }
  },
  created() {},
  mounted() {},
  methods: {
    onChainClick(path) {
      this.chainPath = path
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
