import Contract from 'web3-eth-contract'
import Vue from 'vue'
import abierc from './abierc.json'
import abilp from './abilp.json'

import Web3 from 'web3'
// const Web3 = window.Web3

// let provider = 'https://http-mainnet.hecochain.com' // 火币
let provider = 'https://bsc-dataseed1.binance.org' // 币安
// let provider = 'https://mainnet.infura.io/v3/4406c3acf862426c83991f1752c46dd8' // ETH
// if (process.env.NODE_ENV === 'development') { // 开发环境取测试网
//   provider = 'https://http-testnet.hecochain.com'
// }

let web3
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
} else {
  // 测试网
  web3 = new Web3(new Web3.providers.HttpProvider(provider))
  Contract.setProvider(provider)
}

Vue.prototype.$web3 = web3
Vue.prototype.$contract = (abi, addresses) => {
  return new Contract(abi, addresses)
}

Vue.prototype.$abierc = abierc
Vue.prototype.$abilp = abilp
Vue.prototype.$usdtAdd = '0x55d398326f99059fF775485246999027B3197955'
Vue.prototype.$zeroAdd = '0x0000000000000000000000000000000000000000'

// Vue.prototype.$nftUrl = 'https://ipfs.kxv.io/ipfs/'

Vue.prototype.$numAy = Math.pow(10, 18)
Vue.prototype.$gasLimit = 1.05
Vue.prototype.$usd = 6.4648 // 汇率
Vue.prototype.$timer = 10000
