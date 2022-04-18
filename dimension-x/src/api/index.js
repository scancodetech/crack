import request from './request'
import axios from 'axios'

export function estimateGas (params) {
  return axios({
    // url: 'https://api.hecoinfo.com/api',
    // url: 'https://api-cn.etherscan.com/api/',
    url: 'https://api.bscscan.com/api/',
    method: 'get',
    params: {
      // apikey: 'dqnh6tvdf3-4e3ed716-a4a86c4c-ea965', // 火币
      // apikey: 'VKHG7ITK6APJBBDQQEEED18JQ3X5CMY8D4', // ETH
      apikey: 'S61ZYEGKFS7PS8EX4EN34846MR251JCXKR', // 币安
      ...params
    }
  })
}

export function v2userprofile (params) {
  return request({
    url: '/v2/user/profile',
    method: 'get',
    params
  })
}

export function v2userteamdirectlist (params) {
  return request({
    url: '/v2/user/team/direct/list',
    method: 'get',
    params
  })
}

export function userInviteAddInvite (data) {
  return request({
    url: '/userInvite/addInvite',
    method: 'post',
    data
  })
}
