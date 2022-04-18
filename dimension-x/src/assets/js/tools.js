export default {
  install (Vue) {
    Vue.prototype.$stringToByte = (str) => { // 字符串转bytes32
      let bytes = []
      let len, c
      len = str.length
      for (var i = 0; i < len; i++) {
        c = str.charCodeAt(i)
        if (c >= 0x010000 && c <= 0x10FFFF) {
          bytes.push(((c >> 18) & 0x07) | 0xF0)
          bytes.push(((c >> 12) & 0x3F) | 0x80)
          bytes.push(((c >> 6) & 0x3F) | 0x80)
          bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
          bytes.push(((c >> 12) & 0x0F) | 0xE0)
          bytes.push(((c >> 6) & 0x3F) | 0x80)
          bytes.push((c & 0x3F) | 0x80)
        } else if (c >= 0x000080 && c <= 0x0007FF) {
          bytes.push(((c >> 6) & 0x1F) | 0xC0)
          bytes.push((c & 0x3F) | 0x80)
        } else {
          bytes.push(c & 0xFF)
        }
      }
      return bytes
    }
    Vue.prototype.$Bytes2HexString = (arrBytes) => { // bytes32转字符串
      var str = ''
      for (var i = 0; i < arrBytes.length; i++) {
        var tmp
        var num = arrBytes[i]
        if (num < 0) {
          // 此处填坑，当byte因为符合位导致数值为负时候，需要对数据进行处理
          tmp = (255 + num + 1).toString(16)
        } else {
          tmp = num.toString(16)
        }
        if (tmp.length === 1) {
          tmp = '0' + tmp
        }
        str += tmp
      }
      str = '0x' + str
      return str
    }
    Vue.prototype.$openPage = (item) => { // 跳转外部链接
      window.open(item)
    }
    Vue.prototype.$toFixed = (num, numLength = 3, abs = false) => { // 数字取几位数
      if (isNaN(Number(num)) || Number(num) === Infinity) {
        return '--'
      } else {
        const numLength2 = Math.pow(10, numLength) // 取6位
        num = Vue.prototype.$BigNumber(parseInt(Vue.prototype.$BigNumber(num).multipliedBy(numLength2))).dividedBy(numLength2)
        num = abs ? Math.abs(num) : num
        num = isNaN(num) ? Number(0).toFixed(numLength) : num.toFixed(numLength)
        return num
      }
    }
    Vue.prototype.$subString = (str, length = 9) => { // 切割字符串
      str += ''
      return str.substr(0, length) + '***' + str.substring(str.length - length)
    }
    Vue.prototype.$allSettled = (funcArr) => { // 增加Promise.allSettled功能
      return new Promise((resolve) => {
        let sttled = 0
        let result = []
        for (let index = 0; index < funcArr.length; index++) {
          const element = funcArr[index]
          element.then(res => {
            result[index] = {
              status: 'fulfilled',
              value: res
            }
          }).catch(err => {
            result[index] = {
              status: 'rejected',
              reason: err
            }
          }).finally(() => { ++sttled === funcArr.length && resolve(result) })
        }
      })
    }
    Vue.prototype.$openMailbox = (href) => {
      const aTag = document.createElement('a')
      aTag.target = '_blank'
      aTag.href = 'mailto:' + href
      aTag.click()
    }
    Vue.prototype.$coming = () => {
      Vue.prototype.$toast.loading({
        message: Vue.prototype.$myI18n.t('js.Underdevelopment')
      })
    }
    Vue.prototype.$downloadFile = (fileName, content) => {
      const aTag = document.createElement('a')
      // aTag.download = fileName
      aTag.href = content
      aTag.click()
    },
    Vue.prototype.$format = (fmt, time) => { 
      let ret
      const date = new Date(Number(time))
      const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt)
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        }
      }
      return fmt
    }
    Vue.prototype.$randomWord = () => {
      let code = ''
      for (var i = 0; i < 6; i++) {
        var type = getRandom(1, 2)
        switch (type) {
          case 1:
            code += String.fromCharCode(getRandom(48, 57))// 数字
            break
          // case 2:
          //   code += String.fromCharCode(getRandom(65, 90))// 大写字母
          //   break
          case 2:
            code += String.fromCharCode(getRandom(97, 122))// 小写字母
            break
        }
      }
      return code
    }
    function getRandom (min, max) {
      return Math.round(Math.random() * (max - min) + min)
    }

    Vue.prototype.$timestampToTime =function (data) {
        var s;
        var hours = parseInt((data%(60*60*24))/(60*60))
        var minutes = parseInt((data%(60*60))/(60))
        var seconds = data%(60);
        s=(hours<10?('0'+hours):hours)+':'+(minutes<10?('0'+minutes):minutes)+':'+(seconds<10?('0'+seconds):seconds)
        return s
      }
  }
}