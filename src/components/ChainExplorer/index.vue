<template>
  <el-tree
    ref="tree"
    :props="props"
    :load="loadData"
    node-key="key"
    highlight-current
    lazy
    @node-click="onChainClick"
    @check-change="onChainSelect"
  />
</template>

<script>
import {
  listChains
} from '@/api/conn'
import {
  listZones
} from '@/api/conn'
import {
  uniqueObjectArray
} from '@/utils'

export default {
  name: 'ChainExplorer',
  props: {
    chain: {
      type: String,
      default: () => { return null }
    }
  },
  data: function() {
    return {
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'hasChildren'
      }
    }
  },
  watch: {
    chain: function(value) {
      this.$refs['tree'].setCurrentKey(value)
    }
  },
  methods: {
    loadData(node, resolve) {
      if (node.level === 0) {
        // query the zones
        listZones({
          offset: 0,
          size: 0
        }).then(response => {
          if (response.errorCode === 0) {
            let zones = []
            for (const zoneData of response.data.data) {
              zones.push({
                name: zoneData,
                children: [],
                hasChildren: false,
                type: 'zone',
                key: zoneData
              })
            }
            zones = uniqueObjectArray(zones)
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
            for (const chain of response.data.data) {
              chains.push({
                name: chain.chain,
                children: [],
                hasChildren: true,
                type: 'chain',
                key: chain.zone + '.' + chain.chain,
                data: chain
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
      }
    },
    onChainClick(data) {
      if (data.type === 'zone') {
        this.$emit('zone-click', data.key)
      } else if (data.type === 'chain') {
        this.$emit('chain-click', data.key, data.data)
      }
    },
    onChainSelect() {
      var selectedItems = this.$refs.tree.getCheckedNodes(false, true)

      var paths = []
      for (var selectedItem of selectedItems) {
        paths.push(selectedItem.data.key)
      }

      this.$emit('path-selected', paths)
    }
  }
}
</script>

<style>
</style>
