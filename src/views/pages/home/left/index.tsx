/**
 * @fileOverview Home Left
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@views/stores'
import Utils from '@utils/utils'
import { useNavigate } from 'react-router-dom'
import RouterUrls from '@route/router.url.toml'

const Left: React.FC<IRouterProps> = (): ReactElement => {
  const { homeStore } = useStore()
  const navigate = useNavigate()

  const render = () => {
    return (
      <div className="left wh100">
        <div className="menus wh100">
          {homeStore.menuList.map((menu: { [K: string]: any } = {}) => {
            let children = menu.children || []
            let icon = menu.icon || null

            return (
              <div className="menu-item" key={menu.key}>
                <div
                  className={`menu wh100 flex-align-center ${
                    homeStore.menuOperate.activeKey === menu.key ? 'active' : ''
                  }`}
                  onClick={() => {
                    if (children.length === 0) {
                      homeStore.menuOperate.activeKey = menu.key
                      return
                    }

                    let keys = Utils.deepCopy(homeStore.menuOperate.expandKeys) || []
                    if (keys.indexOf(menu.key) === -1) {
                      keys.push(menu.key)
                      homeStore.menuOperate.expandKeys = keys
                    } else {
                      homeStore.menuOperate.expandKeys =
                        keys.filter((key: string) => {
                          return key !== menu.key
                        }) || []
                    }

                    if (!Utils.isBlank(menu.url)) {
                      navigate(`${RouterUrls.SYSTEM.HOME_URL}${menu.url}`)
                    }
                  }}
                >
                  <div className="menu-left flex-1 flex-align-center">
                    {/* icon */}
                    {icon && <div className="svg-box flex-center">{icon}</div>}

                    {/* text */}
                    <div className="text">{menu.label || ''}</div>
                  </div>

                  {/* 箭头 */}
                  {children.length > 0 && (
                    <div
                      className={`svg-box arrow-svg flex-center ${
                        homeStore.menuOperate.expandKeys.indexOf(menu.key) !== -1 ? 'rotate' : ''
                      }`}
                    >
                      <svg
                        className="svg-icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M948.560332 281.179984c-13.765515-13.833053-36.127825-13.833053-49.89334 0L511.991302 668.591431 125.313565 281.179984c-13.763468-13.798261-36.093033-13.798261-49.856501 0-13.799284 13.798261-13.799284 36.161594 0 49.993624l410.857439 411.674037c7.067976 7.085372 16.402575 10.521634 25.675776 10.331299 9.274224 0.191358 18.608823-3.245927 25.677822-10.331299l410.891208-411.708829c6.863315-6.89913 10.331299-15.940041 10.331299-24.979928S955.423647 288.078091 948.560332 281.179984z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {children.length > 0 &&
                  homeStore.menuOperate.expandKeys.length > 0 &&
                  homeStore.menuOperate.expandKeys.indexOf(menu.key) !== -1 && (
                    <div className="submenu">
                      {children.map((child: { [K: string]: any } = {}) => {
                        return (
                          <div
                            className={`submenu-item flex-align-center ${
                              homeStore.menuOperate.activeKey === child.key ? 'active' : ''
                            }`}
                            key={child.key}
                            onClick={async () => {
                              homeStore.menuOperate.activeKey = child.key
                              let keys = Utils.deepCopy(homeStore.menuOperate.expandKeys) || []
                              if (keys.indexOf(menu.key) === -1) {
                                keys.push(menu.key)
                                homeStore.menuOperate.expandKeys = keys
                              }

                              if (!Utils.isBlank(child.url)) {
                                navigate(`${RouterUrls.SYSTEM.HOME_URL}${child.url}`)
                              }
                            }}
                          >
                            <p>{child.label || child.resourceName || ''}</p>
                          </div>
                        )
                      })}
                    </div>
                  )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return render()
}

export default observer(Left)
