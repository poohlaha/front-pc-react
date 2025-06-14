/**
 * @fileOverview Home Right
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement, Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import { Route, Routes } from 'react-router'
import Loading from '@views/components/loading/loading'
import ScrollToTop from '@router/scrollToTop'
import { useStore } from '@views/stores'
import Dashboard from '@pages/sample/dashboard'

const Right = (): ReactElement => {
  const { mainStore } = useStore()

  const getRoutes = () => {
    const menuList = mainStore.MENU_LIST || []
    if (menuList.length === 0) return []

    const generateRoutes = (menuList: any[], parentPath: string = '') => {
      return menuList.flatMap((route: { [K: string]: any } = {}) => {
        if (!route.component && (route.children || []).length === 0) {
          console.warn(`⚠️ 组件未定义: ${route.key} (path: ${route.url})`)
          return []
        }

        let routeList: any[] = []
        const fullPath = `${parentPath}${route.url}`
        if (route.component) {
          routeList.push(
            <Route
              key={route.key}
              path={fullPath}
              element={
                <Suspense fallback={<Loading show />}>
                  <ScrollToTop />
                  <route.component />
                </Suspense>
              }
            />
          )
        }

        // 处理子菜单
        if (route.children) {
          routeList = [...routeList, ...generateRoutes(route.children || [], fullPath)]
        }

        // 处理详情页
        /*
        if (route.url) {
          routeList.push(
            <Route
              key={`${fullPath}-details`}
              path={`${fullPath}/:id`}
              element={
                <Suspense fallback={<Loading show />}>
                  <ScrollToTop />
                  <route.component />
                </Suspense>
              }
            />
          )
        }
         */

        return routeList
      })
    }

    let routeList = generateRoutes(menuList) || []

    // 添加 dashboard
    routeList.push(
      <Route
        key="dashboard"
        path="/"
        element={
          <Suspense fallback={<Loading show />}>
            <ScrollToTop />
            <Dashboard />
          </Suspense>
        }
      />
    )

    console.log('routes:', routeList)
    return <Routes>{routeList}</Routes>
  }

  const render = () => {
    return (
      <div className="right bg-right overflow-x-auto bg-white flex-1 w100 position-relative flex-jsc-center">
        {getRoutes()}
      </div>
    )
  }

  return render()
}

export default observer(Right)
