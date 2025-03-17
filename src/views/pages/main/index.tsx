/**
 * @fileOverview Home
 * @date 2023-04-12
 * @author poohlaha
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@views/stores'
import useMount from '@hooks/useMount'
import { USER } from '@utils/base'
import { useNavigate } from 'react-router'
import Page from '@views/modules/page'
import RouterUrls from '@route/router.url.toml'
import Navigation from '@pages/main/navigation'
import Left from '@pages/main/left'
import Right from '@pages/main/right'
import { Input, Modal } from 'antd'
import Utils from '@utils/utils'

const Home = (): ReactElement => {
  const { loginStore, homeStore } = useStore()
  const navigate = useNavigate()
  const [openUpdate, setOpenUpdate] = useState(false)

  useMount(() => {
    homeStore.userInfo = USER.getUserInfo() || {}
    homeStore.getSelectedKeysByUrl()
  })

  const render = () => {
    return (
      <Page
        className="home-page wh100 overflow-hidden bg-white"
        contentClassName="flex-direction-column"
        loading={homeStore.loading}
      >
        {/* 导航条 */}
        <Navigation
          userName={homeStore.userInfo.userName || ''}
          onLogout={async () => {
            await loginStore.onLogout(async () => {
              await loginStore.getVerificationCode()
              homeStore.onReset()
              setTimeout(() => {
                navigate(RouterUrls.SYSTEM.LOGIN_URL)
              }, 300)
            })
          }}
          onUpdatePwd={() => {
            homeStore.updatePwdForm = Utils.deepCopy(homeStore.UPDATE_PWD_FORM)
            setOpenUpdate(true)
          }}
          onHome={() => navigate('/')}
        />

        {/* main */}
        <main className="flex-1 w100 overflow-hidden flex">
          <Left />
          <Right />
        </main>

        {/* 修改密码 */}
        <Modal
          title="友情提示"
          open={openUpdate}
          rootClassName="m-ant-modal"
          maskClosable={false}
          onOk={async () => {
            await homeStore.onUpdatePwd(() => {
              setOpenUpdate(false)
              homeStore.updatePwdForm = Utils.deepCopy(homeStore.UPDATE_PWD_FORM)
            })
          }}
          onCancel={() => {
            setOpenUpdate(false)
            homeStore.updatePwdForm = Utils.deepCopy(homeStore.UPDATE_PWD_FORM)
          }}
        >
          <div className="m-ant-modal-form">
            <div className="form-item flex-align-center mb-3">
              <p className="mr-2 flex-align-center">
                <span className="red mr-2">*</span>
                <span className="w-16">旧密码</span>
              </p>
              <Input.Password
                placeholder="请输入"
                value={homeStore.updatePwdForm.oldPassword || ''}
                allowClear
                className="m-ant-input"
                onChange={e => {
                  homeStore.updatePwdForm.oldPassword = e.target.value || ''
                }}
              />
            </div>

            <div className="form-item flex-align-center mb-3">
              <p className="mr-2 flex-align-center">
                <span className="red mr-2">*</span>
                <span className="w-16">新密码</span>
              </p>
              <Input.Password
                placeholder="请输入"
                value={homeStore.updatePwdForm.password || ''}
                allowClear
                className="m-ant-input"
                onChange={e => {
                  homeStore.updatePwdForm.password = e.target.value || ''
                }}
              />
            </div>

            <div className="form-item flex-align-center">
              <p className="mr-2 flex-align-center">
                <span className="red mr-2">*</span>
                <span className="w-16">确认密码</span>
              </p>
              <Input.Password
                placeholder="请输入"
                value={homeStore.updatePwdForm.againPassword || ''}
                allowClear
                className="m-ant-input"
                onChange={e => {
                  homeStore.updatePwdForm.againPassword = e.target.value || ''
                }}
              />
            </div>
          </div>
        </Modal>
      </Page>
    )
  }

  return render()
}

export default observer(Home)
