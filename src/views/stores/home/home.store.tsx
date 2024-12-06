/**
 * @fileOverview common store
 * @date 2023-04-12
 * @author poohlaha
 */
import { observable, action } from 'mobx'
import { CONSTANT } from '@config/index'
import BaseStore from '@stores/base/base.store'
import RouterUrls from '@route/router.url.toml'
import { lazy } from 'react'
import Utils from '@utils/utils'
import BackUrls from '@route/router.back.toml'
import { ADDRESS } from '@utils/base'
import { HttpRequest } from '@bale-web/request'

class HomeStore extends BaseStore {
  // 菜单列表, 对应关系
  readonly MENUS: Array<{ [K: string]: any }> = [
    {
      key: 'menu1',
      label: '菜单一',
      icon: null,
      children: [
        {
          key: 'menu1-sub-1',
          label: '子菜单一',
          url: RouterUrls.MENU1.URL,
          component: lazy(() => import(/* webpackChunkName:'menu1' */ '@pages/menu1/index')),
          childs: [], // 详情页面等子页面
        },
        {
          key: 'menu1-sub-2',
          label: '子菜单二',
          url: RouterUrls.MENU2.URL,
          component: lazy(() => import(/* webpackChunkName:'menu2' */ '@pages/menu2/index')),
          childs: [], // 详情页面等子页面
        },
      ],
    },
  ]

  // 动态菜单列表
  @observable menuList: Array<{ [K: string]: any }> = this.MENUS

  // 菜单操作
  @observable menuOperate: { [K: string]: any } = {
    expandKeys: [],
    activeKey: '',
  }

  // 数据
  @observable data: any = {}

  /**
   * 初始化
   */
  @action
  init() {
    this.menuOperate = {
      expandKeys: [],
      activeKey: '',
    }

    let { addressUrl } = ADDRESS.getAddress()
    console.log('addressUrl', addressUrl)
    if (
      Utils.isBlank(addressUrl) ||
      addressUrl === '/' ||
      addressUrl === RouterUrls.SYSTEM.HOME_URL ||
      addressUrl === RouterUrls.SYSTEM.NO_PERMISSION_URL
    ) {
      this.menuOperate.expandKeys = []
      this.menuOperate.activeKey = ''
      return
    }

    let index = addressUrl.indexOf('?')
    if (index !== -1) {
      addressUrl = addressUrl.substring(0, index)
    }

    let homeUrl = RouterUrls.SYSTEM.HOME_URL
    if (addressUrl.startsWith(homeUrl)) {
      addressUrl = addressUrl.substring(homeUrl.length, addressUrl.length)
    }

    let menus = this.menuList || []
    if (menus.length === 0) {
      return
    }

    const getNextPageParent = (addressUrl: string) => {
      let child: { [K: string]: any } = []
      for (let menu of this.MENUS) {
        let menuChildren = menu.children || []

        for (let menuChild of menuChildren) {
          let c = (menuChild.childs || []).find((c: { [K: string]: any } = {}) => c.url === addressUrl) || {}
          if (!Utils.isObjectNull(c || {})) {
            return menuChild
          }
        }
      }

      return child
    }
    let permissions: Array<string> = []
    menus.forEach((menu: { [K: string]: any }) => {
      let children = menu.children || []
      children.forEach((child: { [K: string]: any }) => {
        let childs = child.children || []
        childs = childs.filter((menu: { [K: string]: any }) => (menu.url || '').trim() !== '#') || []

        if (!Utils.isBlank(child.url || '')) {
          if (child.url === addressUrl) {
            this.menuOperate.expandKeys = [menu.key]
            this.menuOperate.activeKey = child.key || ''
          }
        }

        if (childs.length > 0) {
          childs.forEach((c: { [K: string]: any }) => {
            if (!Utils.isBlank(c.url || '')) {
              if (c.url === addressUrl) {
                this.menuOperate.expandKeys = [menu.key]
                this.menuOperate.activeKey = child.key || ''
              }
            }
          })
        }
      })
    })

    // 二级页面
    if (Utils.isBlank(`${this.menuOperate.activeKey || ''}`)) {
      let nextPageParent = getNextPageParent(addressUrl || '') || {}
      if (!Utils.isObjectNull(nextPageParent) && !Utils.isBlank(nextPageParent.url || '')) {
        // 通过 url 反向查找 menus
        menus.forEach((menu: { [K: string]: any } = {}) => {
          let children = menu.children || []
          let obj = children.find((child: { [K: string]: any } = {}) => child.url === nextPageParent.url) || {}
          if (!Utils.isObjectNull(obj)) {
            this.menuOperate.expandKeys = [menu.key]
            this.menuOperate.activeKey = obj.key || ''
          }
        })
      }
    }
  }

  /**
   * 动态获取菜单
   */
  @action
  async getMenuList() {
    this.loading = true
    return await this.send({
      url: BackUrls.HOME.GET_MENU_LIST,
      data: {},
      success: async (data: Array<{ [K: string]: any }> = [], res: { [K: string]: any } = {}) => {
        this.loading = false
        this.menuList = data || []
      },
      fail: () => {
        this.loading = false
      },
    })
  }

  /**
   * 获取菜单路由
   */
  @action
  getMenuRoutes(key: string = '') {
    let needFind = !Utils.isBlank(key)
    let menus = this.MENUS || []
    if (menus.length === 0) {
      return needFind ? {} : []
    }

    let routes: Array<{ [K: string]: any }> = []
    let obj: { [K: string]: any } = {}
    menus.forEach((menu: { [K: string]: any }) => {
      let children = menu.children || []
      children.forEach((child: { [K: string]: any }) => {
        if (!Utils.isBlank(child.url || '') && child.component) {
          routes.push({
            path: child.url || '',
            component: child.component || null,
          })
        }

        let childs = child.childs || []
        childs.forEach((c: { [K: string]: any }) => {
          if (!Utils.isBlank(c.url || '') && c.component) {
            routes.push({
              path: c.url || '',
              component: c.component || null,
            })
          }
        })

        if (needFind) {
          if (child.key === key) {
            if (!Utils.isBlank(child.url || '') && child.component) {
              obj = {
                path: child.url || '',
                component: child.component || null,
              }
            }
          }
        }
      })
    })

    return needFind ? obj : routes
  }

  /**
   * 获取数据
   */
  @action
  async getList() {
    this.loading = true
    const headers = {
      Accept: 'application/vnd.github.v3+json',
    }
    return await this.send(
      {
        url: BackUrls.HOME.GET_DATA,
        data: {},
        method: 'GET',
        success: async (data: { [K: string]: any } = {}, res: { [K: string]: any } = {}) => {
          this.loading = false
          this.data = data || {}
        },
        fail: () => {
          this.loading = false
        },
      },
      true,
      headers
    )
  }

  /**
   * 直接获取数据
   */
  @action
  async getData() {
    this.loading = true
    let opts = {
      url: 'https://api.github.com/repos/rustwasm/wasm-bindgen/branches/master',
      method: 'get',
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
      type: '0',
      responseType: '0',
      timeout: 10,
      success: (response: { [K: string]: any } = {}) => {
        console.log('success: ', response)
        this.loading = false
        this.data = response.body || {}
      },
      failed: (response: { [K: string]: any } = {}) => {
        console.error('failed: ', response)
        this.loading = false
      },
    }

    return await HttpRequest.send(opts)
  }

  /**
   * 批量获取数据
   */
  @action
  async getBatchData() {
    this.loading = true
    await this.batchSend([
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async resolve => {
        const res = await this.getData()
        resolve(res)
      }),
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async resolve => {
        const res = await this.getData()
        resolve(res)
      }),
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async resolve => {
        const res = await this.getData()
        resolve(res)
      }),
    ])

    this.loading = false
  }
}

export default new HomeStore()
