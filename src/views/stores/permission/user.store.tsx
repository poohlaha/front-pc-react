/**
 * @fileOverview 用户管理 store
 * @date 2023-04-12
 * @author poohlaha
 */
import { action, observable } from 'mobx'
import BackUrls from '@route/router.back.toml'
import PermissionStore from '@stores/permission/permission.store'

class UserStore extends PermissionStore {
  // 列表
  @observable list: Array<{ [K: string]: any }> = []

  /**
   * 获取列表
   */
  @action
  async getList(callback?: Function) {
    this.loading = true
    return await this.send({
      url: BackUrls.PERMISSION.USER.LIST_URL,
      data: {
        limit: this.pageSize,
        page: this.currentPage
      },
      success: async (data: Array<{ [K: string]: any }> = [], res: { [K: string]: any } = {}) => {
        this.loading = false
        this.total = res.count || 0
        this.list = (data || []).map((item: { [K: string]: any } = {}, index: number = 0) => {
          return { ...item, key: `${index + 1}` }
        })
        callback?.()
      },
      fail: () => {
        this.loading = false
      }
    })
  }
}

export default new UserStore()
