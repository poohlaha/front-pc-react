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
    component: lazy(() => import(/* webpackChunkName:'lazy' */ '@pages/home/index')),
    name: 'home',
    auth: false,
    title: '首页',
  },
  {
    path: RouterUrls.SYSTEM.LOGIN_URL,
    component: lazy(() => import(/* webpackChunkName:'lazy' */ '@pages/login/index')),
    exact: true,
    name: 'login',
    title: '登录',
    auth: false,
  },
  {
    path: `${RouterUrls.SYSTEM.HOME_URL}/*`,
    component: lazy(() => import(/* webpackChunkName:'lazy' */ '@pages/home/index')),
    exact: true,
    name: 'home',
    title: '首页',
    auth: false,
  },
  {
    path: RouterUrls.SYSTEM.NOT_FOUND_URL,
    component: lazy(() => import(/* webpackChunkName:'notfound' */ '@route/not-found/index')),
    exact: true,
    name: 'forward',
    title: '页面发转',
    auth: false,
  },
]
