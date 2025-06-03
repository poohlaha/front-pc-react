/**
 * @fileOverview main store
 * @date 2023-04-12
 * @author poohlaha
 */
import { action, observable } from 'mobx'
import BaseStore from '@stores/base/base.store'
import RouterUrls from '@route/router.url.toml'
import React, { lazy } from 'react'
import { AppstoreOutlined, SettingOutlined, DotChartOutlined } from '@ant-design/icons'
import BackUrls from '@route/router.back.toml'
import { ADDRESS, TOAST } from '@views/utils/base'
import Utils from '@views/utils/utils'

class MainStore extends BaseStore {
  // 用户信息
  @observable userInfo: { [K: string]: any } = {}

  readonly UPDATE_PWD_FORM: { [K: string]: any } = {
    oldPassword: '',
    password: '',
    againPassword: ''
  }

  // 修改密码
  @observable updatePwdForm: { [K: string]: any } = Utils.deepCopy(this.UPDATE_PWD_FORM)

  // 选中的菜单
  @observable selectedMenuKeys: Array<string> = []

  readonly MENU_LIST = [
    {
      key: RouterUrls.DASHBOARD.URL,
      label: RouterUrls.DASHBOARD.NAME,
      url: RouterUrls.DASHBOARD.URL,
      icon: <DotChartOutlined />,
      component: lazy(() => import(/* webpackChunkName:'dashboard' */ '@views/pages/sample/dashboard'))
    },
    {
      key: RouterUrls.BASIC_DATA.PREFIX_URL,
      label: RouterUrls.BASIC_DATA.NAME,
      url: RouterUrls.BASIC_DATA.PREFIX_URL,
      icon: <AppstoreOutlined />,
      children: [
        {
          key: RouterUrls.BASIC_DATA.REGISTER.URL,
          label: RouterUrls.BASIC_DATA.REGISTER.NAME,
          url: RouterUrls.BASIC_DATA.REGISTER.URL,
          component: lazy(() => import(/* webpackChunkName:'register' */ '@views/pages/sample/basic/register'))
        }
      ]
    },
    {
      key: RouterUrls.PERMISSION.PREFIX_URL,
      label: RouterUrls.PERMISSION.NAME,
      url: RouterUrls.PERMISSION.PREFIX_URL,
      icon: <SettingOutlined />,
      children: [
        {
          key: RouterUrls.PERMISSION.USER.URL,
          label: RouterUrls.PERMISSION.USER.NAME,
          url: RouterUrls.PERMISSION.USER.URL,
          component: lazy(() => import(/* webpackChunkName:'user' */ '@views/pages/sample/permission/user'))
        },
        {
          key: RouterUrls.PERMISSION.ROLE.URL,
          label: RouterUrls.PERMISSION.ROLE.NAME,
          url: RouterUrls.PERMISSION.ROLE.URL,
          component: lazy(() => import(/* webpackChunkName:'role' */ '@views/pages/sample/permission/role'))
        }
      ]
    }
  ]

  /**
   * 获取选中的菜单
   */
  @action
  getSelectedKeysByUrl() {
    const list = this.MENU_LIST || []
    if (list.length === 0) return []

    let { addressUrl } = ADDRESS.getAddress()
    console.log('addressUrl', addressUrl)

    // dashboard
    if (addressUrl === '/' || Utils.isBlank(addressUrl || '')) {
      this.selectedMenuKeys = ['/']
      return
    }

    // 如果有三层 /, 去掉最后一层
    if (addressUrl.endsWith('/')) {
      addressUrl = addressUrl.substring(0, addressUrl.length - 1)
    }

    let moreSplit = addressUrl.split('/').filter(Boolean).length > 2
    let path = addressUrl
    if (moreSplit) {
      path = addressUrl.substring(0, addressUrl.lastIndexOf('/'))
    }

    this.selectedMenuKeys.push(path)
  }

  /**
   * 修改密码表单校验
   */
  @action
  onValidateUpdateForm() {
    if (Utils.isBlank(this.updatePwdForm.oldPassword || '')) {
      TOAST.show({ message: '请输入原密码', type: 4 })
      return false
    }

    if (Utils.isBlank(this.updatePwdForm.password || '')) {
      TOAST.show({ message: '请输入新密码', type: 4 })
      return false
    }

    if (Utils.isBlank(this.updatePwdForm.againPassword || '')) {
      TOAST.show({ message: '请输入确认密码', type: 4 })
      return false
    }

    return true
  }

  /**
   * 修改密码
   */
  @action
  async onUpdatePwd(callback?: Function) {
    if (!this.onValidateUpdateForm()) return

    this.loading = true
    await this.send({
      url: BackUrls.HOME.UPDATE_URL,
      data: {
        oldPassword: this.sm2Encrypt(this.updatePwdForm.oldPassword || ''),
        password: this.sm2Encrypt(this.updatePwdForm.password || '')
      },
      success: async () => {
        this.loading = false
        TOAST.show({ message: '修改密码成功', type: 2 })
        callback?.()
      },
      fail: () => {
        this.loading = false
      }
    })
  }

  /**
   * 重置数据
   */
  @action
  onReset() {
    this.selectedMenuKeys = []
    this.userInfo = {}
    this.updatePwdForm = Utils.deepCopy(this.UPDATE_PWD_FORM)
  }
}

export default new MainStore()
