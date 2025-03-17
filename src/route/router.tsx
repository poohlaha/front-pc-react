/**
 * @fileOverview route
 * @date 2023-04-13
 * @author poohlaha
 */
import React from 'react'
import { RouteInterface } from '@router/router.interface'
import RouterUrls from '@route/router.url.toml'
const { lazy } = React

export const routes: RouteInterface[] = [
  {
    path: '/',
    exact: true,
    component: lazy(() => import(/* webpackChunkName:'home' */ '@pages/main/index')),
    name: 'home',
    auth: false,
    title: '首页'
  },
  {
    path: `${RouterUrls.SYSTEM.HOME_URL}/*`,
    component: lazy(() => import(/* webpackChunkName:'home' */ '@pages/main/index')),
    exact: true,
    name: 'home',
    title: '首页',
    auth: false
  },
  {
    path: RouterUrls.SYSTEM.LOGIN_URL,
    component: lazy(() => import(/* webpackChunkName:'login' */ '@pages/login/index')),
    exact: true,
    name: 'login',
    title: '登录',
    auth: false
  },
  {
    path: RouterUrls.SYSTEM.NOT_FOUND_URL,
    component: lazy(() => import(/* webpackChunkName:'notfound' */ '@route/not-found/index')),
    exact: true,
    name: 'notFound',
    title: '页面不存在',
    auth: false
  }
]
