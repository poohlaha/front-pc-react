/**
 * @fileOverview Navigation
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import LogoPng from '@assets/images/logo.png'
import { Dropdown, MenuProps } from 'antd'
import Utils from '@views/utils/utils'

interface INavigationProps {
  onUpdatePwd: () => void
  onLogout: () => void
  onHome: () => void
  userName: string
}

const Navigation = (props: INavigationProps): ReactElement => {
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
    return (
      <div className="navigation flex-align-center border-bottom h-12 pl-8 pr-8">
        {/* logo */}
        <div className="navigation-left flex-1">
          <img src={LogoPng} className="logo cursor-pointer" alt="" onClick={props.onHome} />
        </div>

        <div className="navigation-right">
          {!Utils.isBlank(props.userName || '') && (
            <Dropdown menu={{ items: getMenuItems() }} placement="bottom" trigger={['click']} arrow>
              <p className="cursor-pointer text-sm">Hello, {props.userName || ''}</p>
            </Dropdown>
          )}
        </div>
      </div>
    )
  }

  return render()
}

export default observer(Navigation)
