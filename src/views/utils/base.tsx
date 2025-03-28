import { useContext } from 'react'
import Utils from '@views/utils/utils'
import { CONSTANT, SYSTEM } from '@config/index'
import { message as Message } from 'antd'
import { LanguageContext } from '@provider/language'
import zhCN from '@assets/locales/zh.toml'
import enUS from '@assets/locales/en.toml'
import Toast from '@views/components/toast/index'
import Database from '@views/utils/db'

// Toast
const TOAST = {
  /**
   * Toast 弹出提示
   * message -- 内容
   * needTime -- 是否延迟加载
   * duration -- 时间 0 为不关闭
   * time -- 时长
   * type --- 1 --- info 2 --- success  3 --- warning 4 --- error
   * onClose -- 关闭函数
   */
  show: ({
    message = '',
    needTime = false,
    duration = CONSTANT.ALERT_DURATION,
    time = 200,
    type = 1,
    onClose = () => {}
  }) => {
    const getToast = (message: string, duration: number, type: number, onClose: any) => {
      if (type === 3) {
        // warning
        Message.warning(message, duration || CONSTANT.ALERT_DURATION, onClose)
      } else if (type === 4) {
        // error
        Message.error(message, duration || CONSTANT.ALERT_DURATION, onClose)
      } else if (type === 2) {
        // success
        Message.success(message, duration || CONSTANT.ALERT_DURATION, onClose)
      } else {
        // info
        Message.info(message, duration || CONSTANT.ALERT_DURATION, onClose)
      }
    }

    const getToastInPhone = (message: string, duration: number, type: number, onClose: any) => {
      if (type === 3) {
        // warning
        Toast.warning({ text: message, duration: duration || CONSTANT.ALERT_DURATION, onClose })
      } else if (type === 4) {
        // error
        Toast.error({ text: message, duration: duration || CONSTANT.ALERT_DURATION, onClose })
      } else if (type === 2) {
        // success
        Toast.success({ text: message, duration: duration || CONSTANT.ALERT_DURATION, onClose })
      } else {
        // info
        Toast.info({ text: message, duration: duration || CONSTANT.ALERT_DURATION, onClose })
      }
    }

    if (needTime) {
      setTimeout(() => {
        getToast(message, duration, type, onClose)
      }, time)

      return
    }

    if (COMMON.onJudgeIsPhone()) {
      getToastInPhone(message, duration, type, onClose)
    } else {
      getToast(message, duration, type, onClose)
    }
  }
}

// 地址栏相关
const ADDRESS = {
  /**
   * 根据 window.location.href 获取前缀和后缀 URL
   */
  getAddress: (url: string = '') => {
    let address = url || window.location.href

    // 判断有没有项目名
    let projectUrl = process.env.PROJECT_URL || '/'
    if (projectUrl !== '/') {
      let addresses = address.split(projectUrl) || []
      if (addresses.length === 2) {
        return {
          beforeAddressUrl: addresses[0] + projectUrl,
          addressUrl: addresses[1]
        }
      }
    }

    let addressReg = /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)(\/#)?$/
    if (address.substr(address.length - 1, address.length) === '/') {
      address = address.substr(0, address.length - 1)
    }

    // 如果只有协议和端口
    if (addressReg.test(address)) {
      console.log('address:', '')
      console.log('beforeAddressUrl:', address)
      return {
        addressUrl: '',
        beforeAddressUrl: address
      }
    }

    // 判断是否有?
    let qIndex = address.indexOf('?')
    let param = ''
    if (qIndex !== -1) {
      let addressNoParamUrl = address.substr(0, qIndex)
      param = address.substr(qIndex, address.length)
      address = addressNoParamUrl
    }

    // 判断最后一个字符是否是 `\`
    let lastChar = address.substr(address.length - 1, address.length)
    if (lastChar.endsWith('/') || lastChar.endsWith('\\')) {
      address = address.substr(0, address.length)
    }

    let lastIndex = address.lastIndexOf('/')
    let beforeAddressUrl = address.substr(0, lastIndex) // 前缀
    let spec = beforeAddressUrl.indexOf('#') // #
    if (spec !== -1) {
      beforeAddressUrl = `${beforeAddressUrl.substr(0, spec)}#`
    }
    let addressUrl = address.substr(lastIndex, address.length) // 后缀
    console.log('addressUrl:', addressUrl)
    console.log('beforeAddressUrl:', beforeAddressUrl)
    console.log('param:', param)
    return {
      addressUrl,
      beforeAddressUrl,
      param,
      params: ADDRESS.getUrlString(param)
    }
  },

  /**
   * 获取 URL 参数
   */
  getUrlString: (url: string) => {
    if (!url) return {}

    let obj: any = {}
    const getQueryParams = (url: string = '') => {
      let params: any = {}
      if (!url) return params

      let spec = '?'
      let specIndex = url.indexOf(spec)
      if (specIndex === -1) return params

      url = url.substring(specIndex, url.length)
      const t = url.substring(0, 1)
      const query = t === '?' ? url.substring(1, url.length).split('&') : url.split('&')
      if (!query.length) return null
      query.forEach((item: string) => {
        if (item) {
          const data: Array<string> = item.split('=')
          params[data[0]] = data[1] || ''
        }
      })

      return params
    }
    // 判断是否有redirectUrl
    let redirectStr: string = 'redirectUrl='
    const redirectIndex: number = url.indexOf(redirectStr)
    if (redirectIndex !== -1) {
      let item = url.substr(redirectIndex + redirectStr.length, url.length)
      let prefixUrl = url.substr(0, redirectIndex)
      obj[redirectStr.substr(0, redirectStr.length - 1)] = item
      let otherParams = getQueryParams(prefixUrl)
      return {
        ...obj,
        ...otherParams
      }
    }

    return getQueryParams(url)
  },

  /**
   * 根据名称获取浏览器参数
   */
  getAddressQueryString: (name: string) => {
    if (!name) return null
    let after = window.location.search
    after = after.substr(1) || window.location.hash.split('?')[1]
    if (!after) return null
    if (after.indexOf(name) === -1) return null
    let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
    let r = decodeURI(after).match(reg)
    if (!r) return null
    return r[2]
  }
}

// 页面跳转相关
const PAGE_JUMP = {
  /**
   * 通过window跳转
   * @param url 路径
   * @param needPrefix 是否需要前缀
   * @param isReplace 是否替换
   */
  toWindowPage(url: string = '', needPrefix = false, isReplace = false) {
    if (Utils.isBlank(url)) return
    if (needPrefix) {
      let { beforeAddressUrl } = ADDRESS.getAddress()
      url = beforeAddressUrl + url
    }

    if (isReplace) {
      window.location.replace(url)
    } else {
      window.location.href = url
    }
  }
}

// 用户相关
const USER = {
  /**
   * 获取用户信息
   */
  getUserInfo: () => {
    const mobile = Utils.getLocal(SYSTEM.USER_PHONE_NAME) || ''
    if (Utils.isBlank(mobile || '')) {
      return {}
    }

    const key = `${SYSTEM.USER_TOKEN_NAME}_${Utils.encrypt(mobile)}`
    let userInfo = Utils.getLocal(key)
    if (!userInfo) return {}

    if (typeof userInfo === 'string') {
      try {
        userInfo = JSON.parse(userInfo) || {}
      } catch (_) {
        userInfo = {}
      }
    }

    return userInfo
  },

  /**
   * 保存用户信息, 用 LocalStorage 以兼容历史
   */
  setUserInfo: async (userInfo: any = {}) => {
    const token: string = userInfo[SYSTEM.TOKEN_NAME] // 从用户信息中获取 TOKEN
    delete userInfo[SYSTEM.TOKEN_NAME]

    const mobile = userInfo.mobile || ''

    // 设置手机号码
    Utils.removeLocal(SYSTEM.USER_PHONE_NAME)
    Utils.setLocal(SYSTEM.USER_PHONE_NAME, mobile)
    await DB.deleteConstantByDB(SYSTEM.USER_PHONE_NAME)
    await DB.insertConstantByDB(SYSTEM.USER_PHONE_NAME, mobile, false)

    // 设置用户信息
    Utils.removeLocal(`${SYSTEM.USER_TOKEN_NAME}_${Utils.encrypt(mobile)}`)
    Utils.setLocal(`${SYSTEM.USER_TOKEN_NAME}_${Utils.encrypt(mobile)}`, JSON.stringify(userInfo))
    await DB.deleteConstantByDB(SYSTEM.USER_TOKEN_NAME)
    await DB.insertConstantByDB(SYSTEM.USER_TOKEN_NAME, JSON.stringify(userInfo))

    // 保存 TOKEN
    Utils.removeLocal(SYSTEM.LOCAL_TOKEN_NAME)
    Utils.setLocal(SYSTEM.LOCAL_TOKEN_NAME, token)
    await DB.deleteConstantByDB(SYSTEM.LOCAL_TOKEN_NAME)
    await DB.insertConstantByDB(SYSTEM.LOCAL_TOKEN_NAME, token, false)
  },

  /**
   * 清除用户信息
   */
  clearUserInfo: async () => {
    // 清除 Token
    Utils.removeLocal(SYSTEM.LOCAL_TOKEN_NAME)
    await DB.deleteConstantByDB(SYSTEM.LOCAL_TOKEN_NAME)

    // 清除手机号码
    Utils.removeLocal(SYSTEM.USER_PHONE_NAME)
    await DB.deleteConstantByDB(SYSTEM.USER_PHONE_NAME)

    // 清除用户信息
    Utils.removeLocal(SYSTEM.USER_TOKEN_NAME)
    await DB.deleteConstantByDB(SYSTEM.USER_TOKEN_NAME)

    // 清除 DB
    await DB.onClearDB()
    await DB.onClearVariableDB()

    Utils.clearSessionStorage()
    Utils.clearLocalStorage()
  },

  /**
   * 获取token
   */
  getToken: async () => {
    let token = (await DB.getConstantByDB(SYSTEM.LOCAL_TOKEN_NAME, false)) || ''
    if (Utils.isBlank(token || '')) {
      token = Utils.getLocal(SYSTEM.LOCAL_TOKEN_NAME) || ''
    }

    return token
  }
}

// 公共模块相关
const COMMON = {
  /**
   * 获取语言文本
   */
  getLanguageText: (name: string, isDom: boolean = false) => {
    if (Utils.isBlank(name)) return ''
    try {
      const language = isDom
        ? // eslint-disable-next-line react-hooks/rules-of-hooks
          useContext(LanguageContext)
        : Utils.getLocal(CONSTANT.LANGUAGES_NAME) || CONSTANT.LANGUAGES[0]
      if (language === CONSTANT.LANGUAGES[0]) {
        return zhCN[name] || ''
      }
      if (language === CONSTANT.LANGUAGES[1]) {
        return enUS[name] || ''
      }
    } catch (e) {
      return CONSTANT.LANGUAGES[0]
    }
  },

  /**
   * 判断是不是手机端
   */
  onJudgeIsPhone: () => {
    if (window.innerWidth <= 768) {
      return true
    }

    return navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('Android') > -1
  }
}

const DB = {
  /**
   * 创建本地数据库
   */
  createDb: async () => {
    const db = new Database()
    await db.create(SYSTEM.DB_NAME, parseInt(SYSTEM.DB_VERSION))
    return db
  },

  /**
   * 清除本地缓存
   */
  onClearDB: async () => {
    const db = await DB.createDb()
    await db.clear()
  },

  /**
   * 创建本地常量数据库
   */
  createVariableDb: async () => {
    const db = new Database()
    await db.create(SYSTEM.CONSTANT_DB_NAME, parseInt(SYSTEM.CONSTANT_DB_VERSION))
    return db
  },

  /**
   * 清除常量缓存
   */
  onClearVariableDB: async () => {
    const db = await DB.createVariableDb()
    await db.clear()
  },

  /**
   * 常量插入
   * @param key
   * @param value
   * @param needMobileByKey
   * @param needEncrypt
   */
  insertConstantByDB: async (key: string, value: any, needMobileByKey: boolean = true, needEncrypt: boolean = true) => {
    if (Utils.isBlank(key) || '') return

    const db = await DB.createVariableDb()
    let id = key
    if (needMobileByKey) {
      // 在 key 上添加 phone
      const user = USER.getUserInfo() || {}
      if (Utils.isBlank(user.mobile || '')) return
      id = `${key}_${Utils.encrypt(user.mobile)}`
    }

    let insertValue = value
    if (needEncrypt) {
      insertValue = Utils.encrypt(insertValue) || ''
    }
    await db.insert({ id, value: insertValue })
  },

  /**
   * 常量获取
   * @param key
   * @param needMobileByKey
   * @param needDecrypt
   */
  getConstantByDB: async (key: string, needMobileByKey: boolean = true, needDecrypt: boolean = true) => {
    if (Utils.isBlank(key) || '') return null

    const db = await DB.createVariableDb()
    let id = key
    if (needMobileByKey) {
      const user = USER.getUserInfo() || {}
      if (Utils.isBlank(user.mobile || '')) return null
      id = `${key}_${Utils.encrypt(user.mobile)}`
    }

    const obj = (await db.get(id)) || {}
    const value = obj.value || ''
    if (Utils.isBlank(value)) return null
    if (needDecrypt) {
      return Utils.decrypt(value) || ''
    }

    return value
  },

  /**
   * 常量删除
   */
  deleteConstantByDB: async (key: string) => {
    if (Utils.isBlank(key) || '') return null

    const userInfo: { [K: string]: any } = USER.getUserInfo() || {}
    if (Utils.isBlank(userInfo.mobile || '')) return null
    const db = await DB.createVariableDb()
    const id = `${key}_${Utils.encrypt(userInfo.mobile)}`
    await db.delete(id)
  }
}

export { PAGE_JUMP, ADDRESS, USER, TOAST, COMMON, DB }
