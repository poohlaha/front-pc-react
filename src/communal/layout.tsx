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
import { useLocation } from 'react-router-dom'

import '@ant-design/v5-patch-for-react-19'
import { ConfigProvider } from 'antd'
import { px2remTransformer, StyleProvider } from '@ant-design/cssinjs'
import zhCN from 'antd/locale/zh_CN'
import useMount from '@hooks/useMount'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')

// 解决 Object.hasOwn 报错问题
if (!Object.hasOwn) {
  Object.hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)
}

const { Suspense } = React

const RenderRoutes = (routes: RouteInterface[]) => {
  const location = useLocation()

  // 判断没用的路由, 跳转到404
  let usedRoutes: Array<RouteInterface> = []
  for (let router of routes) {
    if (!Utils.isBlank(router.path) || router.component !== null) {
      usedRoutes.push(router)
    }
  }

  if (usedRoutes.length > 0) {
    return (
      <Routes location={location} key={location.key}>
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
const switchSkin = (skin: string = '', font: { [K: string]: any } = {}) => {
  /*
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
   */

  document.body.setAttribute('class', '')

  let className = `${font.fontFamily || ''} ${font.fontSize || ''} `
  // 跟随系统
  if (skin === CONSTANT.SKINS[2]) {
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    className += isSystemDark ? CONSTANT.SKINS[1] : CONSTANT.SKINS[0]
  } else {
    className += skin
  }

  document.body.setAttribute('class', className)
}

const Layout = (): ReactElement => {
  const { commonStore } = useStore()

  useEffect(() => {
    switchSkin(commonStore.skin, commonStore.font || {})
  }, [commonStore.skin, commonStore.font.fontFamily, commonStore.font.fontSize])

  useMount(() => {
    commonStore.onGetSkin()
  })

  const px2rem = px2remTransformer({
    rootValue: 16 // 32px = 1rem; @default 16
  })

  const render = () => {
    return (
      <StyleProvider transformers={[px2rem]}>
        <ConfigProvider locale={zhCN}>{RenderRoutes(routes)}</ConfigProvider>
      </StyleProvider>
    )
  }

  return render()
}

export default observer(Layout)
