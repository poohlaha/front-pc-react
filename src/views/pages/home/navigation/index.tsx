/**
 * @fileOverview Navigation
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import Logo from '@assets/images/logo.png'
import { useStore } from '@views/stores'
import { USER } from '@utils/base'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import RouterUrls from '@route/router.url.toml'

const Navigation = (): ReactElement => {
  const { homeStore, loginStore } = useStore()
  const navigate = useNavigate()

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <p>忘记密码</p>,
    },
    {
      key: '2',
      label: (
        <p
          onClick={async () => {
            await loginStore.onLogout()
            navigate(RouterUrls.SYSTEM.LOGIN_URL)
            await loginStore.getVerificationCode()
          }}
        >
          退出登录
        </p>
      ),
    },
  ]

  const render = () => {
    let userInfo = USER.getUserInfo() || {}
    console.log('user', userInfo)
    return (
      <div className="navigation wh100 flex">
        <div className="navigation-left flex-1 flex-align-center">
          <img src={Logo} className="logo" />
        </div>

        <div className="navigation-right flex-align-center">
          <Dropdown menu={{ items }} placement="bottom" arrow>
            <p className="cursor-pointer">Hello, {userInfo.userName || ''}</p>
          </Dropdown>
        </div>
      </div>
    )
  }

  return render()
}

export default observer(Navigation)
