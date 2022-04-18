import md5 from 'md5'

const arrSort = (arr) => {
  return arr.sort((s, t) => {
    if (s < t) return -1
    if (s > t) return 1
    return 0
  })
}

function sign (signStr) { // 获取签名
  const arr = []
  Object.keys(signStr).forEach(key => {
    arr.push(`${key}=${signStr[key]}`)
  })
  let str = arrSort(arr).join('&')
  const key = '640ba54d-8b11-497b-be45-5ea10bb431f4'
  str = md5(str)
  str = str + key
  str = md5(str)
  return str
}

export default sign