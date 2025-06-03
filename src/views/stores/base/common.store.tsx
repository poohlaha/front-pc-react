/**
 * @fileOverview common store
 * @date 2023-04-12
 * @author poohlaha
 */
import { CONSTANT, SYSTEM } from '@config/index'
import Utils from '@views/utils/utils'
import { action, observable } from 'mobx'

class CommonStore {
  @observable skin = CONSTANT.SKINS[0] // 皮肤
  @observable language = CONSTANT.LANGUAGES[0] // 语言

  readonly FONT_FAMILY_LIST: Array<{ [K: string]: any }> = [
    {
      label: 'PingFangSC-Regular',
      value: 'PingFangSC-Regular'
    },
    {
      label: 'PingFang SC',
      value: 'PingFangSC'
    }
  ]

  readonly FONT_LIST: Array<any> = [
    {
      label: 'text-xs',
      value: 'text-xs',
      desc1: 'font-size: 0.75rem(12px)',
      desc2: 'line-height: 1rem(16px)'
    },
    {
      label: 'text-sm',
      value: 'text-sm',
      desc1: 'font-size: 0.875rem(14px)',
      desc2: 'line-height: 1.25rem(20px)'
    },
    {
      label: 'text-base',
      value: 'text-base',
      desc1: 'font-size: 1rem(16px)',
      desc2: 'line-height: 1.5rem(24px)'
    },
    {
      label: 'text-lg',
      value: 'text-lg',
      desc1: 'font-size: 1.125rem(18px)',
      desc2: 'line-height: 1.75rem(28px)'
    },
    {
      label: 'text-xl',
      value: 'text-xl',
      desc1: 'font-size: 1.25rem(20px)',
      desc2: 'line-height: 1.75rem(28px)'
    },
    {
      label: 'text-2xl',
      value: 'text-2xl',
      desc1: 'font-size: 1.5rem(24px)',
      desc2: 'line-height: 2rem(32px)'
    }
  ]

  readonly DEFAULT_FONT = {
    titleFontSize: 'text-xl',
    fontSize: 'text-sm',
    descFontSize: 'text-xs',
    fontFamily: this.FONT_FAMILY_LIST[0].value
  }

  @observable font: { [K: string]: any } = Utils.deepCopy(this.DEFAULT_FONT)

  constructor() {
    this.init()
  }

  @action
  init() {
    const skin = Utils.getLocal(SYSTEM.THEME_NAME) || ''
    if (!Utils.isBlank(skin)) {
      this.skin = skin || ''
    }
  }

  /**
   * 切换皮肤
   * @param index
   */
  @action
  onSkinChange(index: number = -1) {
    if (index === -1) {
      this.skin = this.skin === CONSTANT.SKINS[1] ? CONSTANT.SKINS[0] : CONSTANT.SKINS[1]
    } else {
      this.skin = CONSTANT.SKINS[index]
    }

    Utils.setLocal(SYSTEM.THEME_NAME, this.skin)
  }

  /**
   * 获取皮肤
   */
  onGetSkin() {
    let skin = Utils.getLocal(SYSTEM.THEME_NAME) || ''
    if (Utils.isBlank(skin || '')) {
      skin = CONSTANT.SKINS[0]
    }

    this.skin = skin
  }

  /**
   * 判断是不是黑色
   */
  onJudgeDark() {
    return this.skin === CONSTANT.SKINS[1]
  }
}

export default new CommonStore()
