/**
 * @fileOverview Chat Left
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@views/stores'
import { Dropdown, Menu, MenuProps } from 'antd'
import { useNavigate } from 'react-router'
import RouterUrls from '@route/router.url.toml'
import Utils from '@views/utils/utils'
import LogoPng from '@assets/images/logo.png'
import AvatarPng from '@assets/images/avatar.png'

interface ILeftProps {
  userName: string
  onHome: () => void
  onUpdatePwd: () => void
  onLogout: () => void
}

const Left = (props: ILeftProps): ReactElement => {
  const { homeStore } = useStore()
  const navigate = useNavigate()

  // 递归生成子菜单
  const generateMenuItems = (menuList: Array<{ [K: string]: any }> = [], parentPath: string = ''): Array<any> => {
    return menuList.map((menu: { [K: string]: any } = {}) => {
      const fullPath = parentPath + (menu.url || '')
      if (menu.children) {
        return {
          key: fullPath,
          label: menu.label,
          icon: menu.icon,
          children: generateMenuItems(menu.children, fullPath)
        }
      }

      return {
        key: fullPath,
        label: menu.label,
        icon: menu.icon
      }
    })
  }

  const getMenuItems = (): MenuProps['items'] => {
    return [
      {
        key: Utils.generateUUID(),
        label: <p onClick={props.onUpdatePwd}>修改密码</p>
      },
      {
        key: Utils.generateUUID(),
        label: <p onClick={props.onLogout}>退出登录</p>
      }
    ]
  }

  const render = () => {
    const list = homeStore.MENU_LIST || []
    return (
      <div className="left w-64 min-w-64 border-right flex-direction-column">
        {/* LOGO */}
        <div className="navigation-left w100 p-4 flex-center">
          <img src={LogoPng} className="logo cursor-pointer w-10 h-8" alt="" onClick={props.onHome} />
        </div>

        <div className="menus w100 flex-1 p-4 overflow-y-auto">
          <Menu
            className="wh100 m-ant-menu"
            onClick={e => navigate(e.key)}
            items={generateMenuItems(list)}
            mode="inline"
            selectedKeys={homeStore.selectedMenuKeys}
            onSelect={({ selectedKeys }) => (homeStore.selectedMenuKeys = selectedKeys || [])}
            defaultOpenKeys={[RouterUrls.BASIC_DATA.PREFIX_URL, RouterUrls.PERMISSION.PREFIX_URL]}
          />
        </div>

        <div className="person-info p-4 border-top">
          <Dropdown menu={{ items: getMenuItems() }} placement="top" trigger={['click']} arrow>
            <div className="navigation-item h-10 hover:rounded-lg cursor-pointer flex items-center text-sm">
              <img src={AvatarPng} className="avatar mr-2 w-8 h-8" />
              <p>Hello, {props.userName || ''}</p>
            </div>
          </Dropdown>
        </div>
      </div>
    )
  }

  return render()
}

export default observer(Left)
