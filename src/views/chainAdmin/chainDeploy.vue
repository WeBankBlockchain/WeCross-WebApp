<template>
  <div class="app-container">
    <el-row style="margin-top:20px;">
      <el-card class="box-card">
        <ChainExplorer></ChainExplorer>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import ChainExplorer from '@/components/ChainExplorer'

export default {
  name: 'ChainDeploy',
  components: {
    ChainExplorer
  },
  props: {},
  data() {
    return {
      chains: []
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>
