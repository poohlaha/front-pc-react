/**
 * @fileOverview Login
 * @date 2023-04-12
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import useMount from '@hooks/useMount'
import useUnmount from '@hooks/useUnmount'
import { useStore } from '@views/stores'
import Page from '@views/modules/page'
import Loading from '@views/components/loading/loading'
import { Input } from 'antd'
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined, SafetyOutlined, LockOutlined } from '@ant-design/icons'
import LoginLeftPng from '@assets/images/login/loginLeft.png'
import Utils from '@utils/utils'
import RouterUrls from '@route/router.url.toml'
import { useNavigate } from 'react-router'

const Login: React.FC = (): ReactElement => {
  const { loginStore } = useStore()
  const navigate = useNavigate()

  useMount(async () => {
    loginStore.onResetGraphic()
    await loginStore.getVerificationCode()
  })

  useUnmount(() => {
    loginStore.onReset()
  })

  const onLogin = async () => {
    await loginStore.onLogin(() => {
      navigate(`${RouterUrls.SYSTEM.HOME_URL}/`)
    })
  }

  const onEnter = async (event: { [K: string]: any } = {}) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      await onLogin()
    }
  }

  const getVerificationImage = () => {
    if (loginStore.isLoadingImage) {
      return <Loading show={loginStore.isLoadingImage} />
    }

    if (Utils.isBlank(loginStore.graphicImage || '')) {
      return null
    }

    return (
      <img
        src={loginStore.graphicImage || ''}
        className="wh100"
        onClick={async () => await loginStore.getVerificationCode()}
      />
    )
  }

  const render = () => {
    return (
      <Page className="login-page wh100 p-5 bg-white" contentClassName="flex-center" loading={loginStore.loading}>
        <div className="page-content flex bg-white text-sm">
          {/* left background */}
          <div className="login-left">
            <img src={LoginLeftPng} className="wh100 object-cover" alt="" />
          </div>

          <div className="login-right flex-align-center">
            <div className="right-box wh100 flex-direction-column flex-center">
              <div className="login-title flex text-4xl mb-12">
                <p className="">后台管理系统</p>
              </div>

              <div className="login-body">
                <Input
                  allowClear
                  size="large"
                  className="mb-6 m-ant-input-icon"
                  placeholder="请输入工号"
                  value={loginStore.form.loginName || ''}
                  prefix={<UserOutlined />}
                  onKeyDown={async e => await onEnter(e)}
                  onChange={e => {
                    loginStore.form.loginName = e.target.value || ''
                  }}
                />
                <Input.Password
                  allowClear
                  size="large"
                  placeholder="请输入密码"
                  className="mb-6 m-ant-input-icon"
                  value={loginStore.form.password || ''}
                  prefix={<LockOutlined />}
                  onKeyDown={async e => await onEnter(e)}
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  onChange={e => {
                    loginStore.form.password = e.target.value || ''
                  }}
                />

                <div className="yanzhengma flex mb-6">
                  <Input
                    allowClear
                    size="large"
                    placeholder="请输入验证码"
                    className="flex-1 m-ant-input-icon"
                    value={loginStore.form.captchaCode || ''}
                    prefix={<SafetyOutlined />}
                    onKeyDown={async e => await onEnter(e)}
                    onChange={e => {
                      loginStore.form.captchaCode = e.target.value || ''
                    }}
                  />

                  <div className="pic cursor-pointer position-relative ml-6 h-10 w-24">{getVerificationImage()}</div>
                </div>

                <button
                  type="button"
                  className={`button primary w100 h-10 theme-bg rounded flex-center text-white ${loginStore.loading ? 'disabled' : 'cursor-pointer'}`}
                  onClick={async () => await onLogin()}
                >
                  <p>登 录</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Page>
    )
  }

  return render()
}

export default observer(Login)
