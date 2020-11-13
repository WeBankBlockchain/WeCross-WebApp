<template>
  <div class="hello">
    <img :src="require('@/assets/wecross.svg')" width="720">
    <h1>Welcome to WeCross</h1>
    <network
    ref="network"
    :nodes="nodes"
    :edges="edges"
    :options="options"
    >
    </network>
    <p>
      WeCross是由微众银行自主研发并完全开源的区块链跨链协作平台，致力于促进跨行业、机构和地域的跨区块链信任传递和商业合作。<br>
      WeCross不局限于满足同构区块链平行扩展后的可信数据交换需求，还进一步探索解决异构区块链之间因底层架构、<br>
      数据结构、接口协议、安全机制等多维异构性导致无法互联互通问题的有效方案。<br>
      <a href="https://wecross.readthedocs.io/zh_CN/latest" target="_blank" rel="noopener">WeCross 在线文档</a>.
    </p>
    <h3>WeCross GitHub</h3>
    <ul>
      <li><a href="https://github.com/WeBankFinTech/WeCross" target="_blank" rel="noopener">WeCross</a></li>
      <li><a href="https://github.com/WeBankFinTech/WeCross-Java-SDK" target="_blank" rel="noopener">WeCross-Java-SDK</a></li>
      <li><a href="https://github.com/WeBankFinTech/WeCross-Console" target="_blank" rel="noopener">WeCross-Console</a></li>
      <li><a href="https://github.com/WeBankFinTech/WeCross-Fabric1-Stub" target="_blank" rel="noopener">WeCross-Fabric1-Stub</a></li>
      <li><a href="https://github.com/WeBankFinTech/WeCross-BCOS2-Stub" target="_blank" rel="noopener">WeCross-BCOS2-Stub</a></li>
      <li><a href="https://github.com/WeBankFinTech/WeCross-Account-Manager" target="_blank" rel="noopener">WeCross-Account-Manager</a></li>
    </ul>
  </div>
</template>

<script>
import { Network } from 'vue-vis-network'

export default {
  name: 'DocumentView',
  props: {},
  data() {
    return { nodes: [
      { id: 1, group: 'chainGroup', label: 'FISCO-BCOS' },
      { id: 2, group: 'chainGroup', label: 'Hyperledger Fabric' },
      { id: 3, group: 'routerGroup', label: 'router 8250' },
      { id: 4, group: 'routerGroup', label: 'router 8251' },
      { id: 5, group: 'appGroup', label: 'console' },
      { id: 6, group: 'resourceGroup', label: 'payment.bcos.HelloWorld' },
      { id: 7, group: 'resourceGroup', label: 'payment.bcos.WeCrossHub' },
      { id: 8, group: 'resourceGroup', label: 'payment.fabric.sacc' },
      { id: 9, group: 'resourceGroup', label: 'payment.fabric.WeCrossHub' }
    ],
    edges: [
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
      { from: 5, to: 3 },
      { from: 6, to: 1 },
      { from: 7, to: 1 },
      { from: 8, to: 2 },
      { from: 9, to: 2 }
    ],
    options: {
      autoResize: true,
      height: '500px',
      width: '100%',
      nodes: {
        borderWidth: 4
      },
      edges: {
        color: 'lightgray'
      },
      groups: {
        useDefaultGroups: true,
        resourceGroup: { color: { background: 'white' }, borderWidth: 1, level: 1, shape: 'ellipse' },
        chainGroup: { color: { background: 'green' }, level: 2, shape: 'image', image: require('@/assets/chain.png') },
        routerGroup: { color: { background: 'blue' }, level: 3, shape: 'image', image: require('@/assets/router.png') },
        appGroup: { color: { background: 'red' }, level: 4, shape: 'image', image: require('@/assets/app.png') }

      },
      layout: {
        randomSeed: undefined,
        improvedLayout: true,
        clusterThreshold: 150,
        hierarchical: {
          enabled: true,
          levelSeparation: 150,
          nodeSpacing: 200,
          treeSpacing: 200,
          blockShifting: true,
          edgeMinimization: true,
          parentCentralization: true,
          direction: 'UD',        // UD, DU, LR, RL
          sortMethod: 'hubsize'  // hubsize, directed
          // shakeTowards: 'leaves'  // roots, leaves
        }
      }
    }}
  },
  created() {},
  mounted() {

  },
  methods: {

  },
  components: {
    Network
  }

}

</script>

<style lang="scss" scoped>
.hello {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
img{
	max-width:100%;
	margin:20px auto;
	height:auto;
	border:0;
	outline:0;
  /*set the images aligned*/
  display: block;
  margin-left: auto;
  margin-right: auto;
	}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
