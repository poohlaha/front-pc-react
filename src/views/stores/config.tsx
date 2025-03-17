/**
 * @fileOverview store
 * @date 2023-04-12
 * @author poohlaha
 */
import commonStore from './base/common.store'
import loginStore from './login/login.store'
import homeStore from './home/home.store'
import registerStore from './basic/register.store'
import userStore from './permission/user.store'
import roleStore from './permission/role.store'
import dashboardStore from './dashboard/dashboard.store'

export function createStore() {
  return {
    commonStore,
    loginStore,
    homeStore,
    registerStore,
    userStore,
    roleStore,
    dashboardStore
  }
}

export const store = createStore()
export type Stores = ReturnType<typeof createStore>
