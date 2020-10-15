<template>
  <div class="hello">
    <img src="../../assets/logo_wecross.svg" width="720">
    <h1>Welcome to WeCross</h1>
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
export default {
  name: 'DocumentView',
  props: {},
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {}
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
