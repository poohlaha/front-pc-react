/**
 * @fileOverview Home
 * @date 2023-04-12
 * @author poohlaha
 */
import React, { ReactElement, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import useMount from '@hooks/useMount'
import Navigation from '@pages/home/navigation'
import Left from '@pages/home/left'
import Right from '@pages/home/right'
import Utils from '@utils/utils'

const Home: React.FC = (): ReactElement => {
  const { homeStore } = useStore()

  useMount(async () => {
    // await homeStore.getList()
  })

  useEffect(() => {
    // 浏览器手势前进和后退, 需要重新选中菜单
    let expandKeys = Utils.deepCopy(homeStore.menuOperate.expandKeys || [])
    homeStore.init()
    if (expandKeys.length > 0) {
      let newExpandKeys = Utils.deepCopy(homeStore.menuOperate.expandKeys || [])
      if (newExpandKeys.length > 0) {
        let expandKey = newExpandKeys[0] || ''
        if (expandKeys.indexOf(expandKey) === -1) {
          expandKeys.push(expandKey)
        }
      }

      homeStore.menuOperate.expandKeys = expandKeys
    }
  }, [location.pathname])

  const render = () => (
    <div className="home-page wh100 flex-direction-column overflow-hidden">
      {/* 导航栏 */}
      <Navigation />

      <div className="content-wrapper wh100 flex overflow-hidden">
        <Left />
        <Right />
      </div>
    </div>
  )

  return render()
}

export default observer(Home)
