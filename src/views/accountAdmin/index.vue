<template>
  <transition name="el-fade-in-linear">
    <div v-show="show" class="transition-box">
      <el-card class="box-card">
        <el-form label-position="left" size="small" label-width="80px">
          <el-form-item label="跨链账户">
            <el-tag v-bind:type="ua.admin ? 'warning': 'success'" ><span>{{ ua.username }}</span></el-tag>
            <el-button style="float: right" type="primary" @click="addChainAccountDrawer.show=true">添加链账户</el-button>
          </el-form-item>
          <el-form-item label="UA公钥">
            <el-input type="textarea" readonly autosize resize="none" v-model="ua.pubKey"></el-input>
          </el-form-item>
        </el-form>
        <el-table
          :data="chainAccountTable"
          style="width: 100%"
          row-key="id"
          lazy
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @row-click="showChainAccount"
        >
          <el-table-column prop="type" label="链账户类型" width="180">
          </el-table-column>
          <el-table-column prop="keyID" label="KeyID" width="180">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" content="点击查看详情" placement="top">
              <div>{{ scope.row.keyID }}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="details" label="摘要" @click="showChainAccount(scope.row)">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="light" content="点击查看详情" placement="top">
              <div>{{ scope.row.details }}</div>
              </el-tooltip>
            </template>

          </el-table-column>
          <el-table-column width="120">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.isDefault"
                style="float: right"
              >
                默认账户
              </el-button>
              <el-button
                v-else
                @click.stop="querySetDefaultAccountByColum(scope.row)"
                type="primary"
                style="float: right"
              >
                设为默认
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-drawer
        :visible.sync="chainAccountDrawer.show"
        :direction="chainAccountDrawer.direction"
        :with-header="false"
        size="680px"
      >
        <el-card class="box-card" style="height:100%">
          <div slot="header" class="clearfix">
            <span> 链账户 </span>
            <el-button
              v-if="!chainAccountDrawer.info.isDefault"
              @click="querySetDefaultAccount()"
              style="float: right"
              type="primary"
              >设为默认账户</el-button
            >
          </div>
          <el-form label-position="top" size="small" label-width="80px">
            <el-form-item label="KeyID">
              <span>{{ chainAccountDrawer.info.keyID }}</span>
            </el-form-item>
            <el-form-item label="链账户类型">
              <span>{{ chainAccountDrawer.info.type }}</span>
            </el-form-item>
            <el-form-item label="Identity">
              <el-input type="textarea" readonly autosize resize="none" v-model=" chainAccountDrawer.info.identity"></el-input>
            </el-form-item>
            <el-form-item label="公钥">
              <el-input type="textarea" readonly autosize resize="none" v-model=" chainAccountDrawer.info.pubKey"></el-input>
            </el-form-item>
            <el-form-item label="私钥">
              <el-button size="mini" class="primary" @click="chainAccountDrawer.showSec = !chainAccountDrawer.showSec" >查看 <i class="el-icon-chat-line-round"></i> </el-button>
              <el-input v-if="chainAccountDrawer.showSec && chainAccountDrawer.show" type="textarea" readonly autosize show-password resize="none" v-model=" chainAccountDrawer.info.secKey"></el-input>
            </el-form-item>
            <el-form-item label="其它">
              <span>{{ chainAccountDrawer.info.ext }}</span>
            </el-form-item>
          </el-form>
        </el-card>
      </el-drawer>
      <el-drawer
          :visible.sync="addChainAccountDrawer.show"
          :direction="addChainAccountDrawer.direction"
          :with-header="false"
          size="670px"
      >
        <el-card class="box-card"  style="height:100%">
            <div slot="header" class="clearfix">
              <span> 添加链账户 </span>
            </div>
          <el-form label-position="top" size="small"  ref="form" :model="addChainAccountDrawer" >
            <el-form-item label="链账户类型">
              <el-select
                v-model="addChainAccountDrawer.params.type"
                placeholder="请选择"
                @change="addChainAccountDrawer.params.pubKey = undefined; addChainAccountDrawer.params.secKey = undefined; addChainAccountDrawer.params.ext = undefined; addChainAccountDrawer.params.isDefault = false "
              >
                <el-option label="FISCO BCOS 2.0" value="BCOS2.0"></el-option>
                <el-option label="FISCO BCOS 2.0 国密" value="GM_BCOS2.0"></el-option>
                <el-option label="HyperLedger Fabric 1.4" value="Fabric1.4"></el-option>
              </el-select>
            </el-form-item>

            <div v-if="addChainAccountDrawer.params.type == 'BCOS2.0'">
              <el-form-item label="私钥" >
                <el-upload
                    class="upload-demo"
                    action=""
                    accept=".pem"
                    :show-file-list="false"
                    :file-list="pubKeyFileList"
                    :http-request="uploadECDSAPemSecKeyHandler"
                    :auto-upload="true">
                    <el-button-group  slot="trigger" >
                    <el-button  type="primary">上传</el-button>
                    <el-button
                    @click.stop="generateECDSAKeyPairPem()"
                    size="small"
                    type="primary">生成</el-button>
                    </el-button-group>
                  </el-upload>

                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  autosize
                  v-model="addChainAccountDrawer.params.secKey">
                </el-input>
              </el-form-item>

              <el-form-item label="公钥">
                <el-input
                  readonly
                  type="textarea"
                  :rows="2"
                  placeholder=""
                  autosize
                  v-model="addChainAccountDrawer.params.pubKey">
                </el-input>
              </el-form-item>

              <el-form-item label="address">
                <el-input
                  readonly
                  placeholder=""
                  v-model="addChainAccountDrawer.params.ext"
                  clearable>
                </el-input>
              </el-form-item>

            </div>

            <div  v-if="addChainAccountDrawer.params.type == 'GM_BCOS2.0'">

              <el-form-item label="私钥" >
                  <el-upload
                    class="upload-demo"
                    action=""
                    accept=".pem"
                    :show-file-list="false"
                    :file-list="pubKeyFileList"
                    :http-request="uploadSM2PemSecKeyHandler"
                    :auto-upload="true">
                    <el-button-group slot="trigger">
                      <el-button  type="primary">上传</el-button>
                      <el-button
                      size="small"
                      @click.stop="generateSM2KeyPairPem()"
                      type="primary">生成</el-button>
                    </el-button-group>
                  </el-upload>
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  autosize
                  v-model="addChainAccountDrawer.params.secKey">
                </el-input>
              </el-form-item>

              <el-form-item label="公钥">
                <el-input
                  readonly
                  type="textarea"
                  :rows="2"
                  placeholder=""
                  autosize
                  v-model="addChainAccountDrawer.params.pubKey">
                </el-input>
              </el-form-item>

              <el-form-item label="address">
                <el-input
                  readonly
                  placeholder=""
                  v-model="addChainAccountDrawer.params.ext"
                  clearable>
                </el-input>
              </el-form-item>
            </div>

            <div v-if="addChainAccountDrawer.params.type == 'Fabric1.4'">
              <el-form-item label="私钥"  v-if="addChainAccountDrawer.params.type">
                <el-upload
                  class="upload-demo"
                  action=""
                  accept=".pem"
                  :show-file-list="false"
                  :file-list="pubKeyFileList"
                  :http-request="uploadSecKeyHandler"
                  :auto-upload="true">
                  <el-button slot="trigger" type="primary">上传</el-button>
                </el-upload>
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  autosize
                  v-model="addChainAccountDrawer.params.secKey">
                </el-input>
              </el-form-item>

              <el-form-item label="公钥" v-if="addChainAccountDrawer.params.type">
                <el-upload
                  class="upload-demo"
                  action=""
                  accept=".pem"
                  :show-file-list="false"
                  :file-list="pubKeyFileList"
                  :http-request="uploadPubKeyHandler"
                  :auto-upload="true">
                  <el-button slot="trigger" type="primary">上传</el-button>
                </el-upload>
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入"
                  autosize
                  v-model="addChainAccountDrawer.params.pubKey">
                </el-input>
              </el-form-item>

              <el-form-item v-if="addChainAccountDrawer.params.type=='Fabric1.4'" label="MSPID">
                <el-input
                  placeholder="请输入"
                  v-model="addChainAccountDrawer.params.ext"
                  clearable>
                </el-input>
              </el-form-item>

            </div>

            <el-form-item label="设为默认账户"   v-if="addChainAccountDrawer.params.type">
                <el-switch v-model="addChainAccountDrawer.params.isDefault"></el-switch>
            </el-form-item>
          </el-form>
          <div class="clearfix"   v-if="addChainAccountDrawer.params.type">
              <el-button
                @click="queryAddChainAccount()"
                style="float: right"
                type="primary"
                >确认</el-button
              >
          </div>
        </el-card>
      </el-drawer>
    </div>
  </transition>
</template>
<script>
import { MessageBox } from 'element-ui'
import store from '@/store'
import { listAccount } from '@/api/ua.js'
import { setDefaultAccount } from '@/api/ua.js'
import { addChainAccount } from '@/api/ua.js'
import { ec as EC } from 'elliptic'
import { keccak256 } from 'js-sha3'
import { sm2 } from 'sm-crypto'
import { sm3Hex } from '@/utils/sm3.js'

export default {
  name: 'AccountAdmin',
  props: {},
  data() {
    return {
      ua: {
        uaID: null,
        pubKey: null,
        username: null,
        admin: true,
        chainAccounts: [
          {
            keyID: 0,
            type: null,
            identity: null,
            isDefault: null,
            pubKey: null,
            secKey: null,
            ext: null
          },
          {
            keyID: 1,
            type: null,
            identity: null,
            isDefault: null,
            pubKey: null,
            secKey: null,
            ext: null
          }
        ]
      },
      chainAccountTable: [],
      chainAccountDrawer: {
        show: false,
        showSec: false,
        direction: 'rtl',
        header: '',
        info: {}
      },
      addChainAccountDrawer: {
        show: false,
        direction: 'rtl',
        params: {
          type: '',
          pubKey: '',
          secKey: '',
          ext: '',
          isDefault: false
        }
      },
      fullscreenLoading: false,
      show: true,
      pubKeyFileList: [],
      privateKeyFileList: []
    }
  },
  methods: {
    getUA() {
      this.show = false
      return listAccount().then((response) => {
        this.ua = response.data
        this.chainAccountTable = buildChainAccountTable(this.ua)
        this.show = true
      })
    },
    showChainAccount(chainAccount) {
      console.log(chainAccount)
      this.chainAccountDrawer.header = chainAccount.details
      this.chainAccountDrawer.info = chainAccount
      this.chainAccountDrawer.show = true
      this.chainAccountDrawer.showSec = false
    },
    querySetDefaultAccount() {
      MessageBox.confirm('设置成功后，需重新登录', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var loadingText = 'Loading'
        const loading = this.$loading({
          lock: true,
          text: loadingText
        })

        this.chainAccountDrawer.show = false
        setDefaultAccount({
          version: '1',
          data: {
            type: this.chainAccountDrawer.info.type,
            keyID: this.chainAccountDrawer.info.keyID
          }
        }).then((response) => {
          this.handleResponse(response)
          this.getUA().then(() => {
            loading.close()
          })
        })
      })
    },
    querySetDefaultAccountByColum(chainAccount) {
      this.chainAccountDrawer.header = chainAccount.details
      this.chainAccountDrawer.info = chainAccount

      this.querySetDefaultAccount()
    },
    queryAddChainAccount() {
      MessageBox.confirm('设置成功后，需重新登录', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var loadingText = 'Loading'
        const loading = this.$loading({
          lock: true,
          text: loadingText
        })

        this.addChainAccountDrawer.show = false
        addChainAccount({
          version: '1',
          data: this.addChainAccountDrawer.params
        }).then((response) => {
          this.handleResponse(response)
          this.getUA().then(() => {
            loading.close()
          })
        })
      })
    },
    handleResponse(response) {
      console.log('Response' + response)
      if (response.errorCode !== 0) {
        this.$message({
          message: '设置失败：' + response.message,
          type: 'error'
        })
      } else if (response.data.errorCode !== 0) {
        this.$message({
          message: '设置失败：' + response.data.message,
          type: 'error'
        })
      } else {
        this.$message({
          message: '设置成功，需重新登录',
          type: 'success'
        })

        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
    },
    uploadPubKeyHandler(params) {
      console.log('uploadPubKeyHandler')
      var reader = new FileReader()
      reader.onload = (event) => {
        var key = event.target.result
        if (!checkPubKeyFormat(key)) {
          return
        }

        this.addChainAccountDrawer.params.pubKey = key
      }
      reader.readAsText(params.file)
    },
    uploadSecKeyHandler(params) {
      var reader = new FileReader()
      reader.onload = (event) => {
        var key = event.target.result
        if (!checkSecKeyFormat(key)) {
          return
        }
        this.addChainAccountDrawer.params.secKey = key
      }
      reader.readAsText(params.file)
    },
    uploadECDSAPemSecKeyHandler(params) {
      var reader = new FileReader()
      reader.onload = (event) => {
        var key = event.target.result
        if (!checkSecKeyFormat(key) || !isECDSASecPem(key)) {
          return
        }
        this.addChainAccountDrawer.params.secKey = key

        var pubKeyHex = getPubKeyHexFromECDSASecPem(key)
        this.addChainAccountDrawer.params.pubKey = buildECDSAPubKeyPem(pubKeyHex)

        var address = ecdsaPub2Addr(pubKeyHex)
        this.addChainAccountDrawer.params.ext = address
      }
      reader.readAsText(params.file)
    },
    uploadSM2PemSecKeyHandler(params) {
      var reader = new FileReader()
      reader.onload = (event) => {
        var key = event.target.result
        if (!checkSecKeyFormat(key) || !isSM2SecPem(key)) {
          return
        }

        this.addChainAccountDrawer.params.secKey = key

        var pubKeyHex = getPubKeyHexFromSM2SecPem(key)
        this.addChainAccountDrawer.params.pubKey = buildSM2PubKeyPem(pubKeyHex)

        var address = sm2Pub2Addr(pubKeyHex)
        this.addChainAccountDrawer.params.ext = address
      }
      reader.readAsText(params.file)
    },

    generateECDSAKeyPairPem() {
      const secp256k1 = new EC('secp256k1')
      var keyPair = secp256k1.genKeyPair()

      var pubKey = keyPair.getPublic('hex')
      var secKey = keyPair.getPrivate('hex')

      console.log(pubKey)
      console.log(secKey)

      var pubContent = buildECDSAPubKeyPem(pubKey)
      var secContext = buildECDSASecKeyPem(pubKey, secKey)

      console.log(pubContent)
      console.log(secContext)

      this.addChainAccountDrawer.params.pubKey = pubContent
      this.addChainAccountDrawer.params.secKey = secContext

      var address = ecdsaPub2Addr(pubKey)
      this.addChainAccountDrawer.params.ext = address
    },
    generateSM2KeyPairPem() {
      const keyPair = sm2.generateKeyPairHex()

      console.log(keyPair)

      var pubContent = buildSM2PubKeyPem(keyPair.publicKey)
      var secContext = buildSM2SecKeyPem(keyPair.publicKey, keyPair.privateKey)

      console.log(pubContent)
      console.log(secContext)

      this.addChainAccountDrawer.params.pubKey = pubContent
      this.addChainAccountDrawer.params.secKey = secContext

      var address = sm2Pub2Addr(keyPair.publicKey)
      this.addChainAccountDrawer.params.ext = address
    }
  },

  created() {
    this.getUA()
  }
}

function buildChainDetails(chainAccount) {
  var details = ''
  details +=
    chainAccount.type +
    '---' +
    chainAccount.keyID +
    '---' +
    chainAccount.identity.replace('-----BEGIN CERTIFICATE-----', '').substr(0, 64) +
    '---' +
    chainAccount.ext
  return details
}

function buildChainAccountTable(ua) {
  var localChainAccounts = []

  // build table requirements
  for (var chainAccount of ua.chainAccounts) {
    chainAccount.details = buildChainDetails(chainAccount)
    chainAccount.children = []
  }

  // add default account
  var id = 1
  for (chainAccount of ua.chainAccounts) {
    if (chainAccount.isDefault === true) {
      chainAccount.id = id++
      // chainAccount.hasChildren = true
      localChainAccounts.push(chainAccount)
    }
  }

  // add non-default to children
  for (chainAccount of ua.chainAccounts) {
    if (chainAccount.isDefault === false) {
      var defaultChainAccount = localChainAccounts.find(
        (u) => u.type === chainAccount.type
      )
      if (defaultChainAccount !== undefined) {
        chainAccount.id = defaultChainAccount.id * 10000 + defaultChainAccount.children.length + 1
        defaultChainAccount.children.push(chainAccount)
      } else {
        chainAccount.id = id++
        chainAccount.isDefault = true
        localChainAccounts.push(chainAccount)
      }
    }
  }
  console.log('localChainAccounts', localChainAccounts)
  return localChainAccounts
}

const ecdsaSecPemPrefix = '308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420'
const ecdsaPubPemPrefix = '3056301006072a8648ce3d020106052b8104000a034200'

const sm2SecPemPrefix = '308187020100301306072a8648ce3d020106082a811ccf5501822d046d306b0201010420'
const sm2PubPemPrefix = '3059301306072a8648ce3d020106082a811ccf5501822d034200'

function buildECDSASecKeyPem(pubKeyHex, secKeyHex) {
  var asn1HexString = ecdsaSecPemPrefix + secKeyHex + 'a144034200' + pubKeyHex
  var base64String = Buffer.from(asn1HexString, 'hex').toString('base64')

  return '-----BEGIN PRIVATE KEY-----\n' + base64String + '\n-----END PRIVATE KEY-----\n'
}

function buildECDSAPubKeyPem(pubKeyHex) {
  var asn1HexString = ecdsaPubPemPrefix + pubKeyHex
  var base64String = Buffer.from(asn1HexString, 'hex').toString('base64')

  return '-----BEGIN PUBLIC KEY-----\n' + base64String + '\n-----END PUBLIC KEY-----\n'
}

function buildSM2SecKeyPem(pubKeyHex, secKeyHex) {
  var asn1HexString = sm2SecPemPrefix + secKeyHex + 'a144034200' + pubKeyHex
  var base64String = Buffer.from(asn1HexString, 'hex').toString('base64')

  return '-----BEGIN PRIVATE KEY-----\n' + base64String + '\n-----END PRIVATE KEY-----\n'
}

function buildSM2PubKeyPem(pubKeyHex) {
  var asn1HexString = sm2PubPemPrefix + pubKeyHex
  var base64String = Buffer.from(asn1HexString, 'hex').toString('base64')

  return '-----BEGIN PUBLIC KEY-----\n' + base64String + '\n-----END PUBLIC KEY-----\n'
}

function isECDSASecPem(secKeyContent) {
  var base64Content = secKeyContent.replace('\n', '').replace('-----BEGIN PRIVATE KEY-----', '')

  var buffer = Buffer.from(base64Content, 'base64')
  var hexString = buffer.toString('hex')

  if (!hexString.includes(ecdsaSecPemPrefix)) {
    MessageBox.alert('证书内容错误')
    return false
  } else {
    return true
  }
}

function isSM2SecPem(secKeyContent) {
  var base64Content = secKeyContent.replace('\n', '').replace('-----BEGIN PRIVATE KEY-----', '')

  var buffer = Buffer.from(base64Content, 'base64')
  var hexString = buffer.toString('hex')

  if (!hexString.includes(sm2SecPemPrefix)) {
    MessageBox.alert('证书内容错误')
    return false
  } else {
    return true
  }
}

function sm2Pub2Addr(pubKeyHex) {
  var pubKeyHexWithoutPrefix = pubKeyHex.substr(2, 128)

  console.log('pubKeyHexWithoutPrefix: ', pubKeyHexWithoutPrefix)

  var address = '0x' + sm3Hex(pubKeyHexWithoutPrefix).substr(24, 40)
  return address
}

function ecdsaPub2Addr(pubKeyHex) {
  var pubKeyHexWithoutPrefix = pubKeyHex.substr(2, 128) // No prefix 04
  var address = '0x' + keccak256(Uint8Array.from(Buffer.from(pubKeyHexWithoutPrefix, 'hex'))).substr(24, 40)
  return address
}

function getPubKeyHexFromECDSASecPem(secKeyContent) {
  var base64Content = secKeyContent.replace('\n', '').replace('-----BEGIN PRIVATE KEY-----', '')

  var buffer = Buffer.from(base64Content, 'base64')
  var hexString = buffer.toString('hex')
  var pubKeyHex = hexString.substr(140, 130)
  console.log('pubCertHex: ', hexString)
  console.log('pubKeyHex: ', pubKeyHex)
  return pubKeyHex
}

function getPubKeyHexFromSM2SecPem(secKeyContent) {
  var base64Content = secKeyContent.replace('\n', '').replace('-----BEGIN PRIVATE KEY-----', '')

  var buffer = Buffer.from(base64Content, 'base64')
  var hexString = buffer.toString('hex')
  var pubKeyHex = hexString.substr(146, 130)
  console.log('pubCertHex: ', hexString)
  console.log('pubKeyHex: ', pubKeyHex)
  return pubKeyHex
}

function checkPubKeyFormat(key) {
  if (!key.includes('-----BEGIN') || key.includes('PRIVATE')) {
    MessageBox.alert('证书格式错误')
    return false
  } else {
    return true
  }
}
function checkSecKeyFormat(key) {
  if (!key.includes('-----BEGIN PRIVATE KEY-----')) {
    MessageBox.alert('证书格式错误')
    return false
  } else {
    return true
  }
}

</script>

<style lang="scss">
.el-drawer.rtl{
    overflow-y: auto;
}
</style>
