/**
 * @fileOverview Home
 * @date 2023-04-12
 * @author poohlaha
 */
import React, { ReactElement, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@views/stores'
import useMount from '@hooks/useMount'
import { USER } from '@views/utils/base'
import { useNavigate } from 'react-router'
import Page from '@views/modules/page'
import RouterUrls from '@route/router.url.toml'
import Left from '@pages/main/left'
import Right from '@pages/main/right'
import { Input, Modal } from 'antd'
import Utils from '@views/utils/utils'

const Home = (): ReactElement => {
  const { loginStore, mainStore } = useStore()
  const navigate = useNavigate()
  const [openUpdate, setOpenUpdate] = useState(false)

  useMount(() => {
    mainStore.userInfo = USER.getUserInfo() || {}
    mainStore.getSelectedKeysByUrl()
  })

  const render = () => {
    return (
      <Page
        className="main-page wh100 overflow-hidden color"
        contentClassName="flex-direction-column !p-0"
        loading={mainStore.loading}
        title={{
          show: false
        }}
      >
        {/* 导航条
        <Navigation
          userName={mainStore.userInfo.userName || ''}
          onLogout={async () => {
            await loginStore.onLogout(async () => {
              await loginStore.getVerificationCode()
              mainStore.onReset()
              setTimeout(() => {
                navigate(RouterUrls.SYSTEM.LOGIN_URL)
              }, 300)
            })
          }}
          onUpdatePwd={() => {
            mainStore.updatePwdForm = Utils.deepCopy(mainStore.UPDATE_PWD_FORM)
            setOpenUpdate(true)
          }}
          onHome={() => navigate('/')}
        />
        */}

        {/* main */}
        <main className="flex-1 w100 overflow-hidden flex">
          <Left
            userName={mainStore.userInfo.userName || ''}
            onLogout={async () => {
              await loginStore.onLogout(async () => {
                await loginStore.getVerificationCode()
                mainStore.onReset()
                setTimeout(() => {
                  navigate(RouterUrls.SYSTEM.LOGIN_URL)
                }, 300)
              })
            }}
            onUpdatePwd={() => {
              mainStore.updatePwdForm = Utils.deepCopy(mainStore.UPDATE_PWD_FORM)
              setOpenUpdate(true)
            }}
            onHome={() => navigate('/')}
          />
          <Right />
        </main>

        {/* 修改密码 */}
        <Modal
          title="友情提示"
          open={openUpdate}
          rootClassName="m-ant-modal"
          maskClosable={false}
          onOk={async () => {
            await mainStore.onUpdatePwd(() => {
              setOpenUpdate(false)
              mainStore.updatePwdForm = Utils.deepCopy(mainStore.UPDATE_PWD_FORM)
            })
          }}
          onCancel={() => {
            setOpenUpdate(false)
            mainStore.updatePwdForm = Utils.deepCopy(mainStore.UPDATE_PWD_FORM)
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
                value={mainStore.updatePwdForm.oldPassword || ''}
                allowClear
                className="m-ant-input"
                onChange={e => {
                  mainStore.updatePwdForm.oldPassword = e.target.value || ''
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
                value={mainStore.updatePwdForm.password || ''}
                allowClear
                className="m-ant-input"
                onChange={e => {
                  mainStore.updatePwdForm.password = e.target.value || ''
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
                value={mainStore.updatePwdForm.againPassword || ''}
                allowClear
                className="m-ant-input"
                onChange={e => {
                  mainStore.updatePwdForm.againPassword = e.target.value || ''
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
