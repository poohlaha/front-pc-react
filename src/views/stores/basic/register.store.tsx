/**
 * @fileOverview 注册用户 store
 * @date 2023-04-12
 * @author poohlaha
 */
import { action, observable } from 'mobx'
import BackUrls from '@route/router.back.toml'
import BasicStore from '@stores/basic/basic.store'
import Utils from '@views/utils/utils'
import { TOAST } from '@views/utils/base'
import dayjs from 'dayjs'

class RegisterStore extends BasicStore {
  // 列表
  @observable list: Array<{ [K: string]: any }> = []

  readonly DEFAULT_SEARCH_FORM: { [K: string]: any } = {
    account: '',
    startTime: dayjs().format(this.DATE_FORMAT),
    endTime: dayjs().format(this.DATE_FORMAT)
  }

  // 查询表单
  @observable searchForm: { [K: string]: any } = Utils.deepCopy(this.DEFAULT_SEARCH_FORM)

  /**
   * 获取列表
   */
  @action
  async getList(callback?: Function) {
    this.loading = true
    return await this.send({
      url: BackUrls.BASIC_DATA.REGISTER.LIST_URL,
      data: {
        limit: this.pageSize,
        page: this.currentPage,
        ...this.searchForm
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

  /**
   * 审核内容
   */
  @action
  async onApprove(
    id: string = '',
    approveStatus: string = '',
    words: Array<{ [K: string]: any }> = [],
    callback?: Function
  ) {
    this.loading = true
    return await this.send({
      url: BackUrls.BASIC_DATA.NRSH.APPROVE_URL,
      data: {
        id,
        approveStatus,
        words: JSON.stringify(words || '')
      },
      success: async () => {
        this.loading = false
        TOAST.show({ message: '审核成功', type: 2 })
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
    this.list = []
    this.searchForm = Utils.deepCopy(this.DEFAULT_SEARCH_FORM)
  }
}

export default new RegisterStore()
