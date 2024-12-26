/**
 * @fileOverview login store
 * @date 2023-04-12
 * @author poohlaha
 */
import { action } from 'mobx'
import BaseStore from '@stores/base/base.store'

class LoginStore extends BaseStore {
  /**
   * 登录
   */
  @action
  async onLogin() {}

  /**
   * 登出
   */
  @action
  async onLogout() {}

  /**
   * 获取验证码
   */
  @action
  async getVerificationCode() {}
}

export default new LoginStore()
