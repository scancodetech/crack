import Vue from 'vue'
// import WalletConnect from '@walletconnect/client'
// import QRCodeModal from '@walletconnect/qrcode-modal'
import { estimateGas } from '@/api/index.js'

const walletFuc = new Vue({
  created () {
    this.metaMaskConnect(false)
  },
  data () {
    return {
      walletAddress: '', // 钱包地址
      connectionMode: '', // 标识用什么方式连接钱包的
      connector: {},
      ethereum: {},
      tokenNum: '0x1b1ae4d6e2ef500000', // 授权代币数量
      authNum: '0x32' // 少于这个数量时要重新授权
    }
  },
  methods: {
    metaMaskConnect (isNeed = true) { // 连接metaMask
      if (typeof window.ethereum === 'undefined' && isNeed) {
        Vue.prototype.$toast(Vue.prototype.$myI18n.t('js.PleaseinstallMetaMask'))
        return false
      }
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(res => {
        this.connectionMode = 'MetaMask'
        // if (window.ethereum.networkVersion === process.env.VUE_APP_CHAINID) {
          this.walletAddress = res[0]
          this.watchMetaMask()
        // } else {
        //   Vue.prototype.$toast(Vue.prototype.$myI18n.t('js.PleaseinstallMetaMask'))
        // }
      })
    },
    watchMetaMask () { // 监控watchMetaMask
      window.ethereum.on('accountsChanged', res => {
        // if (window.ethereum.networkVersion === process.env.VUE_APP_CHAINID) {
          this.walletAddress = res[0]
          this.watchMetaMask()
        // } else {
        //   this.walletAddress = ''
        //   Vue.prototype.$toast(Vue.prototype.$myI18n.t('js.PleaseinstallMetaMask'))
        // }
      })
    },
    // walletConnect () { // 通过WalletConnect连接
    //   const bridge = 'https://bridge.walletconnect.org'
    //   this.connector = new WalletConnect({bridge, qrcodeModal: QRCodeModal})
    //   this.connectionMode = 'WalletConnect'
    //   // create new session
    //   if (!this.connector.connected) {
    //     this.connector.createSession()
    //   }
    //   if (this.connector.connected) {
    //     this.walletAddress = this.connector.accounts[0]
    //   }
    //   // 更新
    //   this.connector.on('session_update', (error, payload) => {
    //     console.log('session_update', error, payload)
    //     QRCodeModal.close()
    //   })
    //   // 连接
    //   this.connector.on('connect', (error, payload) => {
    //     console.log('connect', error, payload)
    //     this.walletAddress = payload.params[0].accounts[0]
    //   })
    //   // 断开连接
    //   this.connector.on('disconnect', (error, payload) => {
    //     console.log('disconnect', error, payload)
    //     this.walletAddress = ''
    //   })
    // },
    delWalletConnect () { // 断开钱包连接
      if (this.connectionMode === 'WalletConnect') {
        this.connector.killSession()
      } else {
        this.walletAddress = ''
      }
    },
    async getGasPrice () { // 获取gas价格
      try {
        let gasPrice = await estimateGas({
          'module': 'gastracker',
          'action': 'gasoracle'
        })
        // gasPrice = Vue.prototype.$BigNumber(gasPrice.data.result.ProposeGasPrice).multipliedBy(Math.pow(10, 9)).toString()
        gasPrice = await Vue.prototype.$web3.eth.getGasPrice()
        return Promise.resolve(gasPrice)
      } catch (err) {
        Vue.prototype.$toast(Vue.prototype.$myI18n.t('js.GasPriceacquisitionfailed'))
        return Promise.reject(err)
      }
    },
    async web3EstimateGas (data, to, gasPrice, value) {
      value = '0x' + Vue.prototype.$BigNumber(value).toString(16)
      try {
        let gas = await Vue.prototype.$web3.eth.estimateGas({
          data,
          from: this.walletAddress,
          to,
          gasPrice,
          value
        })
        gas = parseInt(gas * Vue.prototype.$gasLimit).toString()
        return Promise.resolve(gas)
      } catch (err) {
        Vue.prototype.$toast(String(err))
        return Promise.reject(err)
      }
    },
    async metaMaskSendTransaction (encodeABI, to, gasPrice, gas, value) {
      try {
        let nonce = await Vue.prototype.$web3.eth.getTransactionCount(this.walletAddress, 'pending')
        nonce = '0x' + Vue.prototype.$BigNumber(nonce).toString(16)
        gasPrice = '0x' + Vue.prototype.$BigNumber(gasPrice).toString(16)
        gas = '0x' + Vue.prototype.$BigNumber(gas).toString(16)
        value = '0x' + Vue.prototype.$BigNumber(value).toString(16)
        const transactionParameters = {
          nonce,
          data: encodeABI,
          from: this.walletAddress,
          to,
          gasPrice,
          gas,
          value
        }
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters]
        })
        Vue.prototype.$toast(Vue.prototype.$myI18n.t('js.Successfultrade'))
        return Promise.resolve(txHash)
      } catch (err) {
        Vue.prototype.$toast(Vue.prototype.$myI18n.t('js.Thedealfailed'))
        return Promise.reject(err)
      }
    },
    // async walletConnectSendTransaction (encodeABI, to, gasPrice, gas, value) { // 通过walletConnect发送交易
    //   try {
    //     let nonce = await Vue.prototype.$web3.eth.getTransactionCount(this.walletAddress, 'pending')
    //     nonce = '0x' + Vue.prototype.$BigNumber(nonce).toString(16)
    //     gasPrice = '0x' + Vue.prototype.$BigNumber(gasPrice).toString(16)
    //     gas = '0x' + Vue.prototype.$BigNumber(gas).toString(16)
    //     value = '0x' + Vue.prototype.$BigNumber(value).toString(16)
    //     const transactionParameters = {
    //       nonce,
    //       data: encodeABI,
    //       from: this.walletAddress,
    //       to,
    //       gasPrice,
    //       gas,
    //       value
    //     }
    //     const txHash = await this.connector.sendTransaction(transactionParameters)
    //     Vue.prototype.$toast(Vue.prototype.$myI18n.t('js.Successfultrade'))
    //     return Promise.resolve(txHash)
    //   } catch (err) {
    //     Vue.prototype.$toast(Vue.prototype.$myI18n.t('js.Thedealfailed'))
    //     return Promise.reject(err)
    //   }
    // },
    async isTokenAddress (tokenAdd, contAdd, ay) { // 查看授权
      try {
        const contractERC = this.$contract(this.$abierc, tokenAdd)
        let num = await contractERC.methods.allowance(this.walletAddress, contAdd).call()
        num = this.$BigNumber(num).dividedBy(ay).toString()
        // 查看下缓存有无交易哈希，有则清除
        let tokenAuth = localStorage.getItem('tokenAuth')
        let isAuth = false
        if (Number(num) > Number(this.authNum)) { // 数量大于0，已授权
          isAuth = true
          if (tokenAuth) {
            tokenAuth = JSON.parse(tokenAuth)
            tokenAuth.forEach((item, index) => {
              if (item.walletAddress === this.walletAddress && tokenAdd === item.tokenAdd && contAdd === item.contAdd) { // 获取缓存里的当前交易哈希
                tokenAuth.splice(index, 1)
                tokenAuth = JSON.stringify(tokenAuth)
                localStorage.setItem('tokenAuth', tokenAuth)
              }
            })
          }
        }
        return Promise.resolve(isAuth)
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async lookAllowance (tokenAdd, contAdd) { // 查询代币授权交易是否完成
      let tokenAuth = localStorage.getItem('tokenAuth')
      let txhash = ''
      let isIndex
      if (tokenAuth) {
        tokenAuth = JSON.parse(tokenAuth)
        tokenAuth.forEach((item, index) => {
          if (item.walletAddress === this.walletAddress && tokenAdd === item.tokenAdd && contAdd === item.contAdd) { // 获取缓存里的当前交易哈希
            txhash = item.txhash
            isIndex = index
          }
        })
      }
      if (txhash) {
        // null为交易中，0：失败， 1：成功
        let status = await estimateGas({
          'module': 'transaction',
          'action': 'gettxreceiptstatus',
          txhash
        })
        if (status.data.status === '0' || status.data.status === '') { // 不正确交易
          Vue.prototype.$toast(Vue.prototype.$myI18n.t('js.Wrongtrade'))
          return Promise.resolve(false)
        }
        status = status.data.result.status
        if (status === '') {
          this.$toast.loading({
            message: Vue.prototype.$myI18n.t('js.Pleasewaitforauthorizationtocomplete'),
            duration: 5000
          })
          return Promise.resolve(false)
        } else if (status === '0') { // 失败则重新授权
          Vue.prototype.$toast(Vue.prototype.$myI18n.t('js.privilegegrantfailed'))
          // 剪去tokenAuth中的该代币信息,再重新缓存
          tokenAuth.splice(isIndex, 1)
          tokenAuth = JSON.stringify(tokenAuth)
          localStorage.setItem('tokenAuth', tokenAuth)
          return Promise.resolve(false)
        } else if (status === '1') {
          // 剪去tokenAuth中的该代币信息,再重新缓存
          tokenAuth.splice(isIndex, 1)
          tokenAuth = JSON.stringify(tokenAuth)
          localStorage.setItem('tokenAuth', tokenAuth)
          Vue.prototype.$toast(Vue.prototype.$myI18n.t('js.Authorized'))
          return Promise.resolve('1')
        }
      }
      return Promise.resolve(true)
    },
    saveAllowance (txhash, tokenAdd, contAdd) { // 操作代币授权缓存
      let tokenAuth = localStorage.getItem('tokenAuth')
      const allowanceItem = {
        walletAddress: this.walletAddress, // 连接的钱包地址
        txhash, // 交易哈希
        tokenAdd,
        contAdd
      }
      if (tokenAuth) {
        tokenAuth = JSON.parse(tokenAuth)
      } else {
        tokenAuth = []
      }
      tokenAuth.push(allowanceItem)
      tokenAuth = JSON.stringify(tokenAuth)
      localStorage.setItem('tokenAuth', tokenAuth)
    },
    async approve (tokenAdd, contAdd) { // 代币授权
      const status = await this.lookAllowance(tokenAdd, contAdd)
      if (!status || status === '1') {
        return Promise.reject(true)
      }
      Vue.prototype.$toast.loading({
        duration: 0,
        message: Vue.prototype.$myI18n.t('js.loading')
      })
      try {
        const contractERC = this.$contract(this.$abierc, tokenAdd)
        const encodeABI = contractERC.methods.approve(contAdd, this.tokenNum).encodeABI()
        const gasPrice = await this.getGasPrice()
        const value = '0'
        const gas = await this.web3EstimateGas(encodeABI, tokenAdd, gasPrice, value)
        let txHash
        if (this.connectionMode === 'MetaMask') {
          txHash = await this.metaMaskSendTransaction(encodeABI, tokenAdd, gasPrice, gas, value)
        } else if (this.connectionMode === 'WalletConnect') {
          txHash = await this.walletConnectSendTransaction(encodeABI, tokenAdd, gasPrice, gas, value)
        }
        this.saveAllowance(txHash, tokenAdd, contAdd)
      } catch (err) {
        return Promise.reject(err)
      }
    },
    
  }
})
export default walletFuc