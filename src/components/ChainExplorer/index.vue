<template>
  <div>
    <el-tree
:props="props"
:load="loadData"
@node-click='onChainClick'
@check-change='onChainSelect'
ref="tree"
      check-strictly
lazy
show-checkbox>
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
  props: [],
  data: function() {
    return {
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'hasChildren'
      }
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
            for (var zone in response.data.data) {
              zones.push({
                name: zone,
                children: [],
                hasChildren: false,
                type: 'zone',
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

              chains.push({
                name: chain.zone + '.' + chain.chain,
                children: [],
                hasChildren: true,
                type: 'chain',
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
      }
    },
    onChainClick(data, node, self) {
      console.log(data, node, self)
      if (data.type === 'zone') {
        this.$emit('zone-click', data.key)
      } else if (data.type === 'chain') {
        this.$emit('chain-click', data.key)
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
