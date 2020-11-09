<template>
  <div>
    <el-tree :props="props" :load="loadData" check-strictly lazy show-checkbox>
    </el-tree>
  </div>
</template>

<script>
import {
  listChains
} from '@/api/conn'
import {
  listZones
} from '@/api/conn'

export default {
  name: 'ChainExplorer',
  props: ['keyword', 'selected', 'current'],
  data: function() {
    return {
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'hasChildren'
      },
      offsets: {}
    }
  },
  methods: {
    loadData(node, resolve) {
      console.log(node)

      if (node.level === 0) {
        // query the zones
        listZones({
          offset: 0,
          size: 0
        }).then(response => {
          if (response.errorCode === 0) {
            var zones = []
            for (var zone in response.data.data) {
              zones.push({
                name: zone,
                children: [],
                hasChildren: false,
                key: zone
              })
            }

            return resolve(zones)
          } else {
            this.$message({
              type: 'error',
              message: '获取分区列表失败: ' + response.errorCode + ' 错误信息: ' + response.message
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '网络异常'
          })
        })
      }
      if (node.level === 1) {
        // first level, query the chain
        var zone = node.data.key

        // query the chains
        listChains({
          zone: zone,
          offset: 0,
          size: 0
        }).then(response => {
          if (response.errorCode === 0) {
            var chains = []
            for (var index in response.data.data) {
              var chain = response.data.data[index]
              console.log(chain)

              chains.push({
                name: chain.zone + '.' + chain.chain,
                children: [],
                hasChildren: false,
                key: chain.zone + '.' + chain.chain
              })
            }

            return resolve(chains)
          } else {
            this.$message({
              type: 'error',
              message: '获取区块链列表失败: ' + response.errorCode + ' 错误信息: ' + response.message
            })
          }
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '网络异常'
          })
        })
      } else if (node.level === 2) {
        // second level, query the resource
        // var chain = node.data.key
        // var zone = node.parent.data.key

        // query the resources
        return resolve([])
      }
    }
  }
}
</script>

<style>
</style>
