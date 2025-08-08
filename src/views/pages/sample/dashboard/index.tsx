/**
 * @fileOverview Dashboard
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@views/stores'
import dayjs from 'dayjs'
import { USER } from '@views/utils/base'
import useMount from '@hooks/useMount'
import Register from '@pages/sample/dashboard/register'
import Page from '@views/modules/page'

const Dashboard = (): ReactElement => {
  const { dashboardStore } = useStore()

  useMount(async () => {
    await dashboardStore.getDetailInfo()
  })

  useEffect(() => {
    return () => {
      dashboardStore.onReset()
    }
  }, [])

  const getWelcome = () => {
    const now = dayjs()
    const hour = now.hour()

    let welcomeText = ''
    if (hour < 12) {
      welcomeText += '上午好, '
    } else {
      welcomeText += '下午好, '
    }

    welcomeText += (USER.getUserInfo() || {}).userName || ''
    return welcomeText
  }

  const render = () => {
    return (
      <Page
        className="dashboard-page wh100 overflow-y-auto"
        title={{
          show: false
        }}
      >
        {/* title */}
        <div className="page-title flex-align-center mb-6 pt-6">
          <p className="flex-1 font-bold text-2xl">{getWelcome()}</p>
        </div>

        {/* overview */}
        <div className="overview">
          <p className="h-8 flex-align-center">预览</p>

          <div className="overview-wrapper mt-3 flex-direction-column">
            {/* 用户注册信息 */}
            <Register />
          </div>
        </div>
      </Page>
    )
  }

  return render()
}

export default observer(Dashboard)
