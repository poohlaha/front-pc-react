/**
 * @fileOverview Chat Home
 * @date 2023-08-28
 * @author poohlaha
 */
import React, { ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import Page from '@views/modules/page'

const Home = (): ReactElement => {
  const render = () => {
    return <Page contentClassName="home-page overflow-hidden"></Page>
  }

  return render()
}

export default observer(Home)
