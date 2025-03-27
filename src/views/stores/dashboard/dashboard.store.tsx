/**
 * @fileOverview 注册用户 store
 * @date 2023-04-12
 * @author poohlaha
 */
import { action, observable } from 'mobx'
import BackUrls from '@route/router.back.toml'
import BaseStore from '@stores/base/base.store'
import Utils from '@views/utils/utils'

class DashboardStore extends BaseStore {
  // 列表
  @observable detailInfo: { [K: string]: any } = {}

  /**
   * 获取详情
   */
  @action
  async getDetailInfo(callback?: Function) {
    this.loading = true
    return await this.send({
      url: BackUrls.DASHBOARD.DETAIL_URL,
      data: {},
      success: async (res: { [K: string]: any } = {}) => {
        this.loading = false
        this.detailInfo = res || {}
        const last7Counts = res.last7Counts || {}
        let subTitle = ''
        if (!Utils.isObjectNull(last7Counts)) {
          const keys = Object.keys(last7Counts)
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i] || ''
            if (i === 0) {
              subTitle += `${key} ~ `
            }

            if (i === keys.length - 1) {
              subTitle += key
            }
          }
        }
        this.detailInfo.subTitle = subTitle || ''
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
    this.detailInfo = {}
  }
}

export default new DashboardStore()
