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

  constructor() {
    this.init()
  }

  @action
  init() {
    const skin = Utils.getLocal(SYSTEM.SKIN_TOKEN_NAME) || ''
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

    Utils.setLocal(SYSTEM.SKIN_TOKEN_NAME, this.skin)
  }
}

export default new CommonStore()
