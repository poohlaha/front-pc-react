/**
 * @fileOverview layout
 * @date 2023-04-12
 * @author poohlaha
 */
import React, { ReactElement, useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router'
import { RouteInterface } from '@router/router.interface'
import NotFound from '@route/not-found'
import ScrollToTop from '@router/scrollToTop'
import { routes } from '@route/router'
import Loading from '../views/components/loading'
import Utils from '@views/utils/utils'
import { observer } from 'mobx-react-lite'
import { useStore } from '@views/stores'
import { CONSTANT } from '@config/index'
import '@assets/styles/common/tailwind.css'
import '@assets/styles/theme/index.less'
import RouterUrls from '@route/router.url.toml'

import '@ant-design/v5-patch-for-react-19'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

const { Suspense } = React

const RenderRoutes = (routes: RouteInterface[]) => {
  // 判断没用的路由, 跳转到404
  let usedRoutes: Array<RouteInterface> = []
  for (let router of routes) {
    if (!Utils.isBlank(router.path) || router.component !== null) {
      usedRoutes.push(router)
    }
  }

  if (usedRoutes.length > 0) {
    return (
      <Routes>
        {routes.map((route: RouteInterface, index: number) => {
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Suspense fallback={<Loading show />}>
                  <ScrollToTop />
                  <route.component routes={route.routes || []} />
                </Suspense>
              }
            ></Route>
          )
        })}

        <Route path="*" element={<Navigate to={RouterUrls.SYSTEM.NOT_FOUND_URL} />} />
      </Routes>
    )
  }
  return <Route element={<NotFound />} />
}

// 切换皮肤
const switchSkin = (skin: string = '') => {
  let classList = document.body.classList || []
  const remove = () => {
    if (skin === CONSTANT.SKINS[0]) {
      classList.remove(CONSTANT.SKINS[1])
    } else {
      classList.remove(CONSTANT.SKINS[0])
    }
  }

  remove()
  if (!classList.contains(skin)) {
    classList.add(skin)
  }
}

const Layout = (): ReactElement => {
  const { commonStore } = useStore()

  useEffect(() => {
    switchSkin(commonStore.skin)
  }, [commonStore.skin])

  const render = () => {
    return <ConfigProvider locale={zhCN}>{RenderRoutes(routes)}</ConfigProvider>
  }

  return render()
}

export default observer(Layout)
