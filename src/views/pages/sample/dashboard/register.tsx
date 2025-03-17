/**
 * @fileOverview 注册面板
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@views/stores'

const Register = (): ReactElement => {
  const { dashboardStore } = useStore()

  const render = () => {
    return (
      <div className="register-info overview-info">
        <div className="info-content flex-direction-column">
          {/* 注册信息 */}
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {/* 注册总人数 */}
            <div className="info-content-item flex-1 pt-5 pb-5 border-top">
              <div className="info-content-title text-lg/6 font-bold sm:text-sm/6">注册总人数</div>
              <div className="info-content-number mt-3 text-3xl/8 font-semibold sm:text-2xl/8">
                {dashboardStore.detailInfo.registerTotal ?? 0}
              </div>
            </div>

            {/* 近一周注册人数 */}
            <div className="info-content-item flex-1 pt-5 pb-5 border-top">
              <div className="info-content-title text-lg/6 font-bold sm:text-sm/6">近一周注册人数</div>
              <div className="info-content-number mt-3 text-3xl/8 font-semibold sm:text-2xl/8">
                {dashboardStore.detailInfo.registerWeek ?? 0}
              </div>
            </div>

            {/* 昨日注册人数 */}
            <div className="info-content-item flex-1 pt-5 pb-5 border-top">
              <div className="info-content-title text-lg/6 font-bold sm:text-sm/6">昨日注册人数</div>
              <div className="info-content-number mt-3 text-3xl/8 font-semibold sm:text-2xl/8">
                {dashboardStore.detailInfo.registerYesterday ?? 0}
              </div>
            </div>

            {/* 当日注册人数 */}
            <div className="info-content-item flex-1 pt-5 pb-5 border-top">
              <div className="info-content-title text-lg/6 font-bold sm:text-sm/6">当日注册人数</div>
              <div className="info-content-number mt-3 text-3xl/8 font-semibold sm:text-2xl/8">
                {dashboardStore.detailInfo.registerCurDay ?? 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return render()
}

export default observer(Register)
