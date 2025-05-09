/**
 * @fileOverview base store, all store muse extends this store
 * @date 2023-04-12
 * @author poohlaha
 */
import { action, observable } from 'mobx'
import { SYSTEM } from '@config/index'
import { COMMON, DB, PAGE_JUMP, TOAST, USER } from '@views/utils/base'
import Utils from '@views/utils/utils'
import SmCrypto from 'sm-crypto'
import { HttpRequest, type IHttpRequestProps } from '@bale-web/request'
import WasmUtils from '@stores/base/wasm'
import RouterUrls from '@route/router.url.toml'

export default class BaseStore {
  @observable loading: boolean = false
  @observable currentPage: number = 1
  readonly DEFAULT_PAGE_SIZE = 10
  @observable pageSize: number = this.DEFAULT_PAGE_SIZE
  @observable total: number = 0
  readonly pageSizeOptions = [10, 20, 50, 100]
  readonly DATE_FORMAT = 'YYYY-MM-DD'

  readonly tokenName: string = 'sys_token'
  readonly DOMAIN_PORT_REG = /^https?:\/\/[^\\/]+\/([^?#]+(\?[^#]*)?)?/
  readonly PHONE_REG = /^1(3|4|5|6|7|8|9)\d{9}$/

  readonly API_DATA = {
    localIp: '127.0.0.1',
    version: '1.0',
    appVersion: '1.0', // 版本号
    opStation: 'NA',
    appId: 'CHATPC',
    channel: 'web'
  }

  readonly SUFFIXS: Array<string> = [
    'jpeg',
    'jpg',
    'png',
    'gif',
    'tiff',
    'tif',
    'webp',
    'ico',
    'heic',
    'dxf',
    'eps',
    'pcx',
    'wmf',
    'exif',
    'raw',
    'cgm',
    'svg',
    'cdr',
    'tga',
    'bmp',
    'psd',
    'emf',
    'swf',
    'pdf',
    'lic',
    'txt',
    'doc',
    'docx',
    'xlsx',
    'ppt',
    'pptx',
    'ofd'
  ]

  readonly wasmUtils = new WasmUtils()

  /**
   * 判断用户是否过期
   */
  @action
  onJudgeUserExpired() {
    let userInfo: { [K: string]: any } = USER.getUserInfo() || {}
    return Utils.isBlank(userInfo.mobile || '')
  }

  /**
   * 从 LocalStorage 中获取 Boolean 值
   * @param name
   */
  async onGetLocalBooleanValue(name: string = '') {
    const str = (await DB.getConstantByDB(name)) || ''
    return str === 'true'
  }

  /**
   * 获取相对路径
   */
  @action
  getRelativePath(url: string = '') {
    if (Utils.isBlank(url)) return ''
    const match = url.match(this.DOMAIN_PORT_REG)
    if (match) {
      let matchUrl = match[1] || ''
      if (matchUrl.startsWith('/')) {
        return matchUrl
      }

      return `/${matchUrl}`
    }

    return url || ''
  }

  /**
   * 发送请求
   * options: {
   *   url: '',
   *   success: () -> {},
   *   fail: () => {}
   * }
   */
  @action
  async send(options: { [K: string]: any } = {}, needSend: boolean = true, headers: { [K: string]: any } = {}) {
    if (Utils.isObjectNull(options)) {
      console.warn('options is empty !')
      return
    }

    if (Utils.isBlank(options.url)) {
      console.warn('url is empty !')
      return
    }

    let isLogin = options.isLogin
    if (isLogin === undefined || isLogin === null) {
      isLogin = false
    }

    let formSubmit = options.formSubmit
    if (formSubmit === null || formSubmit === undefined) {
      formSubmit = false
    }

    let param: any = null
    let data = options.data || {}
    if (formSubmit) {
      param = new URLSearchParams()
      for (let key in data) {
        param.append(key, data[key])
      }
    } else {
      param = data
    }

    let requestUrl = options.url || ''
    if (!requestUrl.startsWith('https://') && !requestUrl.startsWith('http://')) {
      requestUrl = process.env.API_ROOT + requestUrl
    }

    // let token = isLogin ? '' : this.sm2Encrypt(`${Utils.getLocal(SYSTEM.LOCAL_TOKEN_NAME) || ''}_${new Date().getTime()}`)
    let token = isLogin ? '' : Utils.getLocal(SYSTEM.LOCAL_TOKEN_NAME)
    console.log('token: ', Utils.getLocal(SYSTEM.LOCAL_TOKEN_NAME))

    let requestHeaders = {}
    if (!Utils.isObjectNull(headers)) {
      requestHeaders = headers
    }

    const userInfo = USER.getUserInfo() || {}
    console.log(userInfo)
    let type = options.responseStream ? '3' : Utils.isBlank(options.responseType || '') ? '0' : options.responseType
    let params: any = {
      url: requestUrl,
      data: param,
      type: formSubmit ? '1' : '0',
      headers: {
        [this.tokenName]: token || '',
        ...requestHeaders
      },
      timeout: 10,
      method: options.method ?? 'POST',
      success: (data: any = {}) => {
        // 不需要判断返回码
        if (options.needNoCode) {
          return options.success?.(data.body || null)
        }

        if (type !== '0') {
          return options.success?.(data.body || null)
        }

        let body = data.body || {}
        if (body.code !== '0' && body.code !== 0) {
          // token 过期
          if (body.code === SYSTEM.TOKEN_EXPIRED_CODE) {
            TOAST.show({
              message: COMMON.getLanguageText('TOKEN_EXPIRED_ERROR'),
              type: 4
            })
            Utils.clearLocalStorage()
            Utils.clearSessionStorage()

            setTimeout(() => {
              PAGE_JUMP.toWindowPage(RouterUrls.SYSTEM.LOGIN_URL, true, true)
            }, 500)
          } else if (body.code === '-99') {
            TOAST.show({
              message: COMMON.getLanguageText('ERROR_MESSAGE'),
              type: 4
            })
          } else {
            let whenCodeNoZeroOpenDialog = options.whenCodeNoZeroOpenDialog
            if (whenCodeNoZeroOpenDialog === null || whenCodeNoZeroOpenDialog === undefined) {
              whenCodeNoZeroOpenDialog = true
            }
            if (whenCodeNoZeroOpenDialog) {
              let reason = body.codeInfo || COMMON.getLanguageText('ERROR_MESSAGE')
              TOAST.show({
                message: reason,
                type: 4
              })
            }
          }

          return options.fail?.(body || {})
        }

        return options.success?.(body.data || {}, body)
      },
      failed: async (res: any = {}) => {
        if (res.code === SYSTEM.TOKEN_EXPIRED_CODE) {
          // await this.getLoginUrl()
        }

        options.fail?.(res)
      },
      responseType: type
    }

    if (!needSend) {
      return params
    }

    // 判官是否支持 wasm
    if (type !== '6') {
      if (this.isSupportWasm()) {
        console.log('params', params)
        const fallbackModule = await import('@bale-wasm/http')
        let response = await fallbackModule.send(params, null)
        return this.wasmUtils.onHandleResult(params, response)
      }
    }

    return await HttpRequest.send(params)
  }

  /**
   * 判断是否支持 wasm
   */
  @action
  isSupportWasm() {
    if (typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function') {
      // 浏览器支持WebAssembly
      console.log('WebAssembly is supported')
      return true
    }
    // 浏览器不支持WebAssembly
    console.log('WebAssembly is not supported')
    return false
  }

  /**
   * 批量发送
   * @param queue
   */
  @action
  async batchSend(queue: Array<any> = []) {
    if (queue.length === 0) {
      console.log('batch send queue is empty!')
      return []
    }

    let results = (await Promise.all(queue)) || []
    if (results.length === 0) return []

    let data: Array<any> = []
    for (let result of results) {
      if (result === null || result === undefined) {
        result = {}
      }
      let status = result.status
      let body = result.body || {}
      let errorMsg = body.error || body.codeInfo || COMMON.getLanguageText('ERROR_MESSAGE')
      if (status !== 200) {
        TOAST.show({ message: errorMsg, type: 4 })
        return []
      }

      let d = body.data
      let extendData = body.extendData
      data.push({
        data: d,
        extendData
      })
    }

    return data
  }

  // 下载pdf
  @action
  exportPdf(data: any, fileName: string) {
    if (!data) return
    let blob = new Blob([data || ''], { type: 'application/pdf' })
    let a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = fileName || ''
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  exportFile(url: string, fileName: string) {
    if (Utils.isBlank(url)) return

    let newFileName = ''
    if (Utils.isBlank(fileName) || fileName.indexOf('.') === -1) {
      let urls = url.split('/') || []
      if (urls.length > 0) {
        newFileName = urls[urls.length - 1]
      } else {
        newFileName = fileName || ''
      }
    } else {
      newFileName = fileName || ''
    }

    const download = (url: any) => {
      let a = document.createElement('a')
      a.href = url || ''
      a.download = newFileName || ''
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }

    let suffixS = newFileName.split('.') || []
    let suffix = ''
    if (suffixS.length >= 2) {
      suffix = suffixS[suffixS.length - 1] || ''
      suffix = suffix.toLowerCase()
    }

    if (this.SUFFIXS.indexOf(suffix) !== -1) {
      let xhr = new XMLHttpRequest()
      xhr.responseType = 'blob'
      xhr.onload = () => {
        let data = xhr.response
        let blob = new Blob([data || ''], { type: `application/${suffix}` })
        download(URL.createObjectURL(blob))
      }

      xhr.open('GET', url, true)
      xhr.send()
    } else {
      download(url)
    }
  }

  /**
   * sm2加密
   */
  sm2Encrypt(str: string = '') {
    if (Utils.isBlank(str)) return ''
    let publicKey = process.env.SM2_PUBLIC_KEY || ''
    if (!publicKey.startsWith('04')) {
      publicKey = `04${publicKey}`
    }

    // 1: C1C3C2 0: C1C2C3
    return SmCrypto.sm2.doEncrypt(str, publicKey, 1)
  }

  /**
   * 文件上传
   */
  async onUpload(options: { [K: string]: any } = {}, headers: { [K: string]: any } = {}) {
    if (Utils.isObjectNull(options)) return

    let requestHeaders = {}
    let token = this.sm2Encrypt(`${Utils.getLocal(SYSTEM.LOCAL_TOKEN_NAME) || ''}_${new Date().getTime()}`)
    console.log('token: ', Utils.getLocal(SYSTEM.LOCAL_TOKEN_NAME))

    if (!Utils.isObjectNull(headers)) {
      requestHeaders = headers
    }

    let requestUrl = options.url || ''
    if (!requestUrl.startsWith('https://') && !requestUrl.startsWith('http://')) {
      requestUrl = process.env.API_ROOT + requestUrl
    }

    // 测试环境设置禁用证书发送
    if (process.env.APP_NODE_ENV === 'prod') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    }

    let type = options.responseStream ? '3' : '0'
    const params: { [K: string]: any } = {
      url: requestUrl,
      headers: {
        [this.tokenName]: token || '',
        ...requestHeaders
      },
      data: options.data,
      method: options.method || '',
      timeout: 500,
      responseType: type,
      success: (data: any = {}) => {
        if (type !== '0') {
          return options.success?.(data.body || null)
        }

        let body = data.body || {}
        if (body.code !== '0' && body.code !== 0) {
          // token 过期
          if (body.code === SYSTEM.TOKEN_EXPIRED_CODE) {
            TOAST.show({
              message: COMMON.getLanguageText('TOKEN_EXPIRED_ERROR'),
              type: 2
            })
            return options.fail?.(body || {}, true)
          }
          TOAST.show({
            message: COMMON.getLanguageText('ERROR_MESSAGE'),
            type: 4
          })

          return options.fail?.(body || {})
        }

        return options.success?.(body.data || {})
      },
      failed: async (res: any = {}) => {
        if (res.code === SYSTEM.TOKEN_EXPIRED_CODE) {
          // await this.getLoginUrl()
        } else {
          options.fail?.(res)
        }
      },
      type: '2'
    }

    // 判官是否支持 wasm
    if (this.isSupportWasm()) {
      const fallbackModule = await import('@bale-wasm/http')
      let response = await fallbackModule.send(params, null)
      return this.wasmUtils.onHandleResult(params, response)
    }

    await HttpRequest.send(params as IHttpRequestProps)
  }

  /**
   * 判断ios版本
   */
  @action
  getIOSVersion() {
    const ua = window.navigator.userAgent || ''
    const match = ua.match(/iPhone OS (\d+)_(\d+)_?(\d+)?/)
    if (match) {
      return {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10),
        patch: match[3] ? parseInt(match[3], 10) : 0
      }
    }
    return {
      major: 0,
      minor: 0,
      patch: 0
    }
  }

  /**
   * 判断 Android 版本
   */
  @action
  getAndroidVersion() {
    const ua = window.navigator.userAgent || ''
    const match = ua.match(/Android (\d+)\.(\d+)\.?(\d+)?/)
    if (match) {
      return {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10),
        patch: match[3] ? parseInt(match[3], 10) : 0
      }
    }
    return {
      major: 0,
      minor: 0,
      patch: 0
    }
  }

  /**
   * 判断 safari 版本
   */
  @action
  getSafariVersion() {
    const ua = window.navigator.userAgent || ''
    const match = ua.match(/Version\/(\d+)\.(\d+)\.?(\d+)? Safari/)
    if (match) {
      return {
        major: parseInt(match[1], 10),
        minor: parseInt(match[2], 10),
        patch: match[3] ? parseInt(match[3], 10) : 0
      }
    }
    return {
      major: 0,
      minor: 0,
      patch: 0
    }
  }

  /**
   * 在 ios 13 以下不渲染表格等数据
   * 在 android 9 以下不渲染表格等数据
   * 在 safari 14 以下不渲染表格等数据
   */
  @action
  onUpperPhoneVersion() {
    const iosVersion = this.getIOSVersion()
    const androidVersion = this.getAndroidVersion()
    const safariVersion = this.getSafariVersion()
    console.log('ios version', iosVersion)
    console.log('android version', androidVersion)
    console.log('safari version', safariVersion)
    if (iosVersion.major > 0 || androidVersion.major > 0 || safariVersion.major > 0) {
      if (iosVersion.major > 0 && iosVersion.major < 13) {
        return true
      }

      if (androidVersion.major > 0 && androidVersion.major < 9) {
        return true
      }

      if (safariVersion.major > 0 && safariVersion.major < 14) {
        return true
      }
    }

    return false
  }

  /**
   * 判断是不是手机端
   */
  onJudgeIsPhone() {
    if (window.innerWidth <= 768) {
      return true
    }

    return navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('Android') > -1
  }

  /**
   * 页面大小重置
   */
  @action
  resize = (pageName: string = '') => {
    const dom = document.querySelector(`.${pageName || ''}`)
    if (!dom) return 0

    let totalHeight = dom.getBoundingClientRect().height
    // title
    const titleDom = document.querySelector('.page-title')
    let height = 0
    if (titleDom) {
      height += titleDom.getBoundingClientRect().height
    }

    // search
    const searchDom = document.querySelector('.page-search')
    if (searchDom) {
      height += searchDom.getBoundingClientRect().height
    }

    // pagination
    const paginationDom = document.querySelector('.page-pagination')
    if (paginationDom) {
      height += paginationDom.getBoundingClientRect().height
    }

    // table header
    const tableHeaderDom = document.querySelector('.ant-table-header')
    if (tableHeaderDom) {
      height += tableHeaderDom.getBoundingClientRect().height
    } else {
      height += 55 // 默认 55
    }

    let h = totalHeight - height
    if (h <= 0) {
      h = 0
    }

    return h
  }

  /**
   * 获取当前时间, 返回 YYYY/MM/DD HH:mm:ss 格式
   */
  @action
  getCurrentDate() {
    const formatter = new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    return formatter.format(new Date())
  }
}
