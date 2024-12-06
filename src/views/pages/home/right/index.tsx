/**
 * @fileOverview Home Right
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement, Suspense } from 'react'
import { observer } from 'mobx-react-lite'
import { Route, Routes } from 'react-router-dom'
import Loading from '@views/components/loading/loading'
import ScrollToTop from '@router/scrollToTop'
import { useStore } from '@views/stores'

const Right: React.FC<IRouterProps> = (props: IRouterProps): ReactElement => {
  const { homeStore } = useStore()

  const getRoutes = () => {
    let routes: any = homeStore.getMenuRoutes() || []
    if (routes.length === 0) {
      return null
    }

    return (
      <Routes>
        {routes.map((route: { [K: string]: any }, index: number) => {
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Suspense fallback={<Loading show={true} />}>
                  <ScrollToTop />
                  <route.component />
                </Suspense>
              }
            />
          )
        })}
      </Routes>
    )
  }

  const render = () => {
    return <div className="right grid flex-1 position-relative overflow-auto page-padding">{getRoutes()}</div>
  }

  return render()
}

export default observer(Right)
