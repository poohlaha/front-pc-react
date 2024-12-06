/**
 * @fileOverview Login
 * @date 2023-04-12
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import useMount from '@hooks/useMount'

const Login: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {
  const { loginStore } = useStore()

  useMount(async () => {
    // TODO
  })

  const render = () => {
    return <div>Login</div>
  }

  return render()
}

export default observer(Login)
