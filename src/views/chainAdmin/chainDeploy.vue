<template>
  <el-container>
    <el-aside>
      <ChainExplorer @chain-click='onChainClick'></ChainExplorer>
    </el-aside>
    <el-container>
      <el-main>
        <ResourceExplorer :chain='chainPath' :pageSize=10></ResourceExplorer>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import ChainExplorer from '@/components/ChainExplorer'
import ResourceExplorer from '@/components/ResourceExplorer'

export default {
  name: 'ChainDeploy',
  components: {
    ChainExplorer,
    ResourceExplorer
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
