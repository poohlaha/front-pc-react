/**
 * @fileOverview Menu 1
 * @date 2023-04-12
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@stores/index'
import useMount from '@hooks/useMount'
import Utils from '@utils/utils'
import Loading from '@views/components/loading/loading'

const Login: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {
  const { homeStore } = useStore()

  useMount(async () => {
    await homeStore.getData()
  })

  const render = () => {
    return (
      <div className="right-menu-2 flex-direction-column font-bold cursor-pointer wh100">
        <p className="right-title flex-align-center">Menu 1</p>
        <div className="content">
          {!Utils.isObjectNull(homeStore.data || {}) && JSON.stringify(homeStore.data || {})}
        </div>

        <Loading show={homeStore.loading} />
      </div>
    )
  }

  return render()
}

export default observer(Login)