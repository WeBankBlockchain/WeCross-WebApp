<template>
  <div class="hello">
    <img src="@/assets/wecross.svg" width="640" alt="WeCross">
    <h1>Welcome to WeCross</h1>
    <div>
      <el-row :gutter="10">
        <el-col :span="18" :offset="3">
          WeCross是由微众银行自主研发并完全开源的区块链跨链协作平台，致力于促进跨行业、机构和地域的跨区块链信任传递和商业合作。
          WeCross不局限于满足同构区块链平行扩展后的可信数据交换需求，还进一步探索解决异构区块链之间因底层架构、
          数据结构、接口协议、安全机制等多维异构性导致无法互联互通问题的有效方案。
        </el-col>
      </el-row>
    </div>
    <div style="margin-top: 10px">
      <a href="https://wecross.readthedocs.io/zh_CN/latest" target="_blank">WeCross 在线文档</a>
    </div>
    <h2>WeCross GitHub</h2>
    <ul>
      <li><a href="https://github.com/WeBankBlockchain/WeCross" target="_blank">WeCross</a></li>
      <li><a href="https://github.com/WeBankBlockchain/WeCross-Java-SDK" target="_blank">WeCross-Java-SDK</a></li>
      <li><a href="https://github.com/WeBankBlockchain/WeCross-Console" target="_blank">WeCross-Console</a></li>
      <li><a href="https://github.com/WeBankBlockchain/WeCross-WebApp" target="_blank">WeCross-WebApp</a></li>
    </ul>
    <ul>
      <li><a href="https://github.com/WeBankBlockchain/WeCross-Fabric1-Stub" target="_blank">WeCross-Fabric1-Stub</a></li>
      <li><a href="https://github.com/WeBankBlockchain/WeCross-BCOS2-Stub" target="_blank">WeCross-BCOS2-Stub</a></li>
      <li><a href="https://github.com/WeBankBlockchain/WeCross-Account-Manager" target="_blank">WeCross-Account-Manager</a></li>
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
  line-height: initial
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
h2 {
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
  font-weight: bolder;
  color: #1d509d;
}
</style>
