<template>
  <el-tree
      :props="props"
      :load="loadData"
      @node-click='onChainClick'
      @check-change='onChainSelect'
      node-key="key"
      ref="tree"
      highlight-current
      lazy>
  </el-tree>
</template>

<script>
import {
  listChains
} from '@/api/conn'
import {
  listZones
} from '@/api/conn'
import { uniqueObjectArray } from '@/utils'

export default {
  name: 'ChainExplorer',
  props: ['chain'],
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
            var zones = []
            for (var index in response.data.data) {
              var zone = response.data.data[index]
              zones.push({
                name: zone,
                children: [],
                hasChildren: false,
                type: 'zone',
                key: zone
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
            for (var index in response.data.data) {
              var chain = response.data.data[index]

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
    onChainClick(data, node, self) {
      if (data.type === 'zone') {
        this.$emit('zone-click', data.key)
      } else if (data.type === 'chain') {
        this.$emit('chain-click', data.key, data.data)
      }
    },
    onChainSelect(data, isChecked, isChildrenChecked) {
      var selectedItems = this.$refs.tree.getCheckedNodes(false, true)

      var paths = []
      for (var selectedItem in selectedItems) {
        paths.push(selectedItem.data.key)
      }

      this.$emit('path-selected', paths)
    }
  }
}
</script>

<style>
</style>
