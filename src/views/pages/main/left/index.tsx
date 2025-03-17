/**
 * @fileOverview Chat Left
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@views/stores'
import { Menu } from 'antd'
import { useNavigate } from 'react-router'
import RouterUrls from '@route/router.url.toml'

const Left = (): ReactElement => {
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

  const render = () => {
    const list = homeStore.MENU_LIST || []
    return (
      <div className="left w-64 min-w-64 border-right">
        <div className="menus wh100 p-4">
          <Menu
            className="wh100 m-ant-menu"
            onClick={e => navigate(e.key)}
            items={generateMenuItems(list)}
            mode="inline"
            selectedKeys={homeStore.selectedMenuKeys}
            onSelect={({ selectedKeys }) => (homeStore.selectedMenuKeys = selectedKeys || [])}
            defaultOpenKeys={[RouterUrls.BASIC_DATA.PREFIX_URL]}
          />
        </div>
      </div>
    )
  }

  return render()
}

export default observer(Left)
