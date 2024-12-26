/**
 * @fileOverview store
 * @date 2023-04-12
 * @author poohlaha
 */
import commonStore from './base/common.store'
import loginStore from './login/login.store'
import homeStore from './home/home.store'

export function createStore() {
  return {
    commonStore,
    loginStore,
    homeStore
  }
}

export const store = createStore()
export type Stores = ReturnType<typeof createStore>
