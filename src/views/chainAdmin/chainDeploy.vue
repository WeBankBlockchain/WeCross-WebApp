<template>
  <div class="app-container">
    <el-row style="margin-top:20px;">
      <el-card class="box-card">
        <Explorer></Explorer>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import Explorer from '@/components/Explorer'

export default {
  name: 'ChainDeploy',
  components: {
    Explorer
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
