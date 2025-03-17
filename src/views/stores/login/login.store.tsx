/**
 * @fileOverview login store
 * @date 2023-04-12
 * @author poohlaha
 */
import { action, observable } from 'mobx'
import BaseStore from '@stores/base/base.store'
import BackUrls from '@route/router.back.toml'
import { TOAST, USER } from '@utils/base'
import Utils from '@utils/utils'

class LoginStore extends BaseStore {
  // 图形验证码
  @observable graphicImage: string = ''
  @observable graphicImageId: string = ''

  // 登录表单
  @observable form: { [K: string]: any } = {
    loginName: '',
    password: '',
    captchaCode: ''
  }

  // 是否加载图形验证码
  @observable isLoadingImage: boolean = false

  /**
   * 校验
   */
  @action
  onValidate() {
    if (Utils.isObjectNull(this.form || {})) return false

    if (Utils.isBlank(this.form.loginName || '')) {
      TOAST.show({ message: '工号不能为空', type: 4 })
      return false
    }

    if (Utils.isBlank(this.form.password || '')) {
      TOAST.show({ message: '密码不能为空', type: 4 })
      return false
    }

    if (Utils.isBlank(this.form.captchaCode || '')) {
      TOAST.show({ message: '图形验证码不能为空', type: 4 })
      return false
    }

    return true
  }

  /**
   * 登录
   */
  @action
  async onLogin(callback?: Function, failed?: Function) {
    if (!this.onValidate()) return

    this.loading = true
    return await this.send({
      url: BackUrls.LOGIN.LOGIN_URL,
      isLogin: true,
      data: {
        loginName: this.sm2Encrypt(this.form.loginName || ''),
        password: this.sm2Encrypt(this.form.password || ''),
        validImgId: this.graphicImageId || '',
        captchaCode: this.form.captchaCode || ''
      },
      success: async (res: { [K: string]: any } = {}) => {
        this.loading = false
        TOAST.show({ message: '登录成功', type: 2 })
        USER.clearUserInfo()
        USER.setUserInfo(res || {})
        callback?.()
      },
      fail: () => {
        this.loading = false
        this.getVerificationCode()
        failed?.()
      }
    })
  }

  /**
   * 登出
   */
  @action
  async onLogout(callback?: Function) {
    await this.send({
      url: BackUrls.LOGIN.LOGOUT_URL,
      data: {
        mobile: (USER.getUserInfo() || {}).mobile || ''
      },
      success: async (_: { [K: string]: any } = {}) => {
        TOAST.show({ message: '登出成功', type: 2 })
        this.onClear()
        callback?.()
      },
      fail: () => {}
    })
  }

  /**
   * 获取验证码
   */
  @action
  async getVerificationCode(callback?: Function) {
    this.isLoadingImage = true
    await this.send({
      url: BackUrls.LOGIN.GET_VERIFICATION_URL,
      data: {},
      success: async (data: { [K: string]: any } = {}) => {
        this.isLoadingImage = false
        this.graphicImage = `data:image/jpeg;base64,${data.validImg}`
        this.graphicImageId = data.validImgId || ''
        callback?.()
      },
      fail: () => {
        this.isLoadingImage = false
      }
    })
  }

  @action
  onResetGraphic() {
    this.graphicImage = ''
    this.graphicImageId = ''
  }

  @action
  onClear() {
    USER.clearUserInfo()
  }

  @action
  onReset() {
    this.form = {
      loginName: '',
      password: '',
      captchaCode: ''
    }
  }
}

export default new LoginStore()
